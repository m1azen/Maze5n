// إعداد Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "API_KEY_HERE",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// تسجيل الدخول
document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showMessage('❌ يرجى إدخال البريد الإلكتروني وكلمة المرور.', false);
    return;
  }

  try {
    const usersRef = collection(db, "users");
    const emailQuery = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(emailQuery);

    if (querySnapshot.empty) {
      showMessage('❌ البريد الإلكتروني أو كلمة المرور غير صحيحة. حاول مرة أخرى.', false);
      return;
    }

    let userData;
    querySnapshot.forEach(doc => {
      userData = { id: doc.id, ...doc.data() };
    });

    // التحقق من حالة الحساب
    if (userData.status && userData.status.includes('موقوف')) {
      const suspensionDate = userData.status.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
      const currentDate = new Date();

      if (suspensionDate) {
        const endDate = new Date(suspensionDate[0]);
        if (currentDate <= endDate) {
          showMessage(`❌ حسابك موقوف حتى ${endDate.toLocaleDateString()}.`, false);
          return;
        } else {
          await updateDoc(doc(db, "users", userData.id), { status: 'نشط' });
          showMessage('✅ تم رفع الإيقاف عن حسابك. يمكنك تسجيل الدخول الآن.', true);
          return;
        }
      }
    }

    // التحقق من كلمة المرور
    if (userData.password !== password) {
      showMessage('❌ البريد الإلكتروني أو كلمة المرور غير صحيحة. حاول مرة أخرى.', false);
      return;
    }

    showMessage(`🎉 مرحبًا ${userData.username}! تم تسجيل الدخول بنجاح.`, true);

  } catch (error) {
    console.error("⚠️ خطأ أثناء تسجيل الدخول: ", error);
    showMessage('❌ حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.', false);
  }
});

// دالة لعرض الرسائل
function showMessage(message, success) {
  const welcomeMessage = document.getElementById('welcomeMessage');
  welcomeMessage.innerText = message;

  const messageOverlay = document.getElementById('messageOverlay');
  messageOverlay.style.display = 'flex';

  const okButton = document.getElementById('ok-button');
  okButton.style.display = 'block';
  okButton.onclick = function() {
    if (success) {
      window.location.href = 'html.html';
    } else {
      messageOverlay.style.display = 'none';
    }
  };
}
