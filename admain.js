const SHEET_ID = '1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo';
const API_KEY = 'AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0';

// دالة لجلب البيانات
async function fetchData(range) {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`
  );
  if (!response.ok) throw new Error(`خطأ: ${response.status} ${response.statusText}`);
  const data = await response.json();
  return data.values || [];
}

// عرض الإحصائيات
async function displayStatistics() {
  const users = await fetchData('Sheet1!A:E');
  document.getElementById('total-users').textContent = users.length;
  document.getElementById('active-users').textContent = users.filter(user => user[3] === 'Active').length;
}

// عرض المستخدمين
async function displayUsers() {
  const usersTable = document.getElementById('users-table');
  const users = await fetchData('Sheet1!A:E');
  usersTable.innerHTML = users.map(user => `
    <tr>
      <td>${user[0]}</td>
      <td>${user[1]}</td>
      <td>${user[3]}</td>
      <td><button>تعديل</button><button>حذف</button></td>
    </tr>
  `).join('');
}

// عند التحميل
document.addEventListener('DOMContentLoaded', () => {
  displayStatistics();
  displayUsers();
});
