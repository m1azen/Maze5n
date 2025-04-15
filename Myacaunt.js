const SHEET_ID = '1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo';
const API_KEY = 'AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0';

// Check login status
document.addEventListener('DOMContentLoaded', async () => {
  const isLoggedIn = true; // Example login check
  const userId = "1"; // Example user ID
  const accountPage = document.getElementById('accountPage');
  const loginCheck = document.getElementById('loginCheck');

  if (isLoggedIn) {
    accountPage.style.display = 'block';
    loginCheck.style.display = 'none';

    loadUserData(userId); // Load user data
  } else {
    accountPage.style.display = 'none';
    loginCheck.style.display = 'flex';
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
    document.getElementById('suspensionReason').textContent = currentUser[5] || "None";

    // Load average grade
    const averageGrade = calculateAverageGrade(users, userId);
    document.querySelector('.animated-circle').style.setProperty('--percentage', `${averageGrade}%`);
    document.getElementById('averageGrade').textContent = `${averageGrade}%`;

    // Load motivation message
    const isTopUser = users.every(user => calculateAverageGrade(users, user[0]) <= averageGrade);
    const message = isTopUser
      ? "You're the top performer! 🎉"
      : averageGrade < 50
      ? "Keep pushing forward! 💪"
      : "Great progress, maintain this pace!";
    document.getElementById('performanceMessage').textContent = message;

    // Load exams
    const examTable = document.getElementById('examTable');
    const exams = users.filter(user => user[0] === userId && user[6]);
    examTable.innerHTML = exams.map(exam => `
      <tr>
        <td>${exam[6]}</td>
        <td>${exam[7]}</td>
        <td>${exam[8]}</td>
        <td>${exam[8] >= exam[7] * 0.5 ? "Pass" : "Fail"}</td>
      </tr>
    `).join('');

    // Load user messages
    document.getElementById('messages').textContent = currentUser[9] || "No messages.";
  }
}

// Calculate average grade
function calculateAverageGrade(users, userId) {
  const exams = users.filter(user => user[0] === userId && user[8]);
  const totalObtained = exams.reduce((sum, exam) => sum + parseFloat(exam[8]), 0);
  return exams.length ? (totalObtained / exams.length).toFixed(2) : 0;
}
