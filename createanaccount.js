document.getElementById('accountForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // جلب القيم من الحقول
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // التحقق من إدخال كل البيانات
  if (!username || !email || !password || !confirmPassword) {
    showMessage('يرجى ملء جميع الحقول.', false);
    return;
  }

  // التحقق من تطابق كلمة المرور
  if (password !== confirmPassword) {
    showMessage('كلمات المرور غير متطابقة. حاول مرة أخرى.', false);
    return;
  }

  // التحقق من صحة الإيميل
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage('يرجى إدخال بريد إلكتروني صالح.', false);
    return;
  }

  // استرجاع الحسابات المخزنة من LocalStorage
  let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

  // التأكد من عدم تكرار البريد الإلكتروني
  if (accounts.some(account => account.email === email)) {
    showMessage('يوجد حساب مسجل بهذا البريد الإلكتروني. الرجاء استخدام بريد آخر.', false);
    return;
  }

  // إضافة الحساب الجديد
  const newAccount = { username, email, password, status: 'Active' };
  accounts.push(newAccount);
  localStorage.setItem('accounts', JSON.stringify(accounts));

  // رسالة ترحيبية
  showMessage(`تم إنشاء الحساب بنجاح! مرحبًا، ${username}!`, true);
});

// دالة لعرض الرسائل
function showMessage(message, success) {
  const welcomeMessage = document.getElementById('welcomeMessage');
  welcomeMessage.innerText = message;

  const messageOverlay = document.getElementById('messageOverlay');
  messageOverlay.style.display = 'flex';

  const okButton = document.getElementById('ok-button');
  
  if (success) {
    okButton.style.display = 'block';

    // إزالة أي Event Listener سابق لتجنب التكرار
    okButton.onclick = function() {
      window.location.href = 'html.html';
    };
  } else {
    okButton.style.display = 'none';
  }
}
