const SHEET_ID = '1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo'; // Google Sheets ID
const API_KEY = 'AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0'; // API Key

// دالة لجلب البيانات من Google Sheets
async function fetchData(range) {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`
  );
  if (!response.ok) throw new Error(`خطأ: ${response.status} ${response.statusText}`);
  const data = await response.json();
  return data.values || [];
}

// دالة لعرض الإحصائيات
async function displayStatistics() {
  const users = await fetchData('Sheet1!A:E');
  const exams = await fetchData('Sheet3!A:E');

  const totalUsers = users.length;
  const suspendedUsers = users.filter((user) => user[3] === "موقوف").length;
  const grades = exams.map((exam) => parseFloat(exam[3]) || 0);
  const averageGrades = grades.reduce((a, b) => a + b, 0) / grades.length;

  document.getElementById("totalUsersChart").style.setProperty("--value", `${100}%`);
  document.getElementById("totalUsersChart").textContent = totalUsers;

  document.getElementById("suspendedUsersChart").style.setProperty("--value", `${(suspendedUsers / totalUsers) * 100}%`);
  document.getElementById("suspendedUsersChart").textContent = suspendedUsers;

  document.getElementById("averageGradesChart").style.setProperty("--value", `${(averageGrades / 100) * 100}%`);
  document.getElementById("averageGradesChart").textContent = averageGrades.toFixed(1);
}

// دالة لعرض المستخدمين
async function displayUsers() {
  const usersTable = document.getElementById("usersTable");
  const users = await fetchData('Sheet1!A:E');
  usersTable.innerHTML = "";
  users.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user[0]}</td>
      <td>${user[1]}</td>
      <td>${user[2]}</td>
      <td>
        <button>تعديل</button>
        <button>حذف</button>
      </td>
    `;
    usersTable.appendChild(row);
  });
}

// دالة لعرض الامتحانات
async function displayExams() {
  const examTable = document.getElementById("examTable");
  const exams = await fetchData('Sheet3!A:E');
  examTable.innerHTML = "";
  exams.forEach((exam) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${exam[0]}</td>
      <td>${exam[1]}</td>
      <td>${exam[2]}</td>
