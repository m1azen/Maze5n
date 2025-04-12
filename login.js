import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// إعداد اتصال Supabase
const SUPABASE_URL = 'https://obimikymmvrwljbpmnxb.supabase.co'; // استبدل بـ رابط مشروعك
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaW1pa3ltbXZyd2xqYnBtbnhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTk3MDgsImV4cCI6MjA2MDAzNTcwOH0.iwAiOK8xzu3b2zau-CfubioYdU9Dzmj5UjsbOldZbsw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // منع إعادة تحميل الصفحة

  // جلب القيم من النموذج
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    displayMessage('❌ يرجى إدخال البريد الإلكتروني وكلمة المرور.', false);
    console.error("Validation Error: Missing email or password.");
    return;
  }

  try {
    // البحث عن المستخدم في جدول Supabase
    const { data: users, error } = await supabase
      .from('users') // اسم الجدول
      .select('*')
      .eq('email', email);

    if (error) {
      console.error("Supabase Error: ", error.message);
      throw new Error("Failed to fetch user data from Supabase.");
    }

    if (users.length === 0) {
      displayMessage('❌ البريد الإلكتروني أو كلمة المرور غير صحيحة. حاول مرة أخرى.', false);
      console.error("Login Error: User not found.");
      return;
    }

    const userData = users[0]; // أول نتيجة في البيانات

    // التحقق من كلمة المرور
    if (userData.password !== password) {
      displayMessage('❌ البريد الإلكتروني أو كلمة المرور غير صحيحة. حاول مرة أخرى.', false);
      console.error("Login Error: Incorrect password.");
      return;
    }

    // التحقق من حالة الحساب
    if (userData.status && userData.status.includes('موقوف')) {
      displayMessage(`❌ حسابك موقوف. يرجى مراجعة الإدارة.`, false);
      console.error("Login Error: Account suspended.");
      return;
    }

    // عرض رسالة نجاح وتوجيه المستخدم
    displayMessage(`🎉 مرحبًا ${userData.username}! تم تسجيل الدخول بنجاح.`, true);
    console.log("Login Successful: ", userData);

    setTimeout(() => {
      window.location.href = 'html.html'; // الانتقال إلى الصفحة الرئيسية
    }, 2000);
  } catch (error) {
    console.error("⚠️ خطأ أثناء تسجيل الدخول: ", error.message);
    displayMessage('❌ حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.', false);
  }
});

// دالة لعرض الرسائل في واجهة المستخدم
function displayMessage(message, success) {
  const messageOverlay = document.getElementById('messageOverlay');
  const messageText = document.getElementById('messageText');

  messageText.textContent = message;
  messageOverlay.style.backgroundColor = success ? 'rgba(0, 128, 0, 0.8)' : 'rgba(255, 0, 0, 0.8)';
  messageOverlay.style.display = 'flex';

  const okButton = document.getElementById('ok-button');
  okButton.style.display = success ? 'block' : 'none';

  okButton.onclick = () => {
    if (success) {
      window.location.href = 'html.html'; // الانتقال للصفحة الرئيسية عند النجاح
    } else {
      messageOverlay.style.display = 'none'; // إخفاء الرسالة عند الخطأ
    }
  };
}
