import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// إعداد اتصال Supabase
const SUPABASE_URL = 'https://obimikymmvrwljbpmnxb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaW1pa3ltbXZyd2xqYnBtbnhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTk3MDgsImV4cCI6MjA2MDAzNTcwOH0.iwAiOK8xzu3b2zau-CfubioYdU9Dzmj5UjsbOldZbsw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
        <td><input type="text" value="${user.username}" id="username-${user.id}" /></td>
        <td><input type="text" value="${user.email}" id="email-${user.id}" /></td>
        <td><input type="text" value="${user.status}" id="status-${user.id}" /></td>
        <td>
          <button onclick="saveUser(${user.id})">حفظ</button>
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

// دالة لحفظ التعديلات
async function saveUser(userId) {
  const username = document.getElementById(`username-${userId}`).value.trim();
  const email = document.getElementById(`email-${userId}`).value.trim();
  const status = document.getElementById(`status-${userId}`).value.trim();

  if (!username || !email || !status) {
    alert("يرجى ملء جميع الحقول قبل الحفظ.");
    return;
  }

  try {
    const { error } = await supabase.from('users').update({
      username: username,
      email: email,
      status: status
    }).eq('id', userId);

    if (error) {
      console.error("Error updating user:", error.message);
      alert("حدث خطأ أثناء تعديل البيانات.");
    } else {
      alert("تم حفظ التعديلات بنجاح.");
    }
  } catch (error) {
    console.error("Error saving user data:", error.message);
    alert("حدث خطأ أثناء تعديل البيانات.");
  }
}

// دالة لإيقاف الحساب
async function suspendUser(userId) {
  const reason = prompt("يرجى إدخال سبب الإيقاف:");
  if (!reason) return;

  try {
    const { error } = await supabase.from('users').update({
      status: `موقوف: ${reason}`
    }).eq('id', userId);

    if (error) {
      console.error("Error suspending user:", error.message);
      alert("حدث خطأ أثناء إيقاف الحساب.");
    } else {
      alert("تم إيقاف الحساب بنجاح.");
      location.reload();
    }
  } catch (error) {
    console.error("Error suspending user:", error.message);
    alert("حدث خطأ أثناء إيقاف الحساب.");
  }
}

// دالة لإضافة درجات الامتحان
async function addExamScores(userId) {
  const examName = prompt("اسم الامتحان:");
  const totalMarks = parseInt(prompt("الدرجة الكلية:"), 10);
  const obtainedMarks = parseInt(prompt("الدرجة المحصل عليها:"), 10);
  const examDate = prompt("تاريخ الامتحان (YYYY-MM-DD):");

  if (!examName || isNaN(totalMarks) || isNaN(obtainedMarks) || !examDate) {
    alert("يرجى ملء جميع الحقول بشكل صحيح.");
    return;
  }

  try {
    const { error } = await supabase.from('users').update({
      exam_scores: supabase.raw(`
        array_append(exam_scores, jsonb_build_object('exam_name', '${examName}', 'total_marks', ${totalMarks}, 'obtained_marks', ${obtainedMarks}, 'exam_date', '${examDate}'))
      `)
    }).eq('id', userId);

    if (error) {
      console.error("Error adding exam score:", error.message);
      alert("حدث خطأ أثناء إضافة درجات الامتحان.");
    } else {
      alert("تمت إضافة درجات الامتحان بنجاح.");
      location.reload();
    }
  } catch (error) {
    console.error("Error adding exam score:", error.message);
    alert("حدث خطأ أثناء إضافة درجات الامتحان.");
  }
}
