function getStyleBySkill(skill) {
  const key = (skill || "").toLowerCase();

  switch (key) {
    case "grammar":
      return {
        bg: "from-blue-50 to-indigo-50",
        iconColor: "text-indigo-400",
        icon: "fa-book-open-reader",
        label: "NGỮ PHÁP",
      };

    case "speaking":
      return {
        bg: "from-blue-50 to-cyan-50",
        iconColor: "text-cyan-400",
        icon: "fa-microphone-lines",
        label: "SPEAKING",
      };

    case "listening":
      return {
        bg: "from-blue-50 to-orange-50",
        iconColor: "text-orange-400",
        icon: "fa-headphones",
        label: "LISTENING",
      };

    case "vocabulary":
      return {
        bg: "from-blue-50 to-pink-50",
        iconColor: "text-pink-400",
        icon: "fa-spell-check",
        label: "TỪ VỰNG",
      };

    case "writing":
      return {
        bg: "from-blue-50 to-emerald-50",
        iconColor: "text-emerald-400",
        icon: "fa-pen-nib",
        label: "WRITING",
      };

    case "pronunciation":
      return {
        bg: "from-blue-50 to-sky-50",
        iconColor: "text-sky-400",
        icon: "fa-volume-high",
        label: "PHÁT ÂM",
      };

    default:
      return {
        bg: "from-gray-50 to-slate-100",
        iconColor: "text-gray-400",
        icon: "fa-book",
        label: "CHƯƠNG HỌC",
      };
  }
}

async function loadCoursesWithChapters() {
  try {
    const response = await fetch("http://localhost:8080/courses");
    const courses = await response.json();

    const courseWrapper = document.getElementById("courseWrapper");
    courseWrapper.innerHTML = "";

    courses.forEach((course) => {
      const section = document.createElement("section");
      section.className = "mb-14";

      const chapterHtml = (course.chapter_Course || [])
        .map((chapter) => {
          const style = getStyleBySkill(chapter.skill);
          const progressHtml =
            chapter.Section_Count_Complete === chapter.Section_Count
              ? `
      <div class="flex items-center text-xs font-semibold text-green-500">
        <i class="fa-solid fa-circle-check mr-2"></i>
        <span>Đã hoàn thành</span>
      </div>
    `
              : `
      <div class="text-[13px] text-gray-400">
        Đã học ${chapter.Section_Count_Complete}/${chapter.Section_Count} Units
      </div>
    `;

          return `
              <div
                class="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden transition-all hover:scale-105 hover:shadow-lg cursor-pointer group"
                onclick="window.location.href='../User/chapter-detail.html?id=${chapter.id}'"
              >
                <div class="h-32 bg-gradient-to-br ${style.bg} relative p-4">
                  <div class="flex flex-col">
                    <span class="text-[10px] font-bold text-gray-700 uppercase">
                      ${style.label}
                    </span>
                    <span class="text-xs text-gray-500 mt-1">
                      ${chapter.description ? chapter.description : "Nội dung chương"}
                    </span>
                  </div>
                  <div class="absolute right-4 bottom-2 text-5xl ${style.iconColor} opacity-20 group-hover:opacity-40 transition-opacity">
                    <i class="fa-solid ${style.icon}"></i>
                  </div>
                </div>
                <div class="p-5 flex flex-col justify-between flex-1">
                  <h3 class="font-bold text-gray-900 text-[15px] mb-4 group-hover:text-blue-600 transition-colors">
                    ${chapter.title}
                  </h3>
                  ${progressHtml}
                </div>
              </div>
            `;
        })
        .join("");

      section.innerHTML = `
          <h2 class="text-lg font-bold text-gray-900 mb-6">${course.title}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${chapterHtml || '<p class="text-gray-500">Chưa có chương nào.</p>'}
          </div>
        `;

      courseWrapper.appendChild(section);
    });
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
    document.getElementById("courseWrapper").innerHTML =
      '<p class="text-red-500">Không thể tải dữ liệu khóa học.</p>';
  }
}

loadCoursesWithChapters();
