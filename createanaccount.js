import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// إعداد اتصال Supabase
const SUPABASE_URL = 'https://obimikymmvrwljbpmnxb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaW1pa3ltbXZyd2xqYnBtbnhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTk3MDgsImV4cCI6MjA2MDAzNTcwOH0.iwAiOK8xzu3b2zau-CfubioYdU9Dzmj5UjsbOldZbsw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById("accountForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // منع إعادة تحميل الصفحة

  // جلب القيم من النموذج
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  // التحقق من صحة كلمات المرور
  if (password !== confirmPassword) {
    displayMessage("Passwords do not match!", "error");
    return;
  }

  // عرض مؤشر التحميل
  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.style.display = "flex";

  try {
    // إضافة بيانات المستخدم إلى الجدول في Supabase
    const { data, error } = await supabase
      .from('users') // اسم الجدول
      .insert([
        {
          username: username,
          email: email,
          password: password, // قم بتشفير كلمة المرور إذا لزم الأمر
          created_at: new Date().toISOString() // وقت الإنشاء
        }
      ]);

    if (error) {
      throw new Error(error.message); // إذا حدث خطأ
    }

    // عرض رسالة نجاح مرحبًا باسم المستخدم
    displayMessage(`Welcome, ${username}! Redirecting...`, "success");

    // الانتقال إلى الصفحة `homepage.html` بعد 2 ثانية
    setTimeout(() => {
      window.location.href = "homepage.html";
    }, 2000);
  } catch (error) {
    console.error("Error occurred:", error);
    displayMessage(error.message, "error");
  } finally {
    // إخفاء مؤشر التحميل
    loadingOverlay.style.display = "none";
  }
});

// دالة لعرض الرسالة في منتصف الصفحة واختفاءها
function displayMessage(message, type) {
  const messageOverlay = document.getElementById("messageOverlay");
  const messageText = document.getElementById("messageText");

  // تخصيص الرسالة حسب النوع
  messageText.textContent = message;
  messageOverlay.style.backgroundColor = type === "success" ? "rgba(0, 128, 0, 0.8)" : "rgba(255, 0, 0, 0.8)";
  messageOverlay.style.display = "flex";

  // اختفاء الرسالة تلقائيًا بعد 2 ثانية
  setTimeout(() => {
    messageOverlay.style.display = "none";
  }, 2000);
}
