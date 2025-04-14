const SHEET_ID = '1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo';
const API_KEY = 'AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0';

// دالة لجلب البيانات من Google Sheets
async function fetchData(range) {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`
    );
    if (!response.ok) throw new Error(`خطأ: ${response.status} ${response.statusText}`);
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
}

// دالة لعرض الإحصائيات
async function displayStatistics() {
  const users = await fetchData('Sheet1!A:H');
  const exams = await fetchData('Sheet3!A:E');

  const totalUsers = users.length;
  const suspendedUsers = users.filter((user) => user[3] === "موقوف").length;
  const grades = exams.map((exam) => parseFloat(exam[3]) || 0);
  const averageGrades = grades.reduce((a, b) => a + b, 0) / (grades.length || 1);

  // تحديث القيم للإحصائيات الدائرية
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
  const users = await fetchData('Sheet1!A:H');
  usersTable.innerHTML = "";
  users.forEach((user, index) => {
    const statusMessage = user[3] === "موقوف" ? "🔴 الحساب موقوف" : "🟢 مفعل";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user[1]}</td>
      <td>${user[2]}</td>
      <td>${statusMessage}</td>
      <td>${user[4] || "لا يوجد سبب"}</td>
      <td>
        <button onclick="suspendUser(${index})">إيقاف</button>
        <button onclick="deleteUser(${index})">حذف</button>
        <button onclick="editUser(${index})">تعديل</button>
      </td>
    `;
    usersTable.appendChild(row);
  });
}

// دالة لعرض نتائج الامتحانات
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
      <td>${exam[3]}</td>
      <td>${exam[4]}</td>
    `;
    examTable.appendChild(row);
  });
}

// إضافة النتيجة
document.addEventListener("DOMContentLoaded", () => {
  const examForm = document.getElementById("examForm");

  if (examForm) {
    examForm.addEventListener("submit
