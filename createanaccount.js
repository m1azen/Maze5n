// استيراد الدوال المطلوبة من Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0",
  authDomain: "admin-panel-5f716.firebaseapp.com",
  projectId: "admin-panel-5f716",
  storageBucket: "admin-panel-5f716.firebasestorage.app",
  messagingSenderId: "488571843727",
  appId: "1:488571843727:web:babc4f1bbcc7eeb8705d77",
  measurementId: "G-ZJ9835SCHW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function register(username, email, password) {
  const statusMsg = document.getElementById("statusMsg");

  // التحقق من طول كلمة المرور
  if (password.length < 6) {
    statusMsg.style.background = "red";
    statusMsg.textContent = "❌ Password must be at least 6 characters!";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // إعداد بيانات الدورات التدريبية
    const courses = {
      course1: "Inactive",
      course2: "Inactive",
      course3: "Inactive",
      course4: "Inactive",
      course5: "Inactive",
    };

    // إعداد رسالة بدء الكورسات
    const startMessage = "Your courses will start on June 15, 2025.";

    // حفظ بيانات المستخدم في Firestore
    await addDoc(collection(db, "usersData"), {
      username: username, // حفظ اسم المستخدم
      email: user.email,
      userId: user.uid,
      createdAt: new Date(),
      status: "Active",
      courses: courses,
      startMessage: startMessage,
    });

    statusMsg.style.background = "#00ffcc";
    statusMsg.textContent = `✅ Account created successfully, ${username}! ${startMessage} Redirecting...`;

    // إعادة التوجيه بعد 3 ثوانٍ
    setTimeout(() => {
      window.location.href = "html.html";
    }, 3000);
  } catch (error) {
    console.error("Error:", error);
    statusMsg.style.background = "red";
    statusMsg.textContent = "❌ Something went wrong. Please contact Mazen for support.";

    // إضافة زر للتواصل مع مازن عبر واتساب
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

// استماع للنموذج الخاص بإنشاء الحساب
document.getElementById("signupForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  register(username, email, password);
});
