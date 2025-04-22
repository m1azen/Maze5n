import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0",
  authDomain: "admin-panel-5f716.firebaseapp.com",
  projectId: "admin-panel-5f716",
  storageBucket: "admin-panel-5f716.firebasestorage.app",
  messagingSenderId: "488571843727",
  appId: "1:488571843727:web:3d3d7d5ad495b1fee5acfa",
  measurementId: "G-ZJ9835SCHW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// وظيفة إنشاء حساب جديد
async function register(email, password) {
  const statusMsg = document.getElementById("statusMsg");
  statusMsg.style.color = "white";
  statusMsg.textContent = "Creating account... ⏳";

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // نجاح إنشاء الحساب
    statusMsg.style.background = "#00ffcc";
    statusMsg.textContent = `✅ Account created successfully! Welcome, ${user.email}`;
  } catch (error) {
    // التعامل مع الخطأ
    console.error("Error:", error);

    statusMsg.style.background = "red";
    statusMsg.textContent = "❌ Something went wrong. Please contact Mazen for support.";

    // زر التواصل مع مازن
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
      window.location.href = "https://wa.me/qr/CZO3X7WAZOEEE1"; // رابط للتواصل مع مازن
    });

    statusMsg.appendChild(contactButton);
  }
}

// استماع للنموذج
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  register(email, password);
});
