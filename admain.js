const SHEET_ID = "1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo";
const API_KEY = "AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0";

document.addEventListener("DOMContentLoaded", function() {
    const userTableBody = document.querySelector("#user-table tbody");
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
                id: row[0],
                username: row[1],
                email: row[2],
                password: row[3],
                status: row[4],
                reason: row[5],
                examName: row[6],
                totalMarks: row[7],
                obtainedMarks: row[8],
                message: row[9]
            };
        });
        updateUserTable();
        updateStatistics();
    }

    // دالة لتحديث جدول المستخدمين
    function updateUserTable() {
        userTableBody.innerHTML = "";
        users.forEach((user, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.password}</td>
                <td>${user.status}</td>
                <td>${user.reason}</td>
                <td>${user.examName}</td>
                <td>${user.totalMarks}</td>
                <td>${user.obtainedMarks}</td>
                <td>${user.message}</td>
                <td>
                    <button onclick="editUser(${index})">تعديل</button>
                    <button onclick="removeUser(${index})">حذف</button>
                    <button onclick="suspendUser(${index})">إيقاف</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    }

    // دالة لتعديل المستخدم
    window.editUser = function(index) {
        const user = users[index];
        const newUsername = prompt("أدخل اسم المستخدم:", user.username);
        const newEmail = prompt("أدخل البريد الإلكتروني:", user.email);
        const newPassword = prompt("أدخل كلمة المرور:", user.password);
        const newStatus = prompt("أدخل الحالة:", user.status);
        const newReason = prompt("أدخل السبب:", user.reason);
        
        if (newUsername && newEmail && newPassword) {
            user.username = newUsername;
            user.email = newEmail;
            user.password = newPassword;
            user.status = newStatus;
            user.reason = newReason;
            updateUserTable();
            // هنا يمكنك إضافة كود لتحديث البيانات في Google Sheets
        }
    };

    // دالة لإزالة مستخدم
    window.removeUser = function(index) {
        users.splice(index, 1);
        updateUserTable();
    };

    // دالة لإيقاف مستخدم
    window.suspendUser = function(index) {
        const reason = prompt("اذكر السبب لإيقاف الحساب:");
        const duration = prompt("مدة الإيقاف (أيام):");
        if (reason && duration) {
            users[index].status = "موقوف";
            users[index].reason = reason;
            // يمكنك إضافة كود لتحديد مدة الإيقاف
            updateUserTable();
        }
    };

    // تحديث الإحصائيات
    function updateStatistics() {
        const totalUsers = users.length;
        const activeUsers = users.filter(user => user.status !== "موقوف").length;
        const suspendedUsers = totalUsers - activeUsers;
        renderCharts(totalUsers, activeUsers, suspendedUsers);
    }

    // إعداد الرسوم البيانية
    function renderCharts(totalUsers, activeUsers, suspendedUsers) {
        const ctx1 = document.getElementById('user-status-chart').getContext('2d');
        const userStatusChart = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: ['نشط', 'موقوف'],
                datasets: [{
                    label: 'حالة المستخدمين',
                    data: [activeUsers, suspendedUsers],
                    backgroundColor: ['#36a2eb', '#ff6384'],
                }]
            },
            options: {
                responsive: true,
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });

        // يمكنك إضافة المزيد من الرسوم البيانية للدرجات
        const ctx2 = document.getElementById('exam-scores-chart').getContext('2d');
        const examScoresChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: users.map(user => user.username),
                datasets: [{
                    label: 'الدرجات المكتسبة',
                    data: users.map(user => user.obtainedMarks),
                    backgroundColor: '#5cb85c',
                }]
            },
            options: {
                responsive: true,
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    // استدعاء دالة جلب البيانات عند تحميل الصفحة
    fetchData();
});
