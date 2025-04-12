document.addEventListener("DOMContentLoaded", async () => {
  try {
    // جلب بيانات المستخدمين
    const { data: users, error } = await supabase.from('users').select('*');

    if (error) {
      console.error("Error fetching users:", error.message);
      alert("حدث خطأ أثناء جلب بيانات المستخدمين. الرجاء المحاولة لاحقًا.");
      return;
    }

    if (!users || users.length === 0) {
      console.warn("No users found in the database.");
      alert("لا توجد بيانات للمستخدمين لعرضها.");
      return;
    }

    // تحديث الإحصائيات
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('activeUsers').textContent = users.filter(user => user.status === 'نشط').length;
    document.getElementById('suspendedUsers').textContent = users.filter(user => user.status.includes('موقوف')).length;

    // ملء الجدول بالمستخدمين
    const usersTable = document.getElementById('usersTable');
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username || 'غير معروف'}</td>
        <td>${user.email || 'غير معروف'}</td>
        <td>${user.status || 'غير معروف'}</td>
        <td>
          <button onclick="suspendUser(${user.id})">إيقاف</button>
          <button onclick="addExamScores(${user.id})">إضافة درجات</button>
        </td>
      `;
      usersTable.appendChild(row);
    });
  } catch (error) {
    console.error("Error initializing admin panel:", error.message);
    alert("حدث خطأ أثناء تحميل الصفحة.");
  }
});
