// استيراد الدوال اللازمة من Firebase (الإصدار 11.6.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// إعدادات Firebase الخاصة بمشروعك
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

document.addEventListener("DOMContentLoaded", () => {
  // عند تغير الحالة (دخول/خروج)، نتحقق مما إذا كان المستخدم مسجّل دخول أم لا
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // عرض بيانات المستخدم
      // الاسم ثابت "مبرمجنا" كما طلبت، والبريد الإلكتروني يأتي من بيانات Firebase
      document.getElementById("username").textContent = "مبرمجنا";
      document.getElementById("email").textContent = user.email;
    } else {
      // إذا لم يكن المستخدم مسجّل دخول يتم إرجاعه إلى صفحة تسجيل الدخول
      window.location.href = "login.html";
    }
  });

  // تفعيل زر تسجيل الخروج
  document.getElementById("logoutButton").addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        alert("تم تسجيل الخروج بنجاح!");
        window.location.href = "login.html";
      })
      .catch((error) => {
        // عرض رسالة في حال حدوث خطأ أثناء تسجيل الخروج
        alert("حدث خطأ أثناء تسجيل الخروج: " + error.message);
      });
  });
});
