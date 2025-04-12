import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import bcrypt from 'https://cdn.jsdelivr.net/npm/bcryptjs/+esm';

const SUPABASE_URL = 'https://obimikymmvrwljbpmnxb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaW1pa3ltbXZyd2xqYnBtbnhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTk3MDgsImV4cCI6MjA2MDAzNTcwOH0.iwAiOK8xzu3b2zau-CfubioYdU9Dzmj5UjsbOldZbsw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // منع إعادة تحميل الصفحة

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    displayMessage('❌ يرجى إدخال البريد الإلكتروني وكلمة المرور.', false);
    return;
  }

  try {
    const { data: session, error: loginError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (loginError) {
      displayMessage('❌ البريد الإلكتروني أو كلمة المرور غير صحيحة.', false);
      return;
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (users[0].status.includes('موقوف')) {
      displayMessage('❌ حسابك موقوف. يرجى مراجعة الإدارة.', false);
      return;
    }

    displayMessage(`🎉 مرحبًا ${users[0].username}! تم تسجيل الدخول بنجاح.`, true);
    setTimeout(() => {
      window.location.href = 'html.html'; // توجيه عند النجاح
    }, 2000);
  } catch (error) {
    displayMessage('❌ حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.', false);
  }
});

function displayMessage(message, isSuccess) {
  const messageOverlay = document.getElementById('messageOverlay');
  const messageText = document.getElementById('messageText');

  messageText.textContent = message;
  messageOverlay.style.backgroundColor = isSuccess ? 'rgba(0, 128, 0, 0.8)' : 'rgba(255, 0, 0, 0.8)';
  messageOverlay.style.display = 'flex';
}
