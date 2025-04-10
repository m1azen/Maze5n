<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
  import { getFirestore, collection, doc, setDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCc_LyGshkApqre4NIRKF7UTNjfE08cenw",
    authDomain: "websits-turoria.firebaseapp.com",
    projectId: "websits-turoria",
    storageBucket: "websits-turoria.firebasestorage.app",
    messagingSenderId: "689962826966",
    appId: "1:689962826966:web:babc4f1bbcc7eeb8705d77",
    measurementId: "G-L6XTRJQQBH"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  document.getElementById('accountForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!username || !email || !password || !confirmPassword) {
      return showMessage("❌ يرجى ملء جميع الحقول.", false);
    }
    if (password !== confirmPassword) {
      return showMessage("❌ كلمات المرور غير متطابقة.", false);
    }

    try {
      // التأكد من عدم تكرار البريد أو اسم المستخدم
      const usersRef = collection(db, "users");

      const emailQuery = query(usersRef, where("email", "==", email));
      const emailSnapshot = await getDocs(emailQuery);
      if (!emailSnapshot.empty) {
        return showMessage("❌ البريد الإلكتروني مستخدم بالفعل.", false);
      }

      const usernameQuery = query(usersRef, where("username", "==", username));
      const usernameSnapshot = await getDocs(usernameQuery);
      if (!usernameSnapshot.empty) {
        return showMessage("❌ اسم المستخدم مستخدم بالفعل.", false);
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(usersRef, userId), {
        username,
        email,
        status: "نشط",
        createdAt: new Date()
      });

      showMessage(`🎉 مرحبًا، ${username}! تم إنشاء حسابك بنجاح.`, true);
    } catch (error) {
      console.error(error);
      showMessage("❌ حدث خطأ أثناء إنشاء الحساب.", false);
    }
  });

  function showMessage(message, success) {
    const overlay = document.getElementById('messageOverlay');
    const messageText = document.getElementById('welcomeMessage');
    const okButton = document.getElementById('ok-button');

    messageText.innerText = message;
    overlay.style.display = 'flex';
    if (success) {
      okButton.style.display = 'block';
    } else {
      okButton.style.display = 'none';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 3000);
    }
  }
</script>
