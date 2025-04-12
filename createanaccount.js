import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import bcrypt from 'https://cdn.jsdelivr.net/npm/bcryptjs/+esm';

// إعداد اتصال Supabase
const SUPABASE_URL = 'https://obimikymmvrwljbpmnxb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaW1pa3ltbXZyd2xqYnBtbnhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTk3MDgsImV4cCI6MjA2MDAzNTcwOH0.iwAiOK8xzu3b2zau-CfubioYdU9Dzmj5UjsbOldZbsw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

document.getElementById("accountForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // منع إعادة تحميل الصفحة

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (password !== confirmPassword) {
    displayMessage("Passwords do not match!", "error");
    return;
  }

  if (!isValidEmail(email)) {
    displayMessage("Invalid email format!", "error");
    return;
  }

  const hashedPassword = await hashPassword(password);

  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.style.display = "flex";

  try {
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (existingUser && existingUser.length > 0) {
      displayMessage("Email already exists!", "error");
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username: username,
          email: email,
          password: hashedPassword, // تخزين كلمة المرور المشفرة
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      throw new Error("Failed to save data to Supabase. " + error.message);
    }

    const { user, session, error: signupError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (signupError) {
      throw new Error("Error during sign-up. " + signupError.message);
    }

    displayMessage(`Welcome, ${username}! Your account has been created successfully.`, "success");
  } catch (error) {
    displayMessage(error.message, "error");
  } finally {
    loadingOverlay.style.display = "none";
  }
});

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function displayMessage(message, type) {
  const messageOverlay = document.getElementById("messageOverlay");
  const messageText = document.getElementById("messageText");

  messageText.textContent = message;
  messageOverlay.style.backgroundColor = type === "success" ? "rgba(0, 128, 0, 0.8)" : "rgba(255, 0, 0, 0.8)";
  messageOverlay.style.display = "flex";

  setTimeout(() => {
    messageOverlay.style.display = "none";
  }, 2000);
}
