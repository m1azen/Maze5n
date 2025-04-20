const SHEET_ID = '1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo';
const API_KEY = 'AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0';

document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn !== "true") {
    // إذا لم يكن مسجل الدخول، يتم تحويله إلى صفحة تسجيل الدخول
    window.location.href = "login.html";
  }
});





// Ensure user is logged in
document.addEventListener('DOMContentLoaded', async () => {
  const isLoggedIn = true; // Example login check
  const userId = "1"; // Example user ID
  if (isLoggedIn) {
    loadUserData(userId);
  } else {
    alert("You must be logged in to view this page!");
    window.location.href = '/login'; // Redirect to login page
  }

  // Logout functionality
  document.getElementById('logoutButton').addEventListener('click', () => {
    alert('Logged out successfully!');
    window.location.href = '/login'; // Redirect to login page
  });
});

// Fetch data from Google Sheets
async function fetchData(range) {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`
  );
  const data = await response.json();
  return data.values || [];
}

// Load user data
async function loadUserData(userId) {
  const users = await fetchData('Sheet1!A:J');
  const currentUser = users.find(user => user[0] === userId);

  if (currentUser) {
    document.getElementById('username').textContent = currentUser[1];
    document.getElementById('email').textContent = currentUser[2];
    document.getElementById('status').textContent = currentUser[4];
    document.getElementById('reason').textContent = currentUser[5] || "None";

    const exams = users.filter(user => user[0] === userId && user[6]);
    updatePerformanceCircle(exams);
    populateExamResults(exams);
    document.getElementById('messageContent').textContent = currentUser[9] || "No new messages.";
  }
}

// Update performance circle
function updatePerformanceCircle(exams) {
  const averageGrade = exams.reduce((sum, exam) => sum + parseFloat(exam[8]), 0) / exams.length || 0;
  document.documentElement.style.setProperty('--percentage', `${averageGrade}%`);
  document.getElementById('averageGrade').textContent = `${averageGrade.toFixed(2)}%`;
  const performanceMessage = averageGrade < 50 ? "Keep pushing forward! 💪" : "Great performance! Keep it up! 🎉";
  document.getElementById('performanceMessage').textContent = performanceMessage;
}

// Populate exam results
function populateExamResults(exams) {
  const examTable = document.getElementById('examTable');
  examTable.innerHTML = exams.map(exam => `
    <tr>
      <td>${exam[6]}</td>
      <td>${exam[6]}</td> 
      
      
      
      
      
