import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// إعداد اتصال Supabase
const SUPABASE_URL = 'https://obimikymmvrwljbpmnxb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDQ1OTcwOCwiZXhwIjoyMDYwMDM1NzA4fQ.Ve2g7Q8ESJBZfJKGp6l_OVtMwEaLMHGoIUL0ckb9Yxk';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // جلب بيانات المستخدمين من قاعدة البيانات
    const { data: users, error } = await supabase.from('users').select('*');
    if (error) {
      console.error("Error fetching users:", error.message);
      alert("حدث خطأ أثناء تحميل بيانات المستخدمين.");
      return;
    }

    // تحديث الإحصائيات العامة
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'Active').length;
    const suspendedUsers = users.filter(user => user.status.includes('Suspended')).length;

    // تحديث عناصر الإحصائيات في HTML
    const totalUsersElement = document.getElementById('totalUsers');
    const activeUsersElement = document.getElementById('activeUsers');
    const suspendedUsersElement = document.getElementById('suspendedUsers');

    if (totalUsersElement) totalUsersElement.textContent = totalUsers || '0';
    if (activeUsersElement) activeUsersElement.textContent = activeUsers || '0';
    if (suspendedUsersElement) suspendedUsersElement.textContent = suspendedUsers || '0';

    // تحديث جدول المستخدمين
    const usersTable = document.getElementById('usersTable');
    if (!usersTable) {
      console.warn("Element 'usersTable' not found in DOM.");
      return;
    }

    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id || 'N/A'}</td>
        <td>${user.username || 'غير معروف'}</td>
        <td>${user.email || 'غير معروف'}</td>
        <td>${user.status || 'غير معروف'}</td>
        <td>
          <button onclick="editUser(${user.id})">تعديل</button>
          <button onclick="deleteUser(${user.id})">حذف</button>
          <button onclick="suspendUser(${user.id})">إيقاف</button>
          <button onclick="viewGrades(${user.id})">عرض الدرجات</button>
        </td>
      `;
      usersTable.appendChild(row);
    });
  } catch (error) {
    console.error("Error initializing admin panel:", error.message);
    alert("حدث خطأ أثناء تحميل الصفحة. الرجاء المحاولة مرة أخرى.");
  }
});

// دالة تعديل المستخدم
function editUser(userId) {
  alert(`تعديل المستخدم ذو المعرف: ${userId}`);
}

// دالة حذف المستخدم
function deleteUser(userId) {
  alert(`حذف المستخدم ذو المعرف: ${userId}`);
}

// دالة لإيقاف المستخدم
async function suspendUser(userId) {
  const reason = prompt("يرجى إدخال سبب الإيقاف:");
  if (!reason) return;

  try {
    const { error } = await supabase
      .from('users')
      .update({ status: `Suspended: ${reason}` })
      .eq('id', userId);

    if (error) {
      alert("فشل في إيقاف المستخدم.");
      console.error("Error suspending user:", error);
    } else {
      alert("تم إيقاف المستخدم بنجاح.");
      location.reload(); // تحديث الصفحة لعرض الحالة الجديدة
    }
  } catch (error) {
    console.error("Unexpected error:", error.message);
    alert("حدث خطأ غير متوقع أثناء إيقاف المستخدم.");
  }
}

// دالة عرض درجات المستخدم
async function viewGrades(userId) {
  try {
    const { data: grades, error } = await supabase
      .from('grades')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      alert("حدث خطأ أثناء جلب الدرجات.");
      console.error("Error fetching grades:", error);
      return;
    }

    if (grades.length === 0) {
      alert("لا توجد درجات متاحة لهذا المستخدم.");
      return;
    }

    let message = `درجات المستخدم ذو المعرف ${userId}:\n`;
    grades.forEach(grade => {
      message += `المادة: ${grade.subject} | الدرجة: ${grade.score}\n`;
    });
    alert(message);
  } catch (error) {
    console.error("Unexpected error:", error.message);
    alert("حدث خطأ غير متوقع أثناء عرض الدرجات.");
  }
}
