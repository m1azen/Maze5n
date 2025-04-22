let attendanceCount = 0;
const totalLessons = 20;

// التحقق من تسجيل الدخول
const username = localStorage.getItem("username");
if (!username || localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "login.html";
}

// تفعيل الشريط الجانبي
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const content = document.querySelector('.content');
  if (sidebar.style.left === '0px') {
    sidebar.style.left = '-250px';
    content.style.marginLeft = '0';
  } else {
    sidebar.style.left = '0px';
    content.style.marginLeft = '250px';
  }
}

// تحميل البيانات المحفوظة
const attendanceData = JSON.parse(localStorage.getItem('attendance')) || {};
attendanceCount = Object.keys(attendanceData).length;

// عرض محتوى الدرس وتسجيل الحضور
function showLesson(lesson, date, videoUrl, lessonText) {
  const lessonTitle = document.getElementById('lessonTitle');
  const lessonDate = document.getElementById('lessonDate');
  const lessonVideoContainer = document.getElementById('lessonVideoContainer');
  const lessonTextContainer = document.getElementById('lessonTextContainer');
  const lessonElement = document.getElementById(lesson.replace(/\s+/g, ''));

  // عرض البيانات
  lessonTitle.textContent = lesson;
  lessonDate.textContent = `The lesson will start on ${date}.`;
  lessonVideoContainer.innerHTML = `<iframe src="${videoUrl}" width="100%" height="315" frameborder="0" allowfullscreen></iframe>`;
  lessonTextContainer.textContent = lessonText;

  // تسجيل الحضور إن لم يكن قد سُجل
  if (!lessonElement.classList.contains('visited')) {
    lessonElement.classList.add('visited');
    const status = lessonElement.querySelector('.status');
    if (status) status.textContent = '✔';
    saveAttendance(lesson);
  }
}

// حفظ الحضور في localStorage
function saveAttendance(lesson) {
  const attendanceData = JSON.parse(localStorage.getItem('attendance')) || {};
  if (!attendanceData[lesson]) {
    attendanceData[lesson] = true;
    localStorage.setItem('attendance', JSON.stringify(attendanceData));
    attendanceCount++;
    updateProgress();
  }
}

// تحديث نسبة الحضور
function updateProgress() {
  const progressInfo = document.getElementById('progressInfo');
  const percentage = Math.round((attendanceCount / totalLessons) * 100);
  progressInfo.textContent = `Attendance: ${percentage}%`;
}

// تحميل الحضور من localStorage عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  const attendanceData = JSON.parse(localStorage.getItem('attendance')) || {};
  const lessonElements = document.querySelectorAll('.sidebar li');

  lessonElements.forEach((lessonElement) => {
    const lessonName = lessonElement.textContent.split(' ')[0].trim();
    if (attendanceData[lessonName]) {
      lessonElement.classList.add('visited');
      const status = lessonElement.querySelector('.status');
      if (status) status.textContent = '✔';
    }
  });

  updateProgress();
});
