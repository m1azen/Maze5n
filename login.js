// استيراد الدوال المطلوبة من Firebase (الإصدار 11.6.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

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

// التحقق إذا كان المستخدم مسجّل دخول مسبقًا
onAuthStateChanged(auth, (user) => {
  if (user) {
    alert("أنت مسجّل دخول بالفعل، جارٍ إعادة التوجيه...");
    window.location.href = "html.html";
  }
});

/**
 * وظيفة تسجيل الدخول:
 * - تعيين persistence لجلسة تسجيل الدخول بحيث تبقى الجلسة محفوظة محليًا.
 * - إذا كان تسجيل الدخول ناجحًا، تعرض رسالة نجاح ثم تنتظر 5 ثوانٍ لإعادة التوجيه.
 * - في حال وقوع خطأ يتم التحقق مما إذا كان الحساب معطل أو خطأ عام؛ ويظهر رسالة مناسبة مع زر للتواصل مع مازن.
 */
async function login(email, password) {
  const statusMsg = document.getElementById("statusMsg");
  // تعيين اللون الأبيض للنص وإظهار رسالة بدء العملية
  statusMsg.style.color = "white";
  statusMsg.textContent = "جاري تسجيل الدخول... ⏳";

  try {
    // تعيين persistence بحيث تظل جلسة المستخدم محلية
    await setPersistence(auth, browserLocalPersistence);

    // محاولة تسجيل الدخول باستخدام Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // عند نجاح تسجيل الدخول
    statusMsg.style.background = "#00ffcc";
    statusMsg.textContent = `✅ تم تسجيل الدخول بنجاح! مرحباً، ${userCredential.user.email}`;

    // الانتظار لمدة 5 ثوانٍ ثم إعادة التوجيه إلى صفحة html.html
    setTimeout(() => {
      window.location.href = "html.html";
    }, 5000);
  } catch (error) {
    console.error("Error:", error);
    statusMsg.style.background = "red";

    // التحقق إذا كان الخطأ بسبب تعطيل الحساب
    if (error.code === "auth/user-disabled") {
      statusMsg.textContent = "❌ حسابك معطل ولا يمكنك تسجيل الدخول.";
    } else {
      statusMsg.textContent = "❌ حدث خطأ أثناء تسجيل الدخول. الرجاء التواصل مع مازن للدعم.";
    }

    // إنشاء زر للتواصل مع مازن في حال وجود أي مشكلة
    const contactButton = document.createElement("button");
    contactButton.textContent = "Contact Mazen";
    contactButton.style.marginTop = "10px";
    contactButton.style.padding = "10px";
    contactButton.style.backgroundColor = "#005bea";
    contactButton.style.color = "white";
    contactButton.style.border = "none";
    contactButton.style.borderRadius = "5px";
    contactButton.style.cursor = "pointer";

    contactButton.addEventListener("click", () => {
      window.location.href = "https://wa.me/qr/CZO3X7WAZOEEE1"; // رابط للتواصل مع مازن عبر واتساب
    });

    statusMsg.appendChild(contactButton);
  }
}

// الاستماع لحدث إرسال النموذج الخاص بتسجيل الدخول
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); // منع إعادة تحميل الصفحة
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  login(email, password);
});
// التحقق من حالة المستخدم عند تحميل الصفحة
    window.addEventListener("load", () => {
      const user = auth.currentUser;  // تحقق من المستخدم الحالي
      if (user) {
        console.log("المستخدم مسجل دخول:", user.email);
        window.location.href = "html.html";  // إذا كان مسجل دخول، توجهه مباشرة للصفحة
      } else {
        console.log("المستخدم غير مسجل دخول.");
      }
