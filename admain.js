const SHEET_ID = "1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo";
const API_KEY = "AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0";

document.addEventListener("DOMContentLoaded", function() {
    const userTableBody = document.querySelector("#user-table tbody");
    const userCount = document.getElementById("user-count");
    const averageScore = document.getElementById("average-score");

    let users = []; // مصفوفة لتخزين بيانات المستخدمين

    // جلب البيانات من Google Sheets
    async function fetchData() {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`);
        const data = await response.json();
        populateUsers(data.values);
    }

    function populateUsers(data) {
        users = data.slice(1).map(row => {
            return {
                username: row[0],
                email: row[1],
                scores: row.slice(2).map((score, index) => ({ examName: `امتحان ${index + 1}`, score: Number(score) })).filter(score => !isNaN(score.score))
            };
        });
        updateUserTable();
    }

    // دالة لتحديث جدول المستخدمين
    function updateUserTable() {
        userTableBody.innerHTML = "";
        users.forEach((user, index) => {
            const row = document.createElement("tr");
            const scoresList = user.scores.map(score => `${score.examName}: ${score.score}`).join(', ') || 'لا توجد درجات';
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${scoresList}</td>
                <td>
                    <button onclick="removeUser(${index})">حذف</button>
                    <button onclick="addScore(${index})">إضافة درجة</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
        updateStatistics();
    }

    // دالة لإزالة مستخدم
    window.removeUser = function(index) {
        users.splice(index, 1);
        updateUserTable();
    };

    // دالة لإضافة درجة امتحان
    window.addScore = function(index) {
        const examName = prompt("اسم الامتحان:");
        const score = prompt("أدخل الدرجة:");

        if (examName && score) {
            users[index].scores.push({ examName, score: Number(score) });
            updateUserTable();
        }
    };

    // دالة لتحديث الإحصائيات
    function updateStatistics() {
        userCount.textContent = users.length;
        const totalScore = users.reduce((acc, user) => acc + user.scores.reduce((s, score) => s + score.score, 0), 0);
        const totalExams = users.reduce((acc, user) => acc + user.scores.length, 0);
        averageScore.textContent = totalExams ? (totalScore / totalExams).toFixed(2) : 0;
    }

    // استدعاء دالة جلب البيانات عند تحميل الصفحة
    fetchData();
});
