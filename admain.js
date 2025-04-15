const SHEET_ID = '1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo';
const API_KEY = 'AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0';

// Sidebar toggle
document.getElementById("toggleSidebar").addEventListener("click", () => {
  const sidebar = document.querySelector("nav");
  const isVisible = sidebar.style.transform === "translateX(0%)";
  sidebar.style.transform = isVisible ? "translateX(-100%)" : "translateX(0%)";
});

// Fetch data from Google Sheets
async function fetchData(range) {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`
  );
  const data = await response.json();
  return data.values || [];
}

// Populate user table
async function populateUserTable() {
  const userTable = document.getElementById("userTable");
  const users = await fetchData("Sheet1!A:E");
  users.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user[0]}</td>
      <td>${user[1]}</td>
      <td>${user[2]}</td>
      <td>${user[4]}</td>
      <td>${user[5] || "None"}</td>
      <td>
        <button>Edit</button>
        <button>Suspend</button>
      </td>
    `;
    userTable.appendChild(row);
  });
}

// Populate exam table
async function populateExamTable() {
  const examTable = document.getElementById("examTable");
  const exams = await fetchData("Sheet1!F:J");
  exams.forEach((exam) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${exam[0]}</td>
      <td>${exam[5]}</td>
      <td>${exam[6]}</td>
      <td>${exam[7]}</td>
      <td>${exam[8]}</td>
    `;
    examTable.appendChild(row);
  });
}

// Add exam data
document.getElementById("examForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = document.getElementById("userId").value;
  const examName = document.getElementById("examName").value;
  const totalMarks = document.getElementById("totalMarks").value;
  const obtainedMarks = document.getElementById("obtainedMarks").value;

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A:J:append?valueInputOption=RAW&key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        values: [[userId, "", "", "", "Active", "", examName, totalMarks, obtainedMarks, ""]],
      }),
    }
  );
  alert("Exam added successfully!");
});

// Initialize data
document.addEventListener("DOMContentLoaded", () => {
  populateUserTable();
  populateExamTable();
});
