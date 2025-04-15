const SHEET_ID = "1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo";
const API_KEY = "AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0";
const RANGE = "Sheet1";

const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch(url);
  const data = await response.json();

  const users = data.values.slice(1).map(row => ({
    id: row[0],
    username: row[1],
    email: row[2],
    status: row[3],
    score: parseFloat(row[4]) || 0
  }));

  // إحصائيات
  const total = users.length;
  const active = users.filter(u => u.status === 'نشط').length;
  const suspended = users.filter(u => u.status === 'موقوف').length;
  const average = (users.reduce((sum, u) => sum + u.score, 0) / total).toFixed(2);

  document.getElementById('totalUsers').textContent = total;
  document.getElementById('activeUsers').textContent = active;
  document.getElementById('suspendedUsers').textContent = suspended;
  document.getElementById('averageScore').textContent = average;

  // جدول المستخدمين
  const table = document.getElementById("usersTable");
  users.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${u.username}</td>
      <td>${u.email}</td>
      <td>${u.status}</td>
      <td>${u.score}</td>
      <td>
        <button onclick="editUser('${u.id}')">تعديل</button>
        <button onclick="suspendUser('${u.id}')">إيقاف</button>
      </td>
    `;
    table.appendChild(tr);
  });

  drawChart(active, suspended);
});

// رسم الدوائر
function drawChart(active, suspended) {
  new Chart(document.getElementById("statusChart"), {
    type: 'doughnut',
    data: {
      labels: ['نشط', 'موقوف'],
      datasets: [{
        label: 'نسبة الحالات',
        data: [active, suspended],
        backgroundColor: ['#2b5876', '#f44336']
      }]
    }
  });
}

function editUser(id) {
  alert(`تعديل المستخدم: ${id}`);
}

function suspendUser(id) {
  alert(`تم إيقاف المستخدم: ${id}`);
}
