const SHEET_ID = '1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo'; // Google Sheets ID
const API_KEY = 'AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0'; // API Key
const RANGE = 'Sheet1!A:E'; // نطاق البيانات داخل Google Sheets

// تشفير كلمة المرور باستخدام bcrypt
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

  // تحقق من صحة كلمة المرور والبريد الإلكتروني
  if (password !== confirmPassword) {
    displayMessage("Passwords do not match.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    displayMessage("Invalid email format.", "error");
    return;
  }

  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.style.display = "flex";

  try {
    // التحقق من تكرار البريد الإلكتروني في Google Sheets
    const existingUser = await checkIfEmailExists(email);
    if (existingUser) {
      throw new Error("Email is already in use.");
    }

    // تشفير كلمة المرور
    const hashedPassword = await hashPassword(password);

    // إضافة المستخدم إلى Google Sheets
    await addUserToGoogleSheets(username, email, hashedPassword);

    displayMessage(`Account created successfully! Welcome, ${username}.`, "success");
  } catch (err) {
    displayMessage(err.message, "error");
  } finally {
    loadingOverlay.style.display = "none";
  }
});

// التحقق من البريد الإلكتروني بصيغة صحيحة
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

// التحقق إذا كان البريد الإلكتروني موجودًا في Google Sheets
async function checkIfEmailExists(email) {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    );
    const data = await response.json();

    // البحث عن البريد الإلكتروني في البيانات
    if (data.values) {
      return data.values.some((row) => row[1] === email); // افتراض أن العمود الثاني يحتوي على البريد الإلكتروني
    }
    return false;
  } catch (err) {
    console.error("Error checking email:", err);
    throw new Error("Failed to check email in Google Sheets.");
  }
}

// إضافة مستخدم إلى Google Sheets
async function addUserToGoogleSheets(username, email, hashedPassword) {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}:append?valueInputOption=RAW&key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          values: [[username, email, hashedPassword, "Active", new Date().toISOString()]],
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add user to Google Sheets.");
    }
  } catch (err) {
    console.error("Error adding user:", err);
    throw new Error("Failed to add user to Google Sheets.");
  }
}
