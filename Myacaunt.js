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
      alert("يرجى تسجيل الدخول للوصول إلى حسابك.");
      window.location.href = 'login.html';
      return;
    }

    const userEmail = session.user.email;

    // جلب بيانات المستخدم من Supabase
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', userEmail);

    if (error || userData.length === 0) {
      console.error("Error fetching user data:", error?.message);
      alert("فشل في تحميل بيانات حسابك. حاول مرة أخرى.");
      return;
    }

    const user = userData[0];

    // تحديث مربع بيانات المستخدم
    const userInfoEl = document.getElementById('userInfo');
    userInfoEl.innerHTML = `
      <h2>بيانات المستخدم</h2>
      <p><strong>الاسم:</strong> ${user.username || 'غير معروف'}</p>
      <p><strong>البريد الإلكتروني:</strong> ${user.email || 'غير معروف'}</p>
      <p><strong>الحالة:</strong> ${user.status || 'غير معروف'}</p>
    `;

    // حساب وعرض متوسط الدرجات
    const scores = user.exam_scores || [];
    const totalObtained = scores.reduce((sum, score) => sum + score.obtained_marks, 0);
    const totalPossible = scores.reduce((sum, score) => sum + score.total_marks, 0);
    const average = totalPossible > 0 ? Math.round((totalObtained / totalPossible) * 100) : 0;

    document.getElementById('averageScore').textContent = `${average}%`;
    document.getElementById('averageScoreTitle').textContent = "متوسط الدرجات";

    // رسالة التحفيز
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
        <td>${score.exam_date || 'غير متوفر'}</td>
      `;
      scoresTable.appendChild(row);
    });

    // زر تسجيل الخروج
    document.getElementById('logoutButton').addEventListener('click', async () => {
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) {
        console.error("Logout error:", logoutError.message);
        return;
      }
      alert("👋 تم تسجيل الخروج بنجاح!");
      window.location.href = 'login.html';
    });

  } catch (error) {
    console.error("Error loading account data:", error.message);
    alert("حدث خطأ. حاول مرة أخرى.");
    window.location.href = 'login.html';
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
