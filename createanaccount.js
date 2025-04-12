import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// إعداد اتصال Supabase
const SUPABASE_URL = 'https://your-project.supabase.co'; // استبدل بـ URL الخاص بمشروعك
const SUPABASE_KEY = 'your-anon-key'; // استبدل بـ مفتاح Supabase
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
    displayMessage("Passwords do not match!", "error");
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
          created_at: new Date().toISOString() // وقت الإنشاء
        }
      ]);

    if (error) {
      throw new Error(error.message);
    }

    // عرض رسالة النجاح
    displayMessage(`Welcome, ${username}! Your account has been created successfully.`, "success");
  } catch (error) {
    console.error("Error occurred:", error);
    displayMessage(error.message, "error");
  } finally {
    // إخفاء مؤشر التحميل بعد المعالجة
    loadingOverlay.style.display = "none";
  }
});

// دالة لعرض الرسالة واختفاءها بعد 2 ثانية
function displayMessage(message, type) {
  const messageOverlay = document.getElementById("messageOverlay");
  const messageText = document.getElementById("messageText");

  // تخصيص الرسالة حسب النوع
  messageText.textContent = message;
  messageOverlay.style.backgroundColor = type === "success" ? "rgba(0, 128, 0, 0.8)" : "rgba(255, 0, 0, 0.8)";
  messageOverlay.style.display = "flex";

  // إخفاء الرسالة بعد 2 ثانية
  setTimeout(() => {
    messageOverlay.style.display = "none";
  }, 2000);
}
