import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

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

// التحقق من تسجيل الدخول وجلب بيانات المستخدم
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Please log in to view your account.");
    window.location.href = "login.html";
    return;
  }

  const userDocRef = doc(db, "usersData", user.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();

    document.getElementById("username").textContent = userData.username;
    document.getElementById("email").textContent = userData.email;
    document.getElementById("status").textContent = userData.status;
    document.getElementById("startMessage").textContent = userData.startMessage;

    // حساب الكورسات المتفاعلة
    const activeCourses = Object.values(userData.courses).filter(course => course === "Active").length;
    document.getElementById("activeCourses").textContent = activeCourses;
  } else {
    alert("Account data not found.");
  }
});

// تحديث رسالة بدء الكورسات
document.getElementById("updateMessageBtn").addEventListener("click", async () => {
  const newMessage = document.getElementById("newMessage").value.trim();
  if (!newMessage) {
    alert("Please enter a new message.");
    return;
  }

  const user = auth.currentUser;
  if (user) {
    const userDocRef = doc(db, "usersData", user.uid);
    await updateDoc(userDocRef, { startMessage: newMessage });

    document.getElementById("startMessage").textContent = newMessage;
    alert("Message updated successfully!");
  }
});

// تسجيل الخروج
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    alert("✅ You have logged out successfully!");
    window.location.href = "login.html";
  }).catch((error) => {
    console.error("Logout Error:", error);
    alert("❌ Something went wrong while logging out.");
  });
});
