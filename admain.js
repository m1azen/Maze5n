const SHEET_ID = '1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo';
const API_KEY = 'AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0';

// دالة لجلب البيانات
async function fetchData(range) {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`
  );
  if (!response.ok) throw new Error(`خطأ: ${response.status} ${response.statusText}`);
  const data = await response.json();
  return data.values || [];
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

// إضافة نتيجة امتحان
document.getElementById("examForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const userId = document.getElementById("userId").value;
  const examName = document.getElementById("examName").value;
  const totalMarks = document.getElementById("totalMarks").value;
  const obtainedMarks = document.getElementById("obtainedMarks").value;

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet3!A:D:append?valueInputOption=RAW&key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        values: [[userId, examName, totalMarks, obtainedMarks]],
      }),
    }
  );
  alert("تمت إضافة نتيجة الامتحان بنجاح!");
});

// إرسال رسالة
document.getElementById("messageForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const userId = document.getElementById("messageUserId").value;
  const message = document.getElementById("messageContent").value;

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet2!A:B:append?valueInputOption=RAW&key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        values: [[userId, message]],
      }),
    }
  );
  alert("تم إرسال الرسالة بنجاح!");
});

// تحميل البيانات عند فتح الصفحة
document.addEventListener("DOMContentLoaded", displayUsers);
