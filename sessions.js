let attendanceCount = 0; // عدد الحضور
const totalLessons = 20; // العدد الإجمالي للدروس

// تفعيل الشريط الجانبي
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const content = document.querySelector('.content');
  if (sidebar.style.left === '0px') {
    sidebar.style.left = '-250px'; // إخفاء الشريط
    content.style.marginLeft = '0';
  } else {
    sidebar.style.left = '0px'; // إظهار الشريط
    content.style.marginLeft = '250px';
  }
}

// عرض محتوى الدرس وتسجيل الحضور
function showLesson(lesson, date, videoUrl, lessonText) {
  const lessonTitle = document.getElementById('lessonTitle');
  const lessonDate = document.getElementById('lessonDate');
  const lessonVideoContainer = document.getElementById('lessonVideoContainer');
  const lessonTextContainer = document.getElementById('lessonTextContainer');
  const lessonElement = document.getElementById(lesson.replace(/\s+/g, '').toLowerCase());

  // تعيين محتويات الدرس
  lessonTitle.textContent = lesson;
  lessonDate.textContent = `The lesson will start on ${date}.`;
  lessonVideoContainer.innerHTML = `<iframe src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`;
  lessonTextContainer.textContent = lessonText;

  // تسجيل الحضور وحفظه في localStorage
  if (!lessonElement.classList.contains('visited')) {
    lessonElement.classList.add('visited');
    lessonElement.querySelector('.status').textContent = '✔'; // إضافة علامة صح
    saveAttendance(lesson); // حفظ الحضور
    attendanceCount++;
    updateProgress();
  }
}

// حفظ الحضور في localStorage
function saveAttendance(lesson) {
  const attendanceData = JSON.parse(localStorage.getItem('attendance')) || {}; // استرجاع البيانات القديمة
  attendanceData[lesson] = true; // تعيين الحضور
  localStorage.setItem('attendance', JSON.stringify(attendanceData)); // حفظ البيانات
}

// تحديث نسبة الحضور
function updateProgress() {
  const progressInfo = document.getElementById('progressInfo');
  const percentage = Math.round((attendanceCount / totalLessons) * 100);
  progressInfo.textContent = `Attendance: ${percentage}%`; // تحديث النسبة المعروضة
}

// تحميل الحضور من localStorage عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  const attendanceData = JSON.parse(localStorage.getItem('attendance')) || {}; // قراءة البيانات المخزنة
  const lessonElements = document.querySelectorAll('.sidebar li');

  // تحديث الواجهة استنادًا إلى حالة الحضور
  lessonElements.forEach((lessonElement) => {
    const lessonName = lessonElement.textContent.split(' ')[0]; // استخراج اسم الدرس
    if (attendanceData[lessonName]) {
      lessonElement.classList.add('visited'); // وضع الحالة كـ "تم الحضور"
      lessonElement.querySelector('.status').textContent = '✔'; // عرض علامة "صح"
      attendanceCount++;
    }
  });

  // تحديث نسبة الحضور
  updateProgress();
});
