document.addEventListener('DOMContentLoaded', function() {
  checkSuspendedAccounts();
  displayAccounts();
});

// التحقق من الحسابات الموقوفة تلقائيًا
async function checkSuspendedAccounts() {
  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();
  const currentDate = new Date();

  snapshot.forEach(async doc => {
    const userData = doc.data();
    if (userData.status.includes('موقوف حتى')) {
      const suspensionDate = new Date(userData.status.match(/\d{1,2}\/\d{1,2}\/\d{4}/)[0]);
      if (currentDate >= suspensionDate) {
        await usersRef.doc(doc.id).update({ status: 'نشط' });
        console.log(`تم إعادة تنشيط الحساب: ${userData.email}`);
      }
    }
  });
}

// عرض الحسابات في الجدول
async function displayAccounts() {
  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();
  const tableBody = document.getElementById('accountsTable');

  if (snapshot.empty) {
    tableBody.innerHTML = '<tr><td colspan="5">لا توجد حسابات مسجلة</td></tr>';
    return;
  }

  tableBody.innerHTML = ''; // تفريغ الجدول قبل إعادة ملئه

  snapshot.forEach((doc, index) => {
    const userData = doc.data();
    const statusText = userData.status.includes('موقوف حتى') ? userData.status : (userData.status || 'نشط');

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${userData.username}</td>
      <td>${userData.email}</td>
      <td>
        <input type="password" value="${userData.password}" id="password-${doc.id}" disabled />
        <button onclick="togglePassword('${doc.id}')">👁️</button>
      </td>
      <td>${statusText}</td>
      <td>
        <button onclick="changePassword('${doc.id}')">تعديل كلمة المرور</button>
        <button onclick="deleteAccount('${doc.id}')">حذف الحساب</button>
        ${
          userData.status.includes('موقوف') 
            ? `<button onclick="unsuspendAccount('${doc.id}')">فك الإيقاف</button>`
            : `<button onclick="suspendAccount('${doc.id}')">إيقاف الحساب</button>`
        }
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// إظهار وإخفاء كلمة المرور
function togglePassword(userId) {
  const passwordInput = document.getElementById(`password-${userId}`);
  passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
}

// تعديل كلمة المرور
async function changePassword(userId) {
  const newPassword = prompt('أدخل كلمة المرور الجديدة:');
  if (newPassword) {
    await db.collection("users").doc(userId).update({ password: newPassword });
    alert('تم تحديث كلمة المرور بنجاح!');
    displayAccounts();
  }
}

// حذف الحساب
async function deleteAccount(userId) {
  if (confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
    await db.collection("users").doc(userId).delete();
    alert('تم حذف الحساب بنجاح!');
    displayAccounts();
  }
}

// إيقاف الحساب
async function suspendAccount(userId) {
  const reason = prompt('هل ترغب في إيقاف الحساب بسبب مخالفة؟ إذا نعم، اكتب "مخالفة" أو اكتب عدد الأيام للإيقاف المؤقت:');

  if (!reason) return;

  const usersRef = db.collection("users").doc(userId);

  if (reason.toLowerCase() === 'مخالفة') {
    await usersRef.update({ status: 'موقوف بسبب مخالفة. تواصل مع الدعم على الرقم: 01006473018' });
  } else if (!isNaN(reason) && reason > 0) {
    const suspensionDate = new Date();
    suspensionDate.setDate(suspensionDate.getDate() + parseInt(reason));
    await usersRef.update({ status: `موقوف حتى ${suspensionDate.toLocaleDateString()}` });
  } else {
    alert('يرجى إدخال "مخالفة" أو عدد أيام صالح.');
    return;
  }

  alert('تم تحديث حالة الحساب بنجاح!');
  displayAccounts();
}

// فك الإيقاف
async function unsuspendAccount(userId) {
  await db.collection("users").doc(userId).update({ status: 'نشط' });
  alert('تم فك الإيقاف عن الحساب بنجاح!');
  displayAccounts();
}
