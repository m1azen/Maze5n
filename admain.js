const SHEET_ID = '1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo';
const API_KEY = 'AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0';

// Sidebar Toggle
document.getElementById("toggleSidebar").addEventListener("click", () => {
  const sidebarMenu = document.getElementById("sidebarMenu");
  sidebarMenu.style.display = sidebarMenu.style.display === "none" ? "block" : "none";
});

// Fetch Data
async function fetchData(range) {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`);
  const data = await response.json();
  return data.values || [];
}

// Populate Users Table
async function populateUsersTable() {
  const users = await fetchData('Sheet1!A:D');
  const table = document.getElementById('usersTable');
  table.innerHTML = users.map(user => `
    <tr>
      <td>${user[0]}</td>
      <td>${user[1]}</td>
      <td>${user[2]}</td>
      <td>${user[3]}</td>
    </tr>
  `).join('');
}

// Chatbot Logic
document.getElementById('sendMessage').addEventListener('click', () => {
  const input = document.getElementById('chatInput').value;
  const messages = document.getElementById('chatMessages');
  messages.innerHTML += `<div>User: ${input}</div><div>Bot: I'll answer your programming question!</div>`;
});

// On Page Load
populateUsersTable();
