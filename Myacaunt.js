import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

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

async function loadAccountData(user) {
  const userDocRef = doc(db, "usersData", user.uid);
  const userSnapshot = await getDoc(userDocRef);
  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();

    document.getElementById("username").textContent = userData.username;
    document.getElementById("email").textContent = userData.email;
    document.getElementById("status").textContent = userData.status;
    document.getElementById("startMessage").textContent = userData.startMessage;

    const activeCourses = Object.values(userData.courses).filter(status => status === "Active").length;
    document.getElementById("activeCourses").textContent = activeCourses;

    // إخفاء شاشة التحميل وإظهار المحتوى
    setTimeout(() => {
      document.getElementById("loadingScreen").classList.add("hidden");
      document.getElementById("accountContent").style.display = "block";
    }, 2000); // الانتظار 2 ثانية بعد تحميل البيانات ثم إظهار الصفحة
  } else {
    alert("Account data not found.");
  }
}

function periodicCheck() {
  setInterval(() => {
    const user = auth.currentUser;
    if (!user) {
      alert("You are not logged in, please log in again.");
      window.location.href = "login.html";
    } else {
      loadAccountData(user).then(() => {
        getDoc(doc(db, "usersData", user.uid)).then(snapshot => {
          const data = snapshot.data();
          if (data.status !== "Active") {
            alert("Your account is not active. Please contact support.");
            window.location.href = "login.html";
          }
        });
      });
    }
  }, 10000);
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Please log in to view your account.");
    window.location.href = "login.html";
    return;
  }
  await loadAccountData(user);
  periodicCheck();
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("You have logged out successfully!");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Logout Error:", error);
      alert("Something went wrong while logging out.");
    });
});
