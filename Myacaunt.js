const SHEET_ID = '1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo';
const API_KEY = 'AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0';

document.addEventListener("DOMContentLoaded", async () => {
  const email = localStorage.getItem("userEmail");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // التحقق من تسجيل الدخول
  if (!email || isLoggedIn !== "true") {
    window.location.href = "login.html";
    return;
  }

  // جلب البيانات من Google Sheets
  const users = await fetchData('Sheet1!A:J');
  const currentUser = users.find(user => user[2] === email); // عمود 2 = الإيميل

  // التحقق من وجود المستخدم
  if (!currentUser) {
    alert("User not found.");
    return;
  }

  // عرض البيانات
  document.getElementById('username').textContent = currentUser[1]; // الاسم
  document.getElementById('email').textContent = currentUser[2]; // الإيميل
  document.getElementById('status').textContent = currentUser[4]; // الحالة
  document.getElementById('reason').textContent = currentUser[5] || "None";
  document.getElementById('messageContent').textContent = currentUser[9] || "No new messages.";

  // عرض الدرجات
  const exams = users.filter(user => user[2] === email && user[6]); // تعديل هنا للتحقق من وجود الامتحانات
  updatePerformanceCircle(exams);
  populateExamResults(exams);

  // زر تسجيل الخروج
  document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.clear();
    alert('Logged out successfully!');
    window.location.href = 'login.html';
  });
});

// Fetch from Google Sheets
async function fetchData(range) {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`
  );
  
  // التحقق من استجابة الخادم
  if (!response.ok) {
    throw new Error('Failed to fetch data from Google Sheets.');
  }

  const data = await response.json();
  return data.values || [];
}

// عرض المتوسط
function updatePerformanceCircle(exams) {
  const averageGrade = exams.reduce((sum, exam) => sum + parseFloat(exam[8] || 0), 0) / exams.length || 0;
  document.documentElement.style.setProperty('--percentage', `${averageGrade}%`);
  document.getElementById('averageGrade').textContent = `${averageGrade.toFixed(2)}%`;
  const message = averageGrade < 50 ? "Keep pushing forward! 💪" : "Great performance! Keep it up! 🎉";
  document.getElementById('performanceMessage').textContent = message;
}

// جدول النتائج
function populateExamResults(exams) {
  const examTable = document.getElementById('examTable');
  examTable.innerHTML = exams.map(exam => `
    <tr>
      <td>${exam[6]}</td>
      <td>${exam[7]}</td>
      <td>${exam[8]}%</td>
    </tr>
  `).join('');
}
