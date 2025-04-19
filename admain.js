const SHEET_ID = "1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo";
const API_KEY = "AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0";

document.addEventListener("DOMContentLoaded", function() {
    const userTableBody = document.querySelector("#user-table tbody");
    const examTableBody = document.querySelector("#exam-table tbody");
    const totalUsers = document.getElementById("total-users");
    const activeUsers = document.getElementById("active-users");
    const topUser = document.getElementById("top-user");
    const topUserScore = document.getElementById("top-user-score");
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
            password: row[3],
            status: row[4],
            reason: row[5]
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
                <td>${user.password}</td>
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

    window.editUser = async function(id) {
        const user = users.find(user => user.id === id);
        const newPassword = prompt("أدخل كلمة المرور الجديدة:", user.password);
        const newEmail = prompt("أدخل البريد الإلكتروني الجديد:", user.email);
        if (newPassword) {
            user.password = newPassword; // تحديث كلمة المرور في المصفوفة
        }
        if (newEmail) {
            user.email = newEmail; // تحديث البريد الإلكتروني في المصفوفة
        }
        await updateGoogleSheet(); // تحديث Google Sheets
        alert(`تم تحديث معلومات المستخدم ${user.username}`);
    };

    window.removeUser = async function(id) {
        users = users.filter(user => user.id !== id);
