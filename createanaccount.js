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
    alert('❌ يرجى ملء جميع الحقول.');
    return;
  }

  // ✅ التحقق من تطابق كلمتي المرور
  if (password !== confirmPassword) {
    alert('❌ كلمات المرور غير متطابقة. حاول مرة أخرى.');
    return;
  }

  try {
    const usersRef = db.collection("users");

    // ✅ التحقق من أن البريد الإلكتروني غير مسجل مسبقًا
    const emailCheck = await usersRef.where("email", "==", email).get();
    if (!emailCheck.empty) {
      alert('❌ يوجد حساب مسجل بهذا البريد الإلكتروني. الرجاء استخدام بريد آخر.');
      return;
    }

    // ✅ التحقق من أن اسم المستخدم غير مسجل مسبقًا
    const usernameCheck = await usersRef.where("username", "==", username).get();
    if (!usernameCheck.empty) {
      alert('❌ اسم المستخدم مأخوذ. الرجاء اختيار اسم آخر.');
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

    // ✅ حفظ اسم المستخدم في Local Storage للترحيب به بعد التسجيل
    localStorage.setItem('newUser', username);

    // ✅ عرض رسالة ترحيب ثم توجيه المستخدم إلى تسجيل الدخول
    alert(`🎉 مرحبًا، ${username}! تم إنشاء حسابك بنجاح.`);
    window.location.href = 'login.html';
  } catch (error) {
    console.error("⚠️ خطأ أثناء إنشاء الحساب:", error);
    alert("❌ حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.");
  }
});
