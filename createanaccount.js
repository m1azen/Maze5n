document.addEventListener("DOMContentLoaded", function () {
  console.log("📢 السكربت يعمل!");

  // تحقق من وجود Firebase
  if (typeof firebase === "undefined") {
    console.error("⚠️ Firebase غير محمل!");
    return;
  }

  // تهيئة Firebase
  const auth = firebase.auth();
  const db = firebase.firestore();

  const form = document.getElementById('accountForm');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const messageOverlay = document.getElementById('messageOverlay');
  const messageText = document.getElementById('welcomeMessage');
  const okButton = document.getElementById('ok-button');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // تحقق من الحقول
    if (!username || !email || !password || !confirmPassword) {
      return showMessage('❌ يرجى ملء جميع الحقول.', false);
    }

    if (!validateEmail(email)) {
      return showMessage('❌ بريد إلكتروني غير صالح.', false);
    }

    if (password !== confirmPassword) {
      return showMessage('❌ كلمات المرور غير متطابقة.', false);
    }

    if (password.length < 6) {
      return showMessage('❌ كلمة المرور ضعيفة، يجب أن تكون 6 أحرف على الأقل.', false);
    }

    try {
      showLoading(true);

      // التأكد من عدم تكرار البريد أو الاسم
      const usersRef = db.collection("users");
      const emailExists = await usersRef.where("email", "==", email).get();
      if (!emailExists.empty) {
        showLoading(false);
        return showMessage('❌ البريد الإلكتروني مستخدم من قبل.', false);
      }

      const usernameExists = await usersRef.where("username", "==", username).get();
      if (!usernameExists.empty) {
        showLoading(false);
        return showMessage('❌ اسم المستخدم مستخدم من قبل.', false);
      }

      // إنشاء الحساب
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;

      await usersRef.doc(userId).set({
        username: username,
        email: email,
        status: "نشط",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      showLoading(false);
      showMessage(`🎉 مرحبًا، ${username}! تم إنشاء حسابك بنجاح.`, true);

    } catch (error) {
      console.error("⚠️ خطأ:", error);
      showLoading(false);
      showMessage('❌ حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.', false);
    }
  });

  // عرض الرسائل
  function showMessage(message, success) {
    messageText.innerHTML = message;
    messageOverlay.style.display = 'flex';
    messageOverlay.classList.add('show');

    if (success) {
      okButton.style.display = 'block';
      okButton.onclick = function () {
        window.location.href = 'html.html';
      };
    } else {
      okButton.style.display = 'none';
      setTimeout(() => {
        messageOverlay.style.display = 'none';
        messageOverlay.classList.remove('show');
      }, 3000);
    }
  }

  // إظهار/إخفاء التحميل
  function showLoading(show) {
    loadingOverlay.style.display = show ? 'flex' : 'none';
  }

  // التحقق من البريد
  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }
});
