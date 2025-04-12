import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// إعداد اتصال Supabase
const SUPABASE_URL = 'https://your-project.supabase.co'; // استبدل بـ URL الخاص بمشروعك
const SUPABASE_KEY = 'your-anon-key'; // استبدل بـ المفتاح العام الخاص بك
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// استماع للنموذج عند الإرسال
document.getElementById("accountForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // منع إعادة تحميل الصفحة

  // جلب القيم من النموذج
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  // التحقق من صحة كلمات المرور
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // عرض مؤشر التحميل أثناء العملية
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
          password: password, // يمكن تحسين الأمان لاحقًا بالتشفير
          status: 'Active', // الحالة الافتراضية
          created_at: new Date().toISOString() // حفظ وقت الإنشاء
        }
      ]);

    if (error) {
      console.error("Error adding user:", error.message);
      alert(`Error: ${error.message}`);
      return;
    }

    // عرض رسالة النجاح
    const messageOverlay = document.getElementById("messageOverlay");
    const welcomeMessage = document.getElementById("welcomeMessage");
    welcomeMessage.textContent = `Welcome, ${username}! Your account has been created successfully.`;
    messageOverlay.style.display = "flex";
  } catch (error) {
    console.error("Unexpected error:", error);
    alert("An unexpected error occurred. Please try again later.");
  } finally {
    // إخفاء مؤشر التحميل
    loadingOverlay.style.display = "none";
  }
});

// توجيه المستخدم بعد الضغط على زر OK
document.getElementById("ok-button").addEventListener("click", () => {
  window.location.href = "html.html"; // توجيه المستخدم إلى الصفحة الرئيسية أو أخرى
});
