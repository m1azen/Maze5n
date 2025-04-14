const SHEET_ID = '1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo'; // ID الخاص بـ Google Sheets
const API_KEY = 'AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0'; // API Key الخاص بك
const RANGE = 'Sheet1!A:E'; // نطاق البيانات داخل Google Sheets

document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // منع إعادة تحميل الصفحة

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    displayMessage('❌ Please enter your email and password.', false);
    return;
  }

  try {
    // جلب البيانات من Google Sheets
    const users = await fetchDataFromGoogleSheets();

    // التحقق من وجود البريد الإلكتروني
    const user = users.find((user) => user[1] === email); // افتراض أن العمود الثاني يحتوي على البريد الإلكتروني
    if (!user) {
      displayMessage('❌ Email or password is incorrect.', false);
      return;
    }

    // التحقق من كلمة المرور باستخدام bcrypt
    const isPasswordValid = await bcrypt.compare(password, user[2]); // افتراض أن العمود الثالث يحتوي على كلمة المرور المشفرة
    if (!isPasswordValid) {
      displayMessage('❌ Email or password is incorrect.', false);
      return;
    }

    // التحقق من حالة المستخدم
    if (user[3] === 'Suspended') { // افتراض أن العمود الرابع يحتوي على حالة المستخدم
      displayMessage('❌ Your account is suspended. Please contact support.', false);
      return;
    }

    // تسجيل الدخول بنجاح
    displayMessage(`🎉 Welcome ${user[0]}! Login successful.`, true); // افتراض أن العمود الأول يحتوي على اسم المستخدم
    setTimeout(() => {
      window.location.href = 'html.html'; // توجيه إلى صفحة أخرى بعد تسجيل الدخول
    }, 2000);
  } catch (error) {
    console.error('Error during login:', error);
    displayMessage('❌ An error occurred during login. Please try again.', false);
  }
});

// دالة لجلب البيانات من Google Sheets
async function fetchDataFromGoogleSheets() {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    );
    const data = await response.json();

    if (!data.values) {
      throw new Error('No data found in the sheet.');
    }

    return data.values; // إعادة البيانات كصفوف
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error.message);
    throw new Error('Failed to fetch data from Google Sheets.');
  }
}

// دالة لعرض الرسائل
function displayMessage(message, isSuccess) {
  const messageOverlay = document.getElementById('messageOverlay');
  const messageText = document.getElementById('messageText');

  messageText.textContent = message;
  messageOverlay.style.backgroundColor = isSuccess ? 'rgba(0, 128, 0, 0.8)' : 'rgba(255, 0, 0, 0.8)';
  messageOverlay.style.display = 'flex';

  setTimeout(() => {
    messageOverlay.style.display = 'none';
  }, 3000);
}
