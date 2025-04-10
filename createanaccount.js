import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCc_LyGshkApqre4NIRKF7UTNjfE08cenw",
  authDomain: "websits-turoria.firebaseapp.com",
  projectId: "websits-turoria",
  storageBucket: "websits-turoria.appspot.com",
  messagingSenderId: "689962826966",
  appId: "1:689962826966:web:babc4f1bbcc7eeb8705d77",
  measurementId: "G-L6XTRJQQBH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('accountForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!username || !email || !password || !confirmPassword) {
      showMessage('❌ يرجى ملء جميع الحقول.', false);
      return;
    }

    if (!validateEmail(email)) {
      showMessage('❌ يرجى إدخال بريد إلكتروني صالح.', false);
      return;
    }

    if (password !== confirmPassword) {
      showMessage('❌ كلمات المرور غير متطابقة.', false);
      return;
    }

    if (password.length < 6) {
      showMessage('❌ كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل.', false);
      return;
    }

    try {
      showLoading(true);

      const usersRef = collection(db, "users");

      const emailQuery = query(usersRef, where("email", "==", email));
      const emailSnapshot = await getDocs(emailQuery);
      if (!emailSnapshot.empty) {
        showMessage('❌ يوجد حساب بنفس البريد.', false);
        showLoading(false);
        return;
      }

      const usernameQuery = query(usersRef, where("username", "==", username));
      const usernameSnapshot = await getDocs(usernameQuery);
      if (!usernameSnapshot.empty) {
        showMessage('❌ اسم المستخدم مأخوذ.', false);
        showLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(db, "users", userId), {
        username,
        email,
        status: "نشط",
        createdAt: new Date()
      });

      showLoading(false);
      showMessage(`🎉 مرحبًا، ${username}! تم إنشاء حسابك بنجاح.`, true, 'html.html');

    } catch (error) {
      console.error("⚠️ خطأ:", error);
      showMessage("❌ حدث خطأ أثناء إنشاء الحساب.", false);
      showLoading(false);
    }
  });
});

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}

function showMessage(message, success, redirectUrl = null) {
  const messageOverlay = document.getElementById('messageOverlay');
  const messageText = document.getElementById('welcomeMessage');
  const okButton = document.getElementById('ok-button');

  messageText.innerHTML = message;
  messageOverlay.style.display = 'flex';
  messageOverlay.classList.add('show');

  if (success && redirectUrl) {
    okButton.style.display = 'block';
    okButton.onclick = function () {
      window.location.href = redirectUrl;
    };
  } else {
    okButton.style.display = 'none';
    setTimeout(() => {
      messageOverlay.style.display = 'none';
      messageOverlay.classList.remove('show');
    }, 3000);
  }
}

function showLoading(show) {
  const loadingOverlay = document.getElementById('loadingOverlay');
  loadingOverlay.style.display = show ? 'flex' : 'none';
}
