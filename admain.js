// admin.js

const SHEET_ID = '1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo'; // Google Sheets ID
const API_KEY = 'AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0'; // Google Sheets API Key
const RANGE_USERS = 'Sheet1!A2:E'; // Users data range
const RANGE_EXAMS = 'Sheet2!A1:B'; // Exams data range

// Fetch data from Google Sheets
async function fetchData(range) {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`
    );
    if (!response.ok) throw new Error("Failed to fetch data.");
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return null;
  }
}

// Display users in HTML table
async function displayUsers() {
  const usersTable = document.getElementById("usersTable");
  const users = await fetchData(RANGE_USERS);

  if (users === null) {
    usersTable.innerHTML = `
      <tr>
        <td colspan="6">⚠️ Error fetching users. Please try again later.</td>
      </tr>
    `;
    return;
  }

  if (users.length === 0) {
    usersTable.innerHTML = `
      <tr>
        <td colspan="6">🔍 No accounts added yet.</td>
      </tr>
    `;
    return;
  }

  usersTable.innerHTML = "";
  users.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user[0]}</td>
      <td>${user[1]}</td>
      <td>${user[2]}</td>
      <td>${user[3]}</td>
      <td>
        <button onclick="deleteUser(${index})">Delete</button>
        <button onclick="suspendUser(${index})">Suspend</button>
      </td>
    `;
    usersTable.appendChild(row);
  });
}

// Add exam topic
document.getElementById("addExamTopicBtn").addEventListener("click", async () => {
  const topic = document.getElementById("examTopicInput").value.trim();
  if (topic) {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE_EXAMS}:append?valueInputOption=RAW&key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [[topic]] }),
      }
    );
    document.getElementById("examTopicInput").value = "";
    alert("Exam topic added successfully!");
  }
});

// Update statistics
document.getElementById("updateStatsBtn").addEventListener("click", async () => {
  const totalUsers = document.getElementById("totalUsersStat").value;
  const averageGrades = document.getElementById("averageGradesStat").value;

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Statistics!A1:B1:append?valueInputOption=RAW&key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [[totalUsers, averageGrades]] }),
    }
  );
  alert("Statistics updated successfully!");
});

// Load data on page load
document.addEventListener("DOMContentLoaded", () => {
  displayUsers();
});
