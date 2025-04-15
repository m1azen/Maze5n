const SHEET_ID = '1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo'; // Google Sheets ID
const API_KEY = 'AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0'; // API Key

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
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user[3] === "Active").length;
  const topUser = users.reduce((max, user) => (user[4] > max[4] ? user : max), users[0]);

  document.getElementById("totalUsersChart").style.setProperty("--value", "100%");
  document.getElementById("totalUsersChart").textContent = totalUsers;

  document.getElementById("activeUsersChart").style.setProperty("--value", `${(activeUsers / totalUsers) * 100}%`);
  document.getElementById("activeUsersChart").textContent = activeUsers;

  document.getElementById("topUserChart").textContent = topUser[0];
}

// دالة لعرض المستخدمين
async function displayUsers() {
  const usersTable = document.getElementById("usersTable");
  const users = await fetchData('Sheet1!A:E');
  usersTable.innerHTML = users.map((user) => `
    <tr>
      <td>${user[0]}</td>
      <td>${user[1]}</td>
      <td>${user[3]}</td>
      <td><button>رسالة</button></td>
    </tr>
  `).join("");
}

// تحميل البيانات عند فتح الصفحة
document.addEventListener("DOMContentLoaded", () => {
  displayStatistics();
  displayUsers();
});
