const SHEET_ID = "1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo";
const API_KEY = "AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0";

document.addEventListener("DOMContentLoaded", function() {
    const userTableBody = document.querySelector("#user-table tbody");
    const examTableBody = document.querySelector("#exam-table tbody");
    const totalUsers = document.getElementById("total-users");
    const activeUsers = document.getElementById("active-users");
    const topUser = document.getElementById("top-user");
    const avgScores = document.getElementById("avg-scores");
    
    let users = []; // مصفوفة لتخزين بيانات المستخدمين
    let exams = []; // مصفوفة لتخزين درجات الامتحانات

    async function fetchData() {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`);
        const data = await response.json();
        populateUsers(data.values);
    }

    function populateUsers(data) {
        users = data.slice(1).map(row => ({
            id: row[0],
            username: row[1],
            email: row[2],
            status: row[3],
        }));
        updateUserTable();
        updateStatistics();
    }

    function updateUserTable() {
        userTableBody.innerHTML = "";
        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.status}</td>
                <td>
                    <button onclick="editUser('${user.id}')">تعديل</button>
                    <button onclick="removeUser('${user.id}')">حذف</button>
                    <button onclick="suspendUser('${user.id}')">إيقاف</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    }

    window.editUser = function(id) {
        const user = users.find(user => user.id === id);
        const newPassword = prompt("أدخل كلمة المرور الجديدة:", user.password);
        if (newPassword) {
            user.password = newPassword; // هنا يجب تحديث البيانات في Google Sheets
            alert(`تم تحديث كلمة المرور للمستخدم ${user.username}`);
        }
    };

    window.removeUser = function(id) {
        users = users.filter(user => user.id !== id);
        updateUserTable();
    };

    window.suspendUser = function(id) {
        const reason = prompt("اذكر السبب لإيقاف الحساب:");
        const duration = prompt("مدة الإيقاف (أيام):");
        if (reason && duration) {
            const user = users.find(user => user.id === id);
            user.status = "موقوف";
            user.reason = reason; // هنا يجب تحديث البيانات في Google Sheets
            updateUserTable();
        }
    };

    document.getElementById("add-exam-btn").addEventListener("click", () => {
        const userId = prompt("أدخل ID المستخدم:");
        const examName = prompt("اسم الامتحان:");
        const totalMarks = prompt("الدرجة الكلية:");
        const obtainedMarks = prompt("الدرجة المكتسبة:");

        if (userId && examName && totalMarks && obtainedMarks) {
            exams.push({ userId, examName, totalMarks, obtainedMarks });
            updateExamTable();
            // هنا يجب إضافة كود لتحديث Google Sheets
        }
    });

    function updateExamTable() {
        examTableBody.innerHTML = "";
        exams.forEach(exam => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${exam.userId}</td>
                <td>${exam.examName}</td>
                <td>${exam.totalMarks}</td>
                <td>${exam.obtainedMarks}</td>
                <td>
                    <button onclick="removeExam('${exam.userId}', '${exam.examName}')">حذف</button>
                </td>
            `;
            examTableBody.appendChild(row);
        });
    }

    window.removeExam = function(userId, examName) {
        exams = exams.filter(exam => !(exam.userId === userId && exam.examName === examName));
        updateExamTable();
    };

    function updateStatistics() {
        totalUsers.textContent = users.length;
        activeUsers.textContent = users.filter(user => user.status === "نشط").length;
        topUser.textContent = "ماجد"; // يمكن تحديثها بناءً على بياناتك
        avgScores.textContent = "34"; // يمكن تحديثها بناءً على بياناتك
    }

    fetchData();
});
