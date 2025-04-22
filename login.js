// JavaScript
const SHEET_ID = "1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo";
const API_KEY = "AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0";

// تحقق تلقائي إذا كان المستخدم بالفعل مسجل دخوله
if (localStorage.getItem("isLoggedIn") === "true") {
  window.location.href = "Myacaunt.html"; // أو أي صفحة الحساب
}

async function fetchUsers() {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`);
  const data = await response.json();
  return data.values.slice(1).map(row => ({
    id: row[0],
    username: row[1],
    password: row[3],
    status: row[4],
    reason: row[5]
  }));
}

document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const users = await fetchUsers();
  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    if (user.status === "موقوف") {
      document.getElementById("message").textContent = `❌ حسابك موقوف. السبب: ${user.reason}`;
      return;
    }

    // حفظ بيانات الدخول
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", user.username);
    localStorage.setItem("userId", user.id);

    // توجيه المستخدم
    window.location.href = "html.html";
  } else {
    document.getElementById("message").textContent = "❌ اسم المستخدم أو كلمة المرور غير صحيحة.";
  }
});
