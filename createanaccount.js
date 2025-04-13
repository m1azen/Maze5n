// signup.js

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import bcrypt from 'https://cdn.jsdelivr.net/npm/bcryptjs/+esm';

// إعداد اتصال Supabase
const SUPABASE_URL = 'https://obimikymmvrwljbpmnxb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaW1pa3ltbXZyd2xqYnBtbnhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTk3MDgsImV4cCI6MjA2MDAzNTcwOH0.iwAiOK8xzu3b2zau-CfubioYdU9Dzmj5UjsbOldZbsw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// دالة لتشفير كلمة المرور
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// معالجة إنشاء الحساب
document.getElementById("accountForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  // التحقق من صحة البيانات
  if (password !== confirmPassword) {
    displayMessage("كلمتا المرور غير متطابقتين.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    displayMessage("صيغة البريد الإلكتروني غير صحيحة.", "error");
    return;
  }

  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.style.display = "flex";

  try {
    // تشفير كلمة المرور
    const hashedPassword = await hashPassword(password);

    // التحقق من البريد الإلكتروني المكرر
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (existingUser && existingUser.length > 0) {
      throw new Error("البريد الإلكتروني مستخدم بالفعل.");
    }

    // إدخال البيانات
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username,
          email,
          password: hashedPassword,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      throw new Error("حدث خطأ أثناء حفظ البيانات.");
    }

    displayMessage(`تم إنشاء الحساب بنجاح! مرحبًا ${username}.`, "success");
  } catch (err) {
    displayMessage(err.message, "error");
  } finally {
    loadingOverlay.style.display = "none";
  }
});

// التحقق من البريد الإلكتروني
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// عرض الرسائل
function displayMessage(message, type) {
  const messageOverlay = document.getElementById("messageOverlay");
  const messageText = document.getElementById("messageText");

  messageText.textContent = message;
  messageOverlay.style.backgroundColor = type === "success" ? "green" : "red";
  messageOverlay.style.display = "flex";

  setTimeout(() => {
    messageOverlay.style.display = "none";
  }, 3000);
}
