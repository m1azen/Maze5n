document.getElementById('accountForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    // التحقق من إدخال كل البيانات
    if (!username || !email || !password || !confirmPassword) {
      showMessage('Please fill in all fields.', false);
      return;
    }
  
    // التحقق من تطابق كلمة المرور
    if (password !== confirmPassword) {
      showMessage('Passwords do not match. Please try again.', false);
      return;
    }
  
    // استرجاع الحسابات المخزنة من LocalStorage
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
  
    // التأكد من عدم تكرار الحساب بالإيميل
    const accountExists = accounts.some(account => account.email === email);
  
    if (accountExists) {
      showMessage('An account with this email already exists. Please try a different email.', false);
    } else {
      // إضافة الحساب الجديد
      const newAccount = { username, email, password };
      accounts.push(newAccount);
      localStorage.setItem('accounts', JSON.stringify(accounts));
  
      // رسالة ترحيبية
      showMessage(`Account created successfully! Welcome, ${username}!`, true);
    }
  });
  
  // دالة لعرض الرسائل
  function showMessage(message, success) {
    const welcomeMessage = document.getElementById('welcomeMessage');
    welcomeMessage.innerText = message;
  
    const messageOverlay = document.getElementById('messageOverlay');
    messageOverlay.style.display = 'flex';
  
    const okButton = document.getElementById('ok-button');
    okButton.style.display = success ? 'block' : 'none';
  }
  