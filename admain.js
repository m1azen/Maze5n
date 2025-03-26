document.addEventListener('DOMContentLoaded', function() {
  checkSuspendedAccounts();
  displayAccounts();
});

// التحقق من الحسابات الموقوفة تلقائيًا
function checkSuspendedAccounts() {
  const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
  const currentTime = new Date().getTime();

  accounts.forEach(account => {
    if (account.status === 'Suspended' && account.suspendUntil) {
      if (currentTime >= account.suspendUntil) {
        account.status = 'Active';
        delete account.suspendUntil;
        console.log(`تم إعادة تنشيط الحساب: ${account.email}`);
      }
    }
  });

  localStorage.setItem('accounts', JSON.stringify(accounts));
}

// عرض الحسابات في الجدول
function displayAccounts() {
  const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
  const tableBody = document.getElementById('accountsTable');

  if (accounts.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5">لا توجد حسابات مسجلة</td></tr>';
    return;
  }

  tableBody.innerHTML = ''; // تفريغ الجدول قبل إعادة ملئه

  accounts.forEach((account, index) => {
    const statusText = account.status === 'Suspended' && account.suspendUntil
      ? `موقوف حتى ${new Date(account.suspendUntil).toLocaleDateString()}`
      : account.status || 'نشط';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${account.username}</td>
      <td>${account.email}</td>
      <td>
        <input type="password" value="${account.password}" id="password-${index}" disabled />
        <button onclick="togglePassword(${index})">👁️</button>
      </td>
      <td>${statusText}</td>
      <td>
        <button onclick="changePassword(${index})">تعديل كلمة المرور</button>
        <button onclick="deleteAccount(${index})">حذف الحساب</button>
        ${
          account.status === 'Suspended'
            ? `<button onclick="unsuspendAccount(${index})">فك الإيقاف</button>`
            : `<button onclick="suspendAccount(${index})">إيقاف الحساب</button>`
        }
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// إظهار وإخفاء كلمة المرور
function togglePassword(index) {
  const passwordInput = document.getElementById(`password-${index}`);
  passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
}

// تعديل كلمة المرور
function changePassword(index) {
  const newPassword = prompt('أدخل كلمة المرور الجديدة:');
  if (newPassword) {
    const accounts = JSON.parse(localStorage.getItem('accounts'));
    accounts[index].password = newPassword;
    localStorage.setItem('accounts', JSON.stringify(accounts));
    alert('تم تحديث كلمة المرور بنجاح!');
    displayAccounts();
  }
}

// حذف الحساب
function deleteAccount(index) {
  if (confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
    const accounts = JSON.parse(localStorage.getItem('accounts'));
    accounts.splice(index, 1);
    localStorage.setItem('accounts', JSON.stringify(accounts));
    alert('تم حذف الحساب بنجاح!');
    displayAccounts();
  }
}

// إيقاف الحساب
function suspendAccount(index) {
  const days = prompt('كم يوم تريد إيقاف الحساب؟');
  if (days && !isNaN(days) && days > 0) {
    const accounts = JSON.parse(localStorage.getItem('accounts'));
    const suspensionDate = new Date();
    const suspendUntil = suspensionDate.getTime() + parseInt(days) * 24 * 60 * 60 * 1000;

    accounts[index].status = 'Suspended';
    accounts[index].suspendUntil = suspendUntil;
    localStorage.setItem('accounts', JSON.stringify(accounts));
    alert(`تم إيقاف الحساب لمدة ${days} يومًا!`);
    displayAccounts();
  }
}

// فك الإيقاف
function unsuspendAccount(index) {
  const accounts = JSON.parse(localStorage.getItem('accounts'));
  if (accounts[index].status === 'Suspended') {
    accounts[index].status = 'Active';
    delete accounts[index].suspendUntil;
    localStorage.setItem('accounts', JSON.stringify(accounts));
    alert('تم فك الإيقاف عن الحساب بنجاح!');
    displayAccounts();
  } else {
    alert('هذا الحساب ليس موقوفًا.');
  }
}
