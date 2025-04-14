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

// عرض المستخدمين
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

// إضافة نتائج امتحانات
document.getElementById("examForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const userId = document.getElementById("userId").value.trim();
  const examName = document.getElementById("examName").value.trim();
  const totalMarks = parseFloat(document.getElementById("totalMarks").value);
  const obtainedMarks = parseFloat(document.getElementById("obtainedMarks").value);

  const status = obtainedMarks >= totalMarks * 0.5 ? "ناجح" : "راسب";

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet3!A:E:append?valueInputOption=RAW&key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        values: [[userId, examName, totalMarks, obtainedMarks, status]],
      }),
    }
  );
  alert("تمت إضافة النتيجة بنجاح!");
  displayExams();
});

// عرض نتائج الامتحانات
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

// حساب أفضل مستخدم حسب متوسط الدرجات
async function displayBestUser() {
  const exams = await fetchData('Sheet3!A:E');
  const userScores = {};

  exams.forEach((exam) => {
    const userId = exam[0];
    const obtainedMarks = parseFloat(exam[3]);
    if (!userScores[userId]) {
      userScores[userId] = { total: 0, count: 0 };
    }
    userScores[userId].total += obtainedMarks;
    userScores[userId].count += 1;
  });

  let bestUserId = null;
  let bestAverage = 0;
  for (const userId in userScores) {
    const average = userScores[userId].total / userScores[userId].count;
    if (average > bestAverage) {
      bestAverage = average;
      bestUserId = userId;
    }
  }

  document.getElementById("bestUserDisplay").textContent = `أفضل مستخدم: المستخدم
