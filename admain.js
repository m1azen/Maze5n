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

    // تحديث جدول المستخدمين
    const usersTable = document.getElementById('usersTable');
    if (!usersTable) {
      console.warn("⚠️ عنصر 'usersTable' غير موجود.");
      return;
    }

    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id || 'N/A'}</td>
        <td>${user.username || 'غير معروف'}</td>
        <td>${user.email || 'غير معروف'}</td>
        <td>${user.exam_results || 'لا توجد نتائج'}</td>
        <td>${user.account_creation_date || 'غير متوفر'}</td>
        <td>
          <button onclick="viewGrades('${user.id}')">عرض الدرجات</button>
          <button onclick="addExamResult('${user.id}')">إضافة امتحان</button>
          <button onclick="sendMessage('${user.id}')">إرسال رسالة</button>
          <button onclick="deleteUser('${user.id}')">حذف</button>
        </td>
      `;
      usersTable.appendChild(row);
    });
  } catch (error) {
    console.error("Error initializing admin panel:", error.message);
    alert("❌ حدث خطأ أثناء تحميل الصفحة.");
  }
});

// دالة عرض درجات المستخدم
async function viewGrades(userId) {
  try {
    const { data: grades, error } = await supabase
      .from('exams')
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

// دالة إضافة نتيجة امتحان
async function addExamResult(userId) {
  const subject = prompt("📖 أدخل اسم المادة:");
  const score = prompt("🏆 أدخل درجة الامتحان:");

  if (!subject || !score) {
    alert("❌ يجب إدخال المادة والدرجة.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from('exams')
      .insert([
        {
          user_id: userId,
          subject: subject,
          score: parseInt(score),
          exam_date: new Date().toISOString(),
        },
      ]);

    if (error) {
      alert("❌ حدث خطأ أثناء إضافة نتيجة الامتحان.");
      console.error("Error adding exam result:", error);
      return;
    }

    alert("✅ تم إضافة نتيجة الامتحان بنجاح.");
    location.reload(); // تحديث الصفحة لعرض النتيجة الجديدة
  } catch (error) {
    console.error("Unexpected error:", error.message);
    alert("❌ حدث خطأ غير متوقع.");
  }
}

// دالة إرسال رسالة
async function sendMessage(userId) {
  const messageContent = prompt("✉️ أدخل محتوى الرسالة:");

  if (!messageContent) {
    alert("❌ يجب إدخال محتوى الرسالة.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          user_id: userId,
          content: messageContent,
          sent_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      alert("❌ حدث خطأ أثناء إرسال الرسالة.");
      console.error("Error sending message:", error);
      return;
    }

    alert("✅ تم إرسال الرسالة بنجاح.");
  } catch (error) {
    console.error("Unexpected error:", error.message);
    alert("❌ حدث خطأ غير متوقع.");
  }
}

// دالة حذف المستخدم
async function deleteUser(userId) {
  const confirmation = confirm("🗑️ هل أنت متأكد أنك تريد حذف هذا المستخدم؟");

  if (!confirmation) return;

  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      alert("❌ حدث خطأ أثناء حذف المستخدم.");
      console.error("Error deleting user:", error);
      return;
    }

    alert("✅ تم حذف المستخدم بنجاح.");
    location.reload(); // تحديث الصفحة لعرض القائمة الجديدة
  } catch (error) {
    console.error("Unexpected error:", error.message);
    alert("❌ حدث خطأ غير متوقع.");
  }
}
