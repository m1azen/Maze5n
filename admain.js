const SHEET_ID = '1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo';
const API_KEY = 'AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0';
const RANGE_USERS = 'Sheet1!A:E';
const RANGE_MESSAGES = 'Sheet2!A:B';
const RANGE_GRADES = 'Sheet3!A:C';

// جلب البيانات من Google Sheets
async function fetchData(range) {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`
    );
    if (!response.ok) throw new Error('Error fetching data.');
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error(error.message);
    throw new Error('Failed to fetch data from Google Sheets.');
  }
}

// عرض بيانات المستخدمين
async function displayUsers() {
  const usersTable = document.getElementById("usersTable");
  try {
    const users = await fetchData(RANGE_USERS);

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
          <button onclick="sendMessage(${index})">Send Message</button>
          <button onclick="deleteUser(${index})">Delete</button>
          <button onclick="updateGrades(${index})">Add Grades</button>
        </td>
      `;
      usersTable.appendChild(row);
    });
  } catch (error) {
    usersTable.innerHTML = `<tr><td colspan="6">⚠️ Error fetching users. Please try again later.</td></tr>`;
  }
}

// إضافة درجات الامتحان
document.getElementById("gradesForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const userId = document.getElementById("examUserId").value;
  const grade = document.getElementById("examGrade").value;

  try {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE_GRADES}:append?valueInputOption=RAW&key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: [[userId, grade]] }),
      }
    );
    alert("Grade added successfully!");
  } catch (error) {
    alert("Failed to add grade.");
  }
});

// إرسال رسالة خاصة
document.getElementById("messageForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const userId = document.getElementById("messageUserId").value;
  const message = document.getElementById("messageContent").value;

  try {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE_MESSAGES}:append?valueInputOption=RAW&key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: [[userId, message]] }),
      }
    );
    alert("Message sent successfully!");
  } catch (error) {
    alert("Failed to send message.");
  }
});

// تحديث الإحصائيات
document.getElementById("updateStatsBtn").addEventListener("click", async () => {
  const totalUsers = document.getElementById("totalUsersStat").value;
  const averageGrades = document.getElementById("averageGradesStat").value;

  try {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Statistics!A:B:append?valueInputOption=RAW&key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: [[totalUsers, averageGrades]] }),
      }
    );
    alert("Statistics updated successfully!");
  } catch (error) {
    alert("Failed to update statistics.");
  }
});

// تحميل البيانات عند فتح الصفحة
document.addEventListener("DOMContentLoaded", displayUsers);
