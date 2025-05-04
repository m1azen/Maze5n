// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase configuration
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

  // Validate password length
  if (password.length < 6) {
    statusMsg.style.background = "red";
    statusMsg.textContent = "❌ Password must be at least 6 characters!";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // User data structure
    const userData = {
      username: username,
      email: user.email,
      userId: user.uid,
      createdAt: new Date(),
      status: "Active",
      courses: {
        course1: "Inactive",
        course2: "Inactive",
        course3: "Inactive",
        course4: "Inactive",
        course5: "Inactive",
      },
      startMessage: "Your courses will start on June 15, 2025."
    };

    // Save user data using setDoc()
    await setDoc(doc(db, "usersData", user.uid), userData);

    statusMsg.style.background = "#00ffcc";
    statusMsg.textContent = `✅ Account created successfully, ${username}! ${userData.startMessage} Redirecting...`;

    setTimeout(() => {
      window.location.href = "html.html";
    }, 3000);
  } catch (error) {
    console.error("Error:", error);
    statusMsg.style.background = "red";
    statusMsg.textContent = "❌ Something went wrong. Please contact Mazen for support.";

    // Add a button to contact Mazen via WhatsApp
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

document.getElementById("signupForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  register(username, email, password);
});
