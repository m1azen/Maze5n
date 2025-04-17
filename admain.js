const SHEET_ID = "1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo";
const API_KEY = "AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0";

document.addEventListener("DOMContentLoaded", function() {
    const userTableBody = document.querySelector("#user-table tbody");
    const totalUsers = document.getElementById("total-users");
    const activeUsers = document.getElementById("active-users");
    const topUser = document.getElementById("top-user");
    const avgScores = document.getElementById("avg-scores");
    
    let users = []; // مصفوفة لتخزين بيانات المستخدمين

    async function fetchData() {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`);
        const data = await response.json();
        populateUsers(data.values);
    }

    function populateUsers(data) {
        users = data.slice(1).map(row => ({
            username: row[0],
            email: row[1],
            status: row[2],
        }));
        updateUserTable();
        updateStatistics();
    }

    function updateUserTable() {
        userTableBody.innerHTML = "";
        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.status}</td>
                <td>
                    <button onclick="editUser('${user.username}')">تعديل</button>
                    <button onclick="removeUser('${user.username}')">حذف</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    }

    window.editUser = function(username) {
        alert(`تعديل بيانات المستخدم: ${username}`);
        // هنا يمكنك إضافة كود لتعديل البيانات
    };

    window.removeUser = function(username) {
        alert(`حذف المستخدم: ${username}`);
        // هنا يمكنك إضافة كود لحذف المستخدم
    };

    function updateStatistics() {
        totalUsers.textContent = users.length;
        activeUsers.textContent = users.filter(user => user.status === "نشط").length;
        topUser.textContent = "ماجد"; // يمكن تحديثها بناءً على بياناتك
        avgScores.textContent = "34"; // يمكن تحديثها بناءً على بياناتك
    }

    fetchData();
});
