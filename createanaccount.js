// استيراد الدوال المطلوبة من مكتبة Firebase (الإصدار 11.6.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence, 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// إعدادات Firebase (استبدلها بإعدادات مشروعك)
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

/**
 * وظيفة إنشاء الحساب.
 * تتحقق أولاً من طول كلمة المرور (لا تقل عن 6 أحرف) ثم تُعين persistence لجلسة تسجيل الدخول.
 * عند نجاح العملية، تعرض رسالة نجاح ثم تنتظر 5 ثوانٍ قبل إعادة التوجيه.
 * إذا حدث خطأ يتم إظهار رسالة مناسبة مع زر التواصل مع مازن.
 */
async function register(email, password) {
  const statusMsg = document.getElementById("statusMsg");
  statusMsg.style.color = "white";
  statusMsg.textContent = "Creating account... ⏳";

  // التحقق من طول كلمة المرور (Firebase تشترط 6 أحرف كحد أدنى)
  if (password.length < 6) {
    statusMsg.style.background = "red";
    statusMsg.textContent = "❌ Password must be at least 6 characters!";
    return;
  }

  try {
    // تعيين persistence بحيث يبقى المستخدم مُسجّل الدخول (sessions تُحفظ محلياً)
    await setPersistence(auth, browserLocalPersistence);

    // محاولة إنشاء الحساب باستخدام Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // عرض رسالة نجاح للمستخدم مع بريدهم المسجّل
    statusMsg.style.background = "#00ffcc";
    statusMsg.textContent = `✅ Account created successfully! Welcome, ${user.email}`;

    // الانتظار لمدة 5 ثواني قبل إعادة التوجيه إلى "html.html"
    setTimeout(() => {
      window.location.href = "html.html"; // تأكد من صحة المسار حسب هيكل مجلدات مشروعك
    }, 5000);
    
  } catch (error) {
    console.error("Error:", error);
    statusMsg.style.background = "red";
    statusMsg.textContent = "❌ Something went wrong. Please contact Mazen for support.";

    // إنشاء زر للتواصل مع مازن في حالة حدوث خطأ
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

// استماع لحدث إرسال النموذج (form submission)
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault(); // منع إعادة تحميل الصفحة
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  register(email, password);
});
