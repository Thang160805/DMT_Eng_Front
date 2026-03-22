async function loadChapterDetail() {
  try {
    const params = new URLSearchParams(window.location.search);
    const chapterId = params.get("id");

    if (!chapterId) {
      document.getElementById("chapterTitle").textContent =
        "Không tìm thấy chapter";
      document.getElementById("chapterDescription").textContent = "";
      document.getElementById("lessonList").innerHTML =
        '<p class="text-red-500">Thiếu chapterId trên URL.</p>';
      return;
    }

    const response = await fetch(
      `https://unchanneled-marcy-unnegotiated.ngrok-free.dev/courses/chapter/${chapterId}`
    );

    if (!response.ok) {
      throw new Error("API lỗi: " + response.status);
    }

    const chapter = await response.json();
    console.log("chapter =", chapter);

    document.getElementById("chapterTitle").textContent =
      chapter.title || "Không có tiêu đề";

    document.getElementById("chapterDescription").textContent =
      chapter.description || "Chưa có mô tả.";

    const total = chapter.Section_Count ?? 0;
    const done = chapter.Section_Count_Complete ?? 0;

    document.getElementById("chapterProgress").textContent =
      total > 0 && done === total
        ? "Đã hoàn thành"
        : `Đã học ${done}/${total} Units`;

    const lessonList = document.getElementById("lessonList");
    lessonList.innerHTML = "";

    const lessons = chapter.lessons || chapter.lesson_Chapter || [];

    if (!lessons.length) {
      lessonList.innerHTML =
        '<p class="text-gray-500">Chương này chưa có bài học nào.</p>';
      return;
    }

    lessons.forEach((lesson, index) => {
      const lessonDone = lesson.SectionCompleteCount ?? 0;
      const lessonTotal = lesson.SectionCount ?? 0;

      const isCompleted = lessonTotal > 0 && lessonDone === lessonTotal;
      const lessonNumber = String(index + 1).padStart(2, "0");

      const sectionsHtml = (lesson.sections || [])
        .map((section, secIndex) => {
          const isComplete =
            section.complete ?? section.completed ?? section.isComplete ?? false;

          return `
            <div
              class="px-16 py-3.5 hover:bg-gray-50 cursor-pointer text-sm flex items-center gap-3 font-medium text-gray-700"
              onclick="window.location.href='section-detail.html?lessonId=${section.lesson_id}&sectionId=${section.id}'"
            >
              <i class="fa-solid ${isComplete ? "fa-circle-check text-green-500" : "fa-circle text-gray-300"}"></i>
              Section ${secIndex + 1}: ${section.title}
            </div>
          `;
        })
        .join("");

      const lessonItem = document.createElement("div");
      lessonItem.className =
        "accordion-item bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm";

      if (index === 0) {
        lessonItem.classList.add("active");
      }

      lessonItem.innerHTML = `
        <div
          class="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors lesson-header"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-14 border-2 ${
                isCompleted ? "border-green-500" : "border-gray-300"
              } rounded-lg flex flex-col items-center justify-between overflow-hidden"
            >
              <span class="font-bold ${
                isCompleted ? "text-green-500" : "text-gray-500"
              } mt-1">${lessonNumber}</span>
              <span
                class="${
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                } text-white text-[8px] font-bold w-full text-center py-0.5"
              >
                ${isCompleted ? "HOÀN THÀNH" : "ĐANG HỌC"}
              </span>
            </div>
            <div>
              <h3 class="font-bold text-base mb-1 text-gray-900">
                ${lesson.title}
              </h3>
              <p class="text-xs text-gray-500 font-medium">
                ${lessonDone}/${lessonTotal} Sections
              </p>
            </div>
          </div>
          <i
            class="fa-solid fa-chevron-down text-gray-400 chevron-icon transition-transform duration-300"
          ></i>
        </div>

        <div class="accordion-content border-t border-gray-100 py-2 bg-white">
          ${sectionsHtml || '<div class="px-16 py-3.5 text-sm text-gray-400">Chưa có section nào</div>'}
        </div>
      `;

      lessonList.appendChild(lessonItem);
    });

    bindAccordion();
  } catch (error) {
    console.error("Lỗi tải chapter:", error);
    document.getElementById("chapterTitle").textContent =
      "Không tải được chapter";
    document.getElementById("chapterDescription").textContent = "";
    document.getElementById("lessonList").innerHTML =
      '<p class="text-red-500">Không thể tải dữ liệu chapter.</p>';
  }
}

function bindAccordion() {
  const lessonHeaders = document.querySelectorAll(".lesson-header");
  lessonHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      this.parentElement.classList.toggle("active");
    });
  });
}

document.addEventListener("DOMContentLoaded", loadChapterDetail);

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
