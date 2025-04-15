// admain.js
const SHEET_ID = "1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo";
const API_KEY = "AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0";
const BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values`;

async function fetchData() {
  const res = await fetch(`${BASE}/users?key=${API_KEY}`);
  const json = await res.json();
  return json.values.slice(1); // Skip header row
}

function renderTable(users) {
  const table = document.getElementById("usersTable");
  table.innerHTML = "";
  users.forEach((user, i) => {
    const [id, username, email, status, msg, score] = user;
    table.innerHTML += `
      <tr>
        <td>${id}</td>
        <td>${username}</td>
        <td>${email}</td>
        <td>${status}</td>
        <td><input type="text" placeholder="رسالة" onchange="sendMsg(${id}, this.value)"></td>
        <td>
          <button onclick="editUser(${id})">تعديل</button>
          <button onclick="suspendUser(${id})">إيقاف</button>
          <button onclick="deleteUser(${id})">حذف</button>
        </td>
      </tr>
    `;
  });
}

function calcStats(users) {
  document.getElementById("totalUsers").textContent = users.length;
  const active = users.filter(user => user[3] === "نشط").length;
  document.getElementById("activeUsers").textContent = active;
  const scores = users.map(u => parseFloat(u[5]) || 0);
  const avg = scores.reduce((a, b) => a + b, 0) / users.length;
  document.getElementById("avgGrades").textContent = avg.toFixed(1);
  const maxIndex = scores.indexOf(Math.max(...scores));
  document.getElementById("bestUser").textContent = users[maxIndex]?.[1] || "--";
}

function sendMsg(userId, msg) {
  alert(`سيتم إرسال: ${msg} للمستخدم ${userId}`);
  // هنا تقدر تبعت الرسالة وتعدل الجدول من Google Sheets API
}

function editUser(id) {
  alert(`تعديل المستخدم ${id}`);
}

function suspendUser(id) {
  const reason = prompt("سبب الإيقاف:");
  alert(`سيتم إيقاف المستخدم ${id} بسبب: ${reason}`);
}

function deleteUser(id) {
  if (confirm("هل أنت متأكد أنك تريد حذف هذا المستخدم؟")) {
    alert(`تم حذف المستخدم ${id}`);
  }
}

document.getElementById("examForm").addEventListener("submit", e => {
  e.preventDefault();
  const id = document.getElementById("examUserId").value;
  const name = document.getElementById("examName").value;
  const total = document.getElementById("totalMark").value;
  const mark = document.getElementById("userMark").value;
  alert(`تم إضافة امتحان ${name} للمستخدم ${id}: ${mark}/${total}`);
});

fetchData().then(users => {
  renderTable(users);
  calcStats(users);
});
