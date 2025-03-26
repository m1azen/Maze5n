document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showMessage('يرجى إدخال البريد الإلكتروني وكلمة المرور.', false);
    return;
  }

  const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
  const user = accounts.find(account => account.email === email);

  if (!user) {
    showMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة. حاول مرة أخرى.', false);
    return;
  }

  // التحقق من حالة الحساب
  if (user.status) {
    if (user.status.includes('موقوف بسبب مخالفة')) {
      showMessage('تم إيقاف حسابك بسبب مخالفة. يرجى التواصل مع الدعم على الرقم: 01006473018', false);
      return;
    }

    const suspensionDate = user.status.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
    const currentDate = new Date();
    if (suspensionDate) {
      const endDate = new Date(suspensionDate[0]);
      if (currentDate <= endDate) {
        showMessage(`عذرًا، حسابك موقوف حتى ${endDate.toLocaleDateString()}.`, false);
        return;
      } else {
        user.status = 'نشط';
        localStorage.setItem('accounts', JSON.stringify(accounts));
        showMessage('تم رفع الإيقاف عن حسابك. يمكنك تسجيل الدخول الآن.', true);
        return;
      }
    }
  }

  if (user.password !== password) {
    showMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة. حاول مرة أخرى.', false);
    return;
  }

  localStorage.setItem('loggedInUser', JSON.stringify(user));
  showMessage(`مرحبًا ${user.username}! تم تسجيل الدخول بنجاح.`, true);
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
    okButton.onclick = function() {
      window.location.href = 'html.html';
    };
  } else {
    okButton.style.display = 'block';
    okButton.onclick = function() {
      messageOverlay.style.display = 'none';
    };
  }
}
