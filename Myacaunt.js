import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// إعداد اتصال Supabase
const SUPABASE_URL = 'https://obimikymmvrwljbpmnxb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaW1pa3ltbXZyd2xqYnBtbnhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTk3MDgsImV4cCI6MjA2MDAzNTcwOH0.iwAiOK8xzu3b2zau-CfubioYdU9Dzmj5UjsbOldZbsw';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'current-user@example.com'); // عدل البريد الإلكتروني إلى الحساب الحالي

    if (error) throw error;

    // تحديث اسم المستخدم
    const usernameEl = document.getElementById('username');
    usernameEl.textContent = user[0]?.username || 'User';

    // حساب المتوسط
    const scores = user[0]?.exam_scores || [];
    const total = scores.reduce((sum, score) => sum + score.obtained_marks, 0);
    const average = scores.length ? Math.round((total / (scores.length * 100)) * 100) : 0;
    document.getElementById('averageScore').textContent = `${average}%`;

    // رسالة التحفيز
    const motivationEl = document.getElementById('motivationMessage');
    if (average < 50) {
      motivationEl.textContent = `شد شوية يا ${user[0]?.username} ❤️`;
    } else if (average < 70) {
      motivationEl.textContent = `ناقص سيكة وتبقى جامد يا بطل، ${user[0]?.username}!`;
    } else if (average < 90) {
      motivationEl.textContent = `أنت بطل يا ${user[0]?.username}!`;
    } else {
      motivationEl.textContent = `عاش أوي! 🎉`;
      document.getElementById('balloonsContainer').style.display = 'block';
      setTimeout(() => {
        document.getElementById('balloonsContainer').style.display = 'none';
      }, 5000);
    }

    // عرض جدول الدرجات
    const scoresTable = document.getElementById('examScoresTable');
    scores.forEach(score => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${score.exam_name}</td>
        <td>${score.total_marks}</td>
        <td>${score.obtained_marks}</td>
        <td>${score.exam_date}</td>
      `;
      scoresTable.appendChild(row);
    });

    // زر تسجيل الخروج
    document.getElementById('logoutButton').addEventListener('click', () => {
      alert("👋 Bye!");
      window.location.href = 'login.html'; // تعديل لرابط صفحة تسجيل الدخول
    });
  } catch (error) {
    console.error("Error loading account data:", error.message);
    alert("Please log in to access your account.");
    window.location.href = 'login.html'; // التوجيه إذا لم يتم تسجيل الدخول
  }
});
