const sheetId = '1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo';
const apiKey = 'AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0';
const sheetName = 'users';
const gradesSheet = 'grades';

// تحميل المستخدمين عند بداية الصفحة
document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();
  setupSearch();
  handleGradesForm();
});

// جلب المستخدمين من Google Sheets
function fetchUsers() {
  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const rows = data.values;
      const headers = rows[0];
      const users = rows.slice(1).map(row => {
        const user = {};
        headers.forEach((h, i) => user[h] = row[i] || '');
        return user;
      });
      renderUsers(users);
      renderTopUsers();
    })
    .catch(err => console.error('Error fetching users:', err));
}

// عرض المستخدمين في الجدول
function renderUsers(users) {
  const tbody = document.querySelector('#usersTable tbody');
  tbody.innerHTML = '';
  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.status}</td>
      <td>
        <button onclick="sendMessage('${user.username}')">رسالة</button>
        <button onclick="suspendUser('${user.username}')">إيقاف</button>
        <button onclick="deleteUser('${user.username}')">حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// البحث المباشر
function setupSearch() {
  const input = document.getElementById('searchInput');
  input.addEventListener('input', () => {
    const filter = input.value.toLowerCase();
    const rows = document.querySelectorAll('#usersTable tbody tr');
    rows.forEach(row => {
      const name = row.children[0].textContent.toLowerCase();
      row.style.display = name.includes(filter) ? '' : 'none';
    });
  });
}

// معالجة نموذج إضافة الدرجات
function handleGradesForm() {
  const form = document.getElementById('gradesForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('gradeUsername').value;
    const exam = document.getElementById('examName').value;
    const total = document.getElementById('totalScore').value;
    const score = document.getElementById('userScore').value;

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${gradesSheet}:append?valueInputOption=USER_ENTERED&key=${apiKey}`;
    const body = {
      values: [[username, exam, total, score]]
    };

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(() => {
      alert('تمت إضافة الدرجة بنجاح!');
      form.reset();
      renderTopUsers();
    })
    .catch(err => alert('فشل في إضافة الدرجة'));
  });
}

// عرض أفضل 3 مستخدمين حسب مجموع درجاتهم
function renderTopUsers() {
  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${gradesSheet}?key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const rows = data.values.slice(1);
      const totals = {};

      rows.forEach(([username, , , score]) => {
        if (!totals[username]) totals[username] = 0;
        totals[username] += parseFloat(score || 0);
      });

      const top = Object.entries(totals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      const container = document.getElementById('topUsersContainer');
      container.innerHTML = '';
      top.forEach(([user, total]) => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<div>${user}</div><div>${total} نقطة</div>`;
        container.appendChild(div);
      });
    });
}

// إجراءات وهمية للمستقبل (إرسال رسالة، حذف، إيقاف)
function sendMessage(username) {
  alert(`إرسال رسالة إلى ${username}`);
}

function suspendUser(username) {
  alert(`تم إيقاف ${username}`);
}

function deleteUser(username) {
  alert(`تم حذف ${username}`);
        }
