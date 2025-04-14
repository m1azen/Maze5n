const SHEET_ID = '1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo'; // Google Sheets ID
const API_KEY = 'AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0'; // API Key
const RANGE = 'Sheet1!A:E'; // النطاق داخل Google Sheets

// تشفير كلمة المرور باستخدام bcryptjs
async function hashPassword(password) {
  const saltRounds = 10; // عدد دورات التشفير
  return bcrypt.hash(password, saltRounds);
}

// معالجة إرسال النموذج
document.getElementById("accountForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  // التحقق من صحة البيانات
  if (password !== confirmPassword) {
    displayMessage("كلمات المرور غير متطابقة", "error");
    return;
  }

  if (!isValidEmail(email)) {
    displayMessage("صيغة البريد الإلكتروني غير صحيحة", "error");
    return;
  }

  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.style.display = "flex";

  try {
    // التحقق إذا كان البريد الإلكتروني موجودًا بالفعل
    const existingUser = await checkIfEmailExists(email);
    if (existingUser) {
      throw new Error("البريد الإلكتروني مستخدم بالفعل.");
    }

    // تشفير كلمة المرور
    const hashedPassword = await hashPassword(password);

    // إضافة المستخدم إلى Google Sheets
    await addUserToGoogleSheets(username, email, hashedPassword);

    displayMessage(`تم إنشاء الحساب بنجاح! مرحبًا بك، ${username}.`, "success");
  } catch (err) {
    displayMessage(err.message, "error");
  } finally {
    loadingOverlay.style.display = "none";
  }
});

// التحقق من صيغة البريد الإلكتروني
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

// التحقق إذا كان البريد الإلكتروني موجودًا بالفعل
async function checkIfEmailExists(email) {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    );
    const data = await response.json();

    if (data.values) {
      return data.values.some((row) => row[1] === email); // افتراض أن البريد الإلكتروني في العمود الثاني
    }
    return false;
  } catch (err) {
    console.error("Error checking email:", err);
    throw new Error("تعذر التحقق من البريد الإلكتروني.");
  }
}

// إضافة المستخدم إلى Google Sheets
async function addUserToGoogleSheets(username, email, hashedPassword) {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}:append?valueInputOption=RAW&key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          values: [[username, email, hashedPassword, "Active", new Date().toISOString()]],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Sheets Error:", errorText);
      throw new Error("فشل في إضافة المستخدم إلى Google Sheets.");
    }
  } catch (err) {
    console.error("Error adding user:", err);
    throw new Error("فشل في إضافة المستخدم إلى Google Sheets.");
  }
}
