const SHEET_ID = '1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo';
const API_KEY = 'AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0';

// Sidebar Toggle
document.getElementById("toggleSidebar").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("visible");
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

  userTable.innerHTML = users.map((user) => `
    <tr>
      <td>${user[0]}</td>
      <td>${user[1]}</td>
      <td>${user[2]}</td>
      <td>${user[4]}</td>
      <td>${user[5]}</td>
      <td>
        <button onclick="editUser('${user[0]}')">Edit</button>
        <button onclick="suspendUser('${user[0]}')">Suspend</button>
      </td>
    </tr>
  `).join('');
}

// Add exam data and update chart
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
   
