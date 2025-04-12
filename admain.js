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
      return;
    }

    // تحديث الإحصائيات
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('activeUsers').textContent = users.filter(user => user.status === 'نشط').length;
    document.getElementById('suspendedUsers').textContent = users.filter(user => user.status.includes('موقوف')).length;

    // حساب متوسط درجات النظام
    const totalScores = users.reduce((sum, user) => sum + (user.exam_scores || []).reduce((subSum, score) => subSum + score.obtained_marks, 0), 0);
    const totalMarks = users.reduce((sum, user) => sum + (user.exam_scores || []).reduce((subSum, score) => subSum + score.total_marks, 0), 0);
    const averageScore = totalMarks > 0 ? Math.round((totalScores / totalMarks) * 100) : 0;
    document.getElementById('averageScore').textContent = `${averageScore}%`;

    // ملء الجدول بالمستخدمين
    const usersTable = document.getElementById('usersTable');
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.status}</td>
        <td>
          <button onclick="suspendUser(${user.id})">إيقاف</button>
          <button onclick="addExamScores(${user.id})">إضافة درجات</button>
        </td>
      `;
      usersTable.appendChild(row);
    });
  } catch (error) {
    console.error("Error initializing admin panel:", error.message);
  }
});

// دوال تنفيذ الإجراءات
async function suspendUser(userId) {
  const reason = prompt("يرجى إدخال سبب الإيقاف:");
  if (!reason) return;
  const { error } = await supabase.from('users').update({ status: `موقوف: ${reason}` }).eq('id', userId);
  if (error) {
    console.error("Error suspending user:", error.message);
  } else {
    alert("تم إيقاف الحساب بنجاح.");
    location.reload();
  }
}

async function addExamScores(userId) {
  const examName = prompt("اسم الامتحان:");
  const totalMarks = parseInt(prompt("الدرجة الكلية:"), 10);
  const obtainedMarks = parseInt(prompt("الدرجة المحصل عليها:"), 10);

  if (!examName || isNaN(totalMarks) || isNaN(obtainedMarks)) {
    alert("يرجى ملء جميع الحقول بشكل صحيح.");
    return;
  }

  const { error } = await supabase
    .from('users')
    .update({
      exam_scores: supabase.raw(`
        array_append(exam_scores, jsonb_build_object('exam_name', '${examName}', 'total_marks', ${totalMarks}, 'obtained_marks', ${obtainedMarks}))
      `)
    })
    .
