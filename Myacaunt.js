import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// إعداد اتصال Supabase
const SUPABASE_URL = 'https://obimikymmvrwljbpmnxb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaW1pa3ltbXZyd2xqYnBtbnhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTk3MDgsImV4cCI6MjA2MDAzNTcwOH0.iwAiOK8xzu3b2zau-CfubioYdU9Dzmj5UjsbOldZbsw';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // التحقق من تسجيل الدخول
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      alert("Please log in to access your account.");
      window.location.href = 'login.html'; // توجيه المستخدم إلى صفحة تسجيل الدخول
      return;
    }

    const userEmail = session.user.email; // جلب البريد الإلكتروني للمستخدم المسجل دخول

    // جلب بيانات المستخدم من Supabase
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', userEmail);

    if (error || userData.length === 0) {
      console.error("Error fetching user data:", error?.message);
      alert("Failed to load your account data. Please try again.");
      return;
    }

    const user = userData[0];

    // تحديث اسم المستخدم
    const usernameEl = document.getElementById('username');
    usernameEl.textContent = user.username || 'User';

    // حساب متوسط الدرجات
    const scores = user.exam_scores || [];
    const totalObtained = scores.reduce((sum, score) => sum + score.obtained_marks, 0);
    const totalPossible = scores.reduce((sum, score) => sum + score.total_marks, 0);
    const average = totalPossible > 0 ? Math.round((totalObtained / totalPossible) * 100) : 0;
    document.getElementById('averageScore').textContent = `${average}%`;

    // عرض رسالة تحفيزية
    const motivationEl = document.getElementById('motivationMessage');
    if (average < 50) {
      motivationEl.textContent = `شد شوية يا ${user.username} ❤️`;
    } else if (average < 70) {
      motivationEl.textContent = `ناقص سيكة وتبقى جامد يا بطل، ${user.username}!`;
    } else if (average < 90) {
      motivationEl.textContent = `أنت بطل يا ${user.username}!`;
    } else {
      motivationEl.textContent = `عاش أوي! 🎉`;
      displayBalloons();
    }

    // عرض جدول الدرجات
    const scoresTable = document.getElementById('examScoresTable');
    scores.forEach(score => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${score.exam_name}</td>
        <td>${score.total_marks}</td>
        <td>${score.obtained_marks}</td>
        <td>${score.exam_date || 'N/A'}</td>
      `;
      scoresTable.appendChild(row);
    });

    // تسجيل الخروج
    document.getElementById('logoutButton').addEventListener('click', async () => {
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) {
        console.error("Logout error:", logoutError.message);
        return;
      }
      alert("👋 Bye!");
      window.location.href = 'login.html';
    });

  } catch (error) {
    console.error("Error loading account data:", error.message);
    alert("An error occurred. Please try again.");
    window.location.href = 'login.html'; // التوجيه في حالة وجود خطأ
  }
});

// دالة لإظهار البلالين
function displayBalloons() {
  const balloonsContainer = document.getElementById('balloonsContainer');
  balloonsContainer.style.display = 'block';

  setTimeout(() => {
    balloonsContainer.style.display = 'none';
  }, 5000);
}
