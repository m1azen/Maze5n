// استيراد الدوال المطلوبة من Firebase (الإصدار 11.6.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// إعدادات Firebase (استبدل البيانات بإعدادات مشروعك)
const firebaseConfig = {
  apiKey: "AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0",
  authDomain: "admin-panel-5f716.firebaseapp.com",
  projectId: "admin-panel-5f716",
  storageBucket: "admin-panel-5f716.firebasestorage.app",
  messagingSenderId: "488571843727",
  appId: "1:488571843727:web:3d3d7d5ad495b1fee5acfa",
  measurementId: "G-ZJ9835SCHW"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// عند تحميل الصفحة ننتظر (DOMContentLoaded) ثم نتحقق من حالة تسجيل الدخول
document.addEventListener("DOMContentLoaded", () => {
  // استخدام onAuthStateChanged للتحقق من جلسة Firebase
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // إذا لم يكن المستخدم مسجّل دخول، يتم إعادة التوجيه إلى صفحة تسجيل الدخول
      window.location.href = "login.html";
      return;
    }
    // عند تسجيل الدخول (user موجود) يتم متابعة باقي الكود الخاص بالحضور

    let attendanceCount = 0;
    const totalLessons = 20;

    // عودةً عن استرجاع بيانات المستخدم من localStorage، يتم تجاهل هذه الجزئية هنا لأن الاعتماد أصبح على Firebase
    // (ملاحظة: بيانات الحضور تبقى محفوظة في localStorage لأنها مخصصة لتتبع الحصص)

    // تفعيل الشريط الجانبي
    window.toggleSidebar = function () {
      const sidebar = document.getElementById('sidebar');
      const content = document.querySelector('.content');
      if (sidebar.style.left === '0px') {
        sidebar.style.left = '-250px';
        content.style.marginLeft = '0';
      } else {
        sidebar.style.left = '0px';
        content.style.marginLeft = '250px';
      }
    };

    // تحميل بيانات الحضور المحفوظة في localStorage
    const attendanceData = JSON.parse(localStorage.getItem('attendance')) || {};
    attendanceCount = Object.keys(attendanceData).length;

    // عرض محتوى الدرس وتسجيل الحضور
    window.showLesson = function (lesson, date, videoUrl, lessonText) {
      const lessonTitle = document.getElementById('lessonTitle');
      const lessonDate = document.getElementById('lessonDate');
      const lessonVideoContainer = document.getElementById('lessonVideoContainer');
      const lessonTextContainer = document.getElementById('lessonTextContainer');
      // يتم افتراض أن لكل درس عنصر في القائمة معرفه معتمدًا على اسمه بدون فراغات
      const lessonElement = document.getElementById(lesson.replace(/\s+/g, ''));

      // عرض بيانات الدرس
      lessonTitle.textContent = lesson;
      lessonDate.textContent = `The lesson will start on ${date}.`;
      lessonVideoContainer.innerHTML = `<iframe src="${videoUrl}" width="100%" height="315" frameborder="0" allowfullscreen></iframe>`;
      lessonTextContainer.textContent = lessonText;

      // تسجيل الحضور إن لم يكن مسجلاً سابقًا
      if (!lessonElement.classList.contains('visited')) {
        lessonElement.classList.add('visited');
        const status = lessonElement.querySelector('.status');
        if (status) status.textContent = '✔';
        saveAttendance(lesson);
      }
    };

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

    // تحميل بيانات الحضور للمحتوى في الشريط الجانبي عند تحميل الصفحة
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
});
