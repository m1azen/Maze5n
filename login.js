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
        // إذا كانت بيانات الدخول صحيحة، انتقل إلى session.html
        window.location.href = "session.html";
    } else {
        document.getElementById("message").textContent = "اسم المستخدم أو كلمة المرور غير صحيحة.";
    }
});
