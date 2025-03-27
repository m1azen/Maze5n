document.getElementById('accountForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  // جلب القيم من الحقول
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // التحقق من إدخال كل البيانات
  if (!username || !email || !password || !confirmPassword) {
    alert('يرجى ملء جميع الحقول.');
    return;
  }

  // التحقق من تطابق كلمة المرور
  if (password !== confirmPassword) {
    alert('كلمات المرور غير متطابقة. حاول مرة أخرى.');
    return;
  }

  try {
    // التحقق من وجود الحساب مسبقًا في Firestore
    const usersRef = db.collection("users");
    const querySnapshot = await usersRef.where("email", "==", email).get();
    
    if (!querySnapshot.empty) {
      alert('يوجد حساب مسجل بهذا البريد الإلكتروني. الرجاء استخدام بريد آخر.');
      return;
    }

    // إضافة الحساب الجديد إلى Firestore
    await usersRef.add({
      username: username,
      email: email,
      password: password,  // ملاحظة: يفضل تشفيرها قبل التخزين في بيئة الإنتاج
      status: "نشط", // جميع الحسابات تبدأ كـ "نشط"
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert(`تم إنشاء الحساب بنجاح! مرحبًا، ${username}!`);
    window.location.href = 'login.html';
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.");
  }
});
