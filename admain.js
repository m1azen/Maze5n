const sheetId = "1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo";
const apiKey = "AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0";
const usersRange = "users";

async function fetchUsers() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${usersRange}?key=${apiKey}`;
  const response = await fetch(url);
  const result = await response.json();
  const users = result.values ? result.values.slice(1) : [];
  renderUsers(users);
  updateStats(users);
}

function renderUsers(users) {
  const tbody = document.getElementById("userTableBody");
  tbody.innerHTML = "";
  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user[0]}</td>
      <td>${user[1]}</td>
      <td>${user[2]}</td>
      <td>${user[3] || 'لا توجد'}</td>
      <td>${user[4] || '0'}</td>
      <td>
        <button onclick="toggleStatus('${user[0]}')">إيقاف</button>
        <button onclick="resetPassword('${user[0]}')">تعديل الباسورد</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function updateStats(users) {
  document.getElementById("totalUsers").textContent = users.length;
  const active = users.filter(u => u[2] === "نشط").length;
  document.getElementById("activeUsers").textContent = active;
  const grades = users.map(u => parseInt(u[4] || 0));
  const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
  document.getElementById("averageGrades").textContent = isNaN(avg) ? 0 : avg.toFixed(1);
}

function addExam() {
  const id = document.getElementById("examUserId").value;
  const exam = document.getElementById("examName").value;
  const total = document.getElementById("examTotal").value;
  const score = document.getElementById("examScore").value;
  alert(`تمت إضافة الامتحان: ${exam} للمستخدم ID: ${id} - (${score}/${total})`);
}

function sendMessage() {
  const id = document.getElementById("msgUserId").value;
  const msg = document.getElementById("userMessage").value;
  alert(`تم إرسال الرسالة للمستخدم ID: ${id} \n "${msg}"`);
}

function toggleStatus(id) {
  alert(`تم تغيير حالة الحساب ID: ${id}`);
}

function resetPassword(id) {
  alert(`تم تعديل كلمة السر للمستخدم ID: ${id}`);
}

fetchUsers
