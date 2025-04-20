const SHEET_ID = "1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo";
const API_KEY = "AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0";

let users = []; // مصفوفة لتخزين بيانات المستخدمين

async function fetchUsers() {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`);
    const data = await response.json();
    users = data.values.slice(1).map(row => ({
        id: row[0],
        username: row[1],
        password: row[3],
        status: row[4],
        reason: row[5]
    }));
}

document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // منع الإرسال الافتراضي
    await fetchUsers(); // تحميل المستخدمين

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        if (user.status === "موقوف") {
            document.getElementById("message").textContent = `حسابك موقوف. السبب: ${user.reason}`;
            return; // يمنع الدخول
        }
        localStorage.setItem("userEmail", email);
        // إذا كانت بيانات الدخول صحيحة، انتقل إلى session.html
        window.location.href = "Myacaunt.html";
    } else {
        document.getElementById("message").textContent = "اسم المستخدم أو كلمة المرور غير صحيحة.";
    }
});
localStorage.setItem("isLoggedIn", "true");
localStorage.setItem("username", "Mazen"); // اسم المستخدم
 document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  // تحقق من صحة بيانات تسجيل الدخول (افتراضيًا يتم التحقق هنا)
  if (username === "admin" && password === "1234") { // مثال بسيط
   document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  // تحقق من صحة بيانات تسجيل الدخول (افتراضيًا يتم التحقق هنا)
  if (username === "admin" && password === "1234") { // مثال بسيط
    // حفظ حالة تسجيل الدخول
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username);

    // توجيه المستخدم إلى الصفحة الرئيسية
    window.location.href = "html.html";
  } else {
    alert("Invalid username or password!");
  }
});

