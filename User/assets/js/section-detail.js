const API_ROOT = "https://unchanneled-marcy-unnegotiated.ngrok-free.dev";

const btnLessonList = document.getElementById("btnLessonList");
const dropdownLessonList = document.getElementById("dropdownLessonList");
const sectionList = document.getElementById("sectionList");
const sectionCount = document.getElementById("sectionCount");
const lessonTitle = document.getElementById("lessonTitle");
const breadcrumbTitle = document.getElementById("breadcrumbTitle");
const currentSectionTitle = document.getElementById("currentSectionTitle");
const videoBox = document.getElementById("videoBox");
const prevSectionBtn = document.getElementById("prevSectionBtn");
const nextSectionBtn = document.getElementById("nextSectionBtn");
const backBtn = document.getElementById("backBtn");

btnLessonList?.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdownLessonList?.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
  if (
    dropdownLessonList &&
    btnLessonList &&
    !dropdownLessonList.contains(e.target) &&
    !btnLessonList.contains(e.target)
  ) {
    dropdownLessonList.classList.add("hidden");
  }
});

function getParamsFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    lessonId: params.get("lessonId") || "1",
    sectionId: params.get("sectionId") || "1",
  };
}

function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function playVideo(videoUrl) {
  if (!videoUrl) {
    videoBox.innerHTML = `
      <div class="w-full h-full flex items-center justify-center text-red-500 text-lg bg-gray-100">
        Không có video cho section này
      </div>
    `;
    return;
  }

  videoBox.innerHTML = `
    <video class="w-full h-full object-cover bg-black" controls autoplay playsinline>
      <source src="${videoUrl}" type="video/mp4">
      Trình duyệt không hỗ trợ video.
    </video>
  `;
}

window.playVideo = playVideo;

function renderVideoPlaceholder(videoUrl) {
  if (!videoUrl) {
    videoBox.innerHTML = `
      <div class="w-full h-full flex items-center justify-center text-red-500 text-lg bg-gray-100">
        Không có video cho section này
      </div>
    `;
    return;
  }

  const safeVideoUrl = String(videoUrl).replaceAll("'", "\\'");

  videoBox.innerHTML = `
    <div
      class="w-full h-full relative flex justify-center items-center cursor-pointer group bg-gray-300"
      onclick="playVideo('${safeVideoUrl}')"
    >
      <div class="flex items-center gap-4 pointer-events-none">
        <div class="w-16 h-16 bg-blue-600 rounded-xl flex justify-center items-center">
          <i class="fa-solid fa-graduation-cap text-white text-3xl"></i>
        </div>
        <div class="text-6xl font-extrabold text-gray-600 tracking-wider">
          TENG.VN
        </div>
      </div>

      <div
        class="absolute w-16 h-16 bg-black/50 rounded-full flex justify-center items-center text-white text-2xl group-hover:bg-black/70 group-hover:scale-110 transition-all"
      >
        <i class="fa-solid fa-play ml-1"></i>
      </div>
    </div>
  `;
}

function renderSectionList(currentSection, sections, lessonId) {
  sectionList.innerHTML = "";

  if (!sections.length) {
    sectionList.innerHTML = `
      <div class="px-5 py-4 text-sm text-gray-500">
        Chưa có section nào
      </div>
    `;
    return;
  }

  sections.forEach((section) => {
    const isActive = Number(section.id) === Number(currentSection.id);

    const item = document.createElement("a");
    item.href = `?lessonId=${lessonId}&sectionId=${section.id}`;
    item.className = isActive
      ? "px-5 py-3.5 hover:bg-gray-50 flex items-center gap-3 text-sm text-blue-600 font-semibold bg-blue-50/50 border-l-4 border-blue-600"
      : "px-5 py-3.5 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 font-medium";

    item.innerHTML = `
      <i class="fa-solid fa-circle-check ${section.complete ? "text-green-500" : "text-gray-300"}"></i>
      <span>Section ${section.position}: ${escapeHtml(section.title)}</span>
    `;

    sectionList.appendChild(item);
  });
}

function renderNavigation(currentSection, sections, lessonId) {
  const currentIndex = sections.findIndex(
    (s) => Number(s.id) === Number(currentSection.id)
  );

  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection =
    currentIndex >= 0 && currentIndex < sections.length - 1
      ? sections[currentIndex + 1]
      : null;

  if (prevSection) {
    prevSectionBtn.href = `?lessonId=${lessonId}&sectionId=${prevSection.id}`;
    prevSectionBtn.classList.remove("pointer-events-none", "opacity-50");
  } else {
    prevSectionBtn.href = "#";
    prevSectionBtn.classList.add("pointer-events-none", "opacity-50");
  }

  if (nextSection) {
    nextSectionBtn.href = `?lessonId=${lessonId}&sectionId=${nextSection.id}`;
    nextSectionBtn.classList.remove("pointer-events-none", "opacity-50");
  } else {
    nextSectionBtn.href = "#";
    nextSectionBtn.classList.add("pointer-events-none", "opacity-50");
  }
}

function renderSectionPage(data, lessonId) {
  const sections = Array.isArray(data.SectionByLessonId)
    ? [...data.SectionByLessonId].sort((a, b) => a.position - b.position)
    : [];

  const lessonName = data.lesson_title || `Lesson ${data.lesson_id || lessonId}`;

  lessonTitle.textContent = lessonName;
  breadcrumbTitle.textContent = lessonName;
  currentSectionTitle.textContent = `Section ${data.position}: ${data.title}`;
  sectionCount.textContent = `${sections.length}/${sections.length} Sections`;
  document.title = `Section ${data.position} - ${data.title} - TENG`;

  renderVideoPlaceholder(data.video_url);
  renderSectionList(data, sections, lessonId);
  renderNavigation(data, sections, lessonId);
}

function renderLoading() {
  currentSectionTitle.textContent = "Đang tải section...";
  videoBox.innerHTML = `
    <div class="w-full h-full flex items-center justify-center text-gray-600 text-lg bg-gray-100">
      Đang tải video...
    </div>
  `;
}

function renderError(message = "Lỗi tải dữ liệu từ API") {
  currentSectionTitle.textContent = "Không tải được dữ liệu bài học";
  videoBox.innerHTML = `
    <div class="w-full h-full flex items-center justify-center text-red-500 text-lg bg-gray-100 px-4 text-center">
      ${escapeHtml(message)}
    </div>
  `;
  sectionList.innerHTML = `
    <div class="px-5 py-4 text-sm text-red-500">
      Không thể tải danh sách section
    </div>
  `;
}

async function loadSection() {
  try {
    renderLoading();

    const { lessonId, sectionId } = getParamsFromUrl();
    const apiUrl = `${API_ROOT}/courses/chapter/lesson/${lessonId}/section/${sectionId}`;

    console.log("lessonId =", lessonId);
    console.log("sectionId =", sectionId);
    console.log("apiUrl =", apiUrl);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - Không thể tải section`);
    }

    const data = await response.json();
    console.log("Section data:", data);

    renderSectionPage(data, lessonId);
  } catch (error) {
    console.error("Load section failed:", error);
    renderError(error.message || "Lỗi không xác định");
  }
}

backBtn?.addEventListener("click", function (e) {
  e.preventDefault();
  const { lessonId } = getParamsFromUrl();
  window.location.href = `chapter-detail.html?lessonId=${lessonId}`;
});

document.addEventListener("DOMContentLoaded", loadSection);

async function checkLoginSession() {
    try {
      const response = await fetch("https://unchanneled-marcy-unnegotiated.ngrok-free.dev/user/me", {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        window.location.href = "index.html";
        return;
      }

      const user = await response.json();
      console.log("Đã đăng nhập:", user);
    } catch (error) {
      console.error("Lỗi kiểm tra session:", error);
      window.location.href = "index.html";
    }
  }