const SHEET_ID = '1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo'; // ضع معرف Google Sheets هنا
const API_KEY = 'AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0'; // ضع مفتاح API هنا

// دالة لجلب البيانات من Google Sheets
async function fetchData(range) {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`
    );
    if (!response.ok) throw new Error(`خطأ: ${response.status} ${response.statusText}`);
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
}

// دالة لعرض الإحصائيات الدائرية
async function displayStatistics() {
  try {
    const users = await fetchData('Sheet1!A:H');
    const exams = await fetchData('Sheet3!A:E');

    const totalUsers = users.length;
    const suspendedUsers = users.filter((user) => user[3] === "موقوف").length;
    const grades = exams.map((exam) => parseFloat(exam[3]) || 0);
    const averageGrades = grades.reduce((a, b) => a + b, 0) / (grades.length || 1);

    // تحديث القيم للإحصائيات
    document.getElementById("totalUsersChart").style.setProperty("--value", `${100}%`);
    document.getElementById("totalUsersChart").textContent = totalUsers;

    document.getElementById("suspendedUsersChart").style.setProperty("--value", `${(suspendedUsers / totalUsers) * 100}%`);
    document.getElementById("suspendedUsersChart").textContent = suspendedUsers;

    document.getElementById("averageGradesChart").style.setProperty("--value", `${(averageGrades / 100) * 100}%`);
    document.getElementById("averageGradesChart").textContent = averageGrades.toFixed(1);
  } catch (error) {
    console.error("Error displaying statistics:", error.message);
  }
}

// دالة لعرض المستخدمين
async function displayUsers() {
  try {
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
  } catch (error) {
    console.error("Error displaying users:", error.message);
  }
}

// إضافة نتائج امتحانات
document.addEventListener("DOMContentLoaded", () => {
  const examForm = document.getElementById("examForm");

  if (examForm) {
    examForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      try {
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
            body: JSON.stringify({ values: [[userId, examName, totalMarks, obtainedMarks, status]] }),
          }
        );
        alert("تمت إضافة النتيجة بنجاح!");
        displayExams();
      } catch (error) {
        console.error("Error adding exam result:", error.message);
      }
    });
  } else {
    console.error("عنصر 'examForm' غير موجود!");
  }

  displayStatistics();
  displayUsers();
  displayExams();
});

// عرض نتائج الامتحانات
async function displayExams() {
  try {
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
  } catch (error) {
    console.error("Error displaying exams:", error.message);
  }
}
