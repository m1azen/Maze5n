import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// إعداد اتصال Supabase
const SUPABASE_URL = 'https://obimikymmvrwljbpmnxb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaW1pa3ltbXZyd2xqYnBtbnhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTk3MDgsImV4cCI6MjA2MDAzNTcwOH0.iwAiOK8xzu3b2zau-CfubioYdU9Dzmj5UjsbOldZbsw';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // جلب بيانات المستخدمين من قاعدة البيانات
    const { data: users, error } = await supabase.from('users').select('*');
    if (error) {
      console.error("Error fetching users:", error.message);
      alert("⚠️ حدث خطأ أثناء تحميل بيانات المستخدمين.");
      return;
    }

    if (!users || users.length === 0) {
      alert("ℹ️ لا توجد بيانات متاحة للمستخدمين.");
      console.warn("No users found in the database.");
      return;
    }

    // تحديث الإحصائيات العامة
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'Active').length;
    const suspendedUsers = users.filter(user => user.status.includes('Suspended')).length;

    // تحديث عناصر الإحصائيات في HTML
    updateStats('totalUsers', totalUsers || '0');
    updateStats('activeUsers', activeUsers || '0');
    updateStats('suspendedUsers', suspendedUsers || '0');

    // تحديث جدول المستخدمين
    const usersTable = document.getElementById('usersTable');
    if (!usersTable) {
      console.warn("⚠️ Element 'usersTable' not found in DOM.");
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
    alert("❌ حدث خطأ غير متوقع أثناء تحميل الصفحة.");
  }
});

// دالة لتحديث إحصائيات لوحة التحكم
function updateStats(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  } else {
    console.warn(`⚠️ Element with ID '${elementId}' not found.`);
  }
}

// دالة تعديل المستخدم
function editUser(userId) {
  alert(`✏️ تعديل المستخدم ذو المعرف: ${userId}`);
}

// دالة حذف المستخدم
function deleteUser(userId) {
  alert(`🗑️ حذف المستخدم ذو المعرف: ${userId}`);
}

// دالة لإيقاف المستخدم
async function suspendUser(userId) {
  const reason = prompt("🛑 يرجى إدخال سبب الإيقاف:");
  if (!reason) return;

  try {
    const { error } = await supabase
      .from('users')
      .update({ status: `Suspended: ${reason}` })
      .eq('id', userId);

    if (error) {
      alert("❌ فشل في إيقاف المستخدم.");
      console.error("Error suspending user:", error);
    } else {
      alert("✅ تم إيقاف المستخدم بنجاح.");
      location.reload(); // تحديث الصفحة لعرض الحالة الجديدة
    }
  } catch (error) {
    console.error("Unexpected error:", error.message);
    alert("❌ حدث خطأ غير متوقع أثناء إيقاف المستخدم.");
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
      alert("❌ حدث خطأ أثناء جلب الدرجات.");
      console.error("Error fetching grades:", error);
      return;
    }

    if (!grades || grades.length === 0) {
      alert("ℹ️ لا توجد درجات متاحة لهذا المستخدم.");
      return;
    }

    let message = `📚 درجات المستخدم ذو المعرف ${userId}:\n`;
    grades.forEach(grade => {
      message += `📖 المادة: ${grade.subject} | الدرجة: ${grade.score}\n`;
    });
    alert(message);
  } catch (error) {
    console.error("Unexpected error:", error.message);
    alert("❌ حدث خطأ غير متوقع أثناء عرض الدرجات.");
  }
}
