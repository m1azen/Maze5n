document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // جلب البيانات من الحقول
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // التحقق من إدخال البيانات
  if (!email || !password) {
    showMessage('يرجى إدخال البريد الإلكتروني وكلمة المرور.', false);
    return;
  }

  // استرجاع الحسابات من LocalStorage
  const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

  // البحث عن الحساب المطابق
  const user = accounts.find(account => account.email === email && account.password === password);

  if (user) {
    // حفظ بيانات تسجيل الدخول
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    showMessage(`مرحبًا ${user.username}! تم تسجيل الدخول بنجاح.`, true);
  } else {
    showMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة. حاول مرة أخرى.', false);
  }
});

// دالة لعرض الرسائل
function showMessage(message, success) {
  const welcomeMessage = document.getElementById('welcomeMessage');
  welcomeMessage.innerText = message;

  const messageOverlay = document.getElementById('messageOverlay');
  messageOverlay.style.display = 'flex';

  const okButton = document.getElementById('ok-button');
  okButton.style.display = 'block'; // إظهار الزر دائمًا

  if (success) {
    okButton.onclick = function() {
      window.location.href = 'html.html';
    };
  } else {
    okButton.onclick = function() {
      messageOverlay.style.display = 'none'; // إخفاء الرسالة عند الخطأ
    };
  }
}
