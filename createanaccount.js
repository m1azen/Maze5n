// استيراد الدوال المطلوبة من مكتبة Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// إعدادات Firebase
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
const db = getFirestore(app);

// دالة إنشاء الحساب وحفظ البيانات
async function register(email, password) {
  const statusMsg = document.getElementById("statusMsg");
  statusMsg.style.color = "white";
  statusMsg.textContent = "Creating account... ⏳";

  if (password.length < 6) {
    statusMsg.style.background = "red";
    statusMsg.textContent = "❌ Password must be at least 6 characters!";
    return;
  }

  try {
    await setPersistence(auth, browserLocalPersistence);

    // التحقق إذا كان الإيميل مستخدم مسبقًا
    const existingMethods = await fetchSignInMethodsForEmail(auth, email);
    if (existingMethods.length > 0) {
      statusMsg.style.background = "orange";
      statusMsg.textContent = "⚠️ This email is already in use!";
      return;
    }

    // إنشاء الحساب
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // إرسال رسالة تحقق بالبريد الإلكتروني
    await sendEmailVerification(user);

    // حفظ بيانات المستخدم في Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      subscribedCourses: [], // هنا هتضيف الكورسات المفعلة للمستخدم
      registrationDate: new Date(),
    });

    statusMsg.style.background = "#00cc99";
    statusMsg.textContent = `✅ Account created for ${user.email}. Please check your inbox to verify your email.`;

    // إعادة التوجيه بعد 5 ثوانٍ
    setTimeout(() => {
      window.location.href = "html.html";
    }, 5000);

  } catch (error) {
    console.error("Error:", error);
    statusMsg.style.background = "red";
    statusMsg.textContent = "❌ Something went wrong. Please contact Mazen for help.";

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
      window.location.href = "https://wa.me/qr/CZO3X7WAZOEEE1";
    });

    statusMsg.appendChild(contactButton);
  }
}

// الحدث عند إرسال النموذج
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  register(email, password);
});
