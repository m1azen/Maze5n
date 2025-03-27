// استدعاء Firebase Authentication و Firestore
const auth = firebase.auth();
const db = firebase.firestore();

document.getElementById('accountForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  // جلب القيم من الحقول
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // ✅ التحقق من إدخال جميع الحقول
  if (!username || !email || !password || !confirmPassword) {
    showMessage('❌ يرجى ملء جميع الحقول.', false);
    return;
  }

  // ✅ التحقق من تطابق كلمتي المرور
  if (password !== confirmPassword) {
    showMessage('❌ كلمات المرور غير متطابقة. حاول مرة أخرى.', false);
    return;
  }

  try {
    const usersRef = db.collection("users");

    // ✅ التحقق من أن البريد الإلكتروني غير مسجل مسبقًا
    const emailCheck = await usersRef.where("email", "==", email).get();
    if (!emailCheck.empty) {
      showMessage('❌ يوجد حساب مسجل بهذا البريد الإلكتروني. الرجاء استخدام بريد آخر.', false);
      return;
    }

    // ✅ التحقق من أن اسم المستخدم غير مسجل مسبقًا
    const usernameCheck = await usersRef.where("username", "==", username).get();
    if (!usernameCheck.empty) {
      showMessage('❌ اسم المستخدم مأخوذ. الرجاء اختيار اسم آخر.', false);
      return;
    }

    // ✅ إنشاء الحساب باستخدام Firebase Authentication
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const userId = userCredential.user.uid; // الحصول على معرف المستخدم الفريد

    // ✅ تخزين بيانات الحساب في Firestore
    await usersRef.doc(userId).set({
      username: username,
      email: email,
      status: "نشط",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // ✅ عرض رسالة ترحيب خاصة
    showMessage(`🎉 مرحبًا، ${username}! تم إنشاء حسابك بنجاح.`, true);
  } catch (error) {
    console.error("⚠️ خطأ أثناء إنشاء الحساب:", error);
    showMessage("❌ حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.", false);
  }
});

// ✅ دالة عرض الرسائل المنبثقة
function showMessage(message, success) {
  const messageOverlay = document.getElementById('messageOverlay');
  const messageText = document.getElementById('messageText');
  const okButton = document.getElementById('ok-button');

  messageText.innerHTML = message;
  messageOverlay.style.display = 'flex';

  if (success) {
    okButton.onclick = function() {
      window.location.href = 'html.html';
    };
  } else {
    okButton.onclick = function() {
      messageOverlay.style.display = 'none';
    };
  }
}
