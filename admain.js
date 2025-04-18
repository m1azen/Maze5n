const SHEET_ID = "1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo";
const API_KEY = "AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0";
const EXAMS_STORAGE_KEY = "examsData";
const USERS_BACKUP_KEY = "backupUsers";

document.addEventListener("DOMContentLoaded", function() {
    const userTableBody = document.querySelector("#user-table tbody");
    const examTableBody = document.querySelector("#exam-table tbody");
    const totalUsers = document.getElementById("total-users");
    const activeUsers = document.getElementById("active-users");
    const topUser = document.getElementById("top-user");
    const topUserScore = document.getElementById("top-user-score");
    const avgScores = document.getElementById("avg-scores");

    let users = [];
    let exams = [];

    // ========== localStorage Functions ========== //
    function loadExamsFromStorage() {
        const savedExams = localStorage.getItem(EXAMS_STORAGE_KEY);
        if (savedExams) {
            exams = JSON.parse(savedExams);
            updateExamTable();
            updateStatistics();
        }
    }

    function saveExamsToStorage() {
        localStorage.setItem(EXAMS_STORAGE_KEY, JSON.stringify(exams));
    }

    function backupUsersData() {
        localStorage.setItem(USERS_BACKUP_KEY, JSON.stringify(users));
    }

    function loadUsersFromBackup() {
        const backup = localStorage.getItem(USERS_BACKUP_KEY);
        if (backup) {
            users = JSON.parse(backup);
            updateUserTable();
            updateStatistics();
            return true;
        }
        return false;
    }

    // ========== Google Sheets Functions ========== //
    async function fetchUsersFromSheets() {
        try {
            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Users!A:F?key=${API_KEY}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (!data.values) throw new Error("No data found in sheet");
            
            return data.values;
        } catch (error) {
            console.error("Failed to fetch from Google Sheets:", error);
            throw error;
        }
    }

    async function updateGoogleSheet() {
        try {
            const values = [
                ["ID", "Username", "Email", "Password", "Status", "Reason"],
                ...users.map(user => [user.id, user.username, user.email, user.password, user.status, user.reason])
            ];
            
            const response = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Users!A1:F?valueInputOption=USER_ENTERED&key=${API_KEY}`, 
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        range: "Users!A1:F" + (users.length + 1),
                        majorDimension: "ROWS",
                        values: values
                    })
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || "Failed to update sheet");
            }

            backupUsersData();
            return true;
        } catch (error) {
            console.error("Error updating Google Sheet:", error);
            alert(`فشل التحديث في Google Sheets: ${error.message}`);
            return false;
        }
    }

    // ========== Data Management ========== //
    function populateUsers(data) {
        if (!data || !data.length) {
            if (!loadUsersFromBackup()) {
                alert("لا توجد بيانات متاحة");
                return;
            }
            return;
        }

        users = data.slice(1).map(row => ({
            id: row[0],
            username: row[1],
            email: row[2],
            password: row[3],
            status: row[4],
            reason: row[5]
        }));
        
        backupUsersData();
        updateUserTable();
        updateStatistics();
    }

    // ========== UI Update Functions ========== //
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
                <td>${user.reason || '-'}</td>
                <td>
                    <button class="btn-edit" onclick="editUser('${user.id}')">تعديل</button>
                    <button class="btn-delete" onclick="removeUser('${user.id}')">حذف</button>
                    <button class="btn-suspend" onclick="suspendUser('${user.id}')">إيقاف</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    }

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
                    <button class="btn-delete" onclick="removeExam('${exam.userId}', '${exam.examName}')">حذف</button>
                </td>
            `;
            examTableBody.appendChild(row);
        });
        updateStatistics();
    }

    function updateStatistics() {
        totalUsers.textContent = users.length;
        activeUsers.textContent = users.filter(u => u.status === "نشط").length;

        // حساب الإحصائيات
        if (exams.length > 0) {
            const scores = exams.reduce((acc, exam) => acc + parseFloat(exam.obtainedMarks), 0);
            avgScores.textContent = (scores / exams.length).toFixed(2);

            const userScores = {};
            exams.forEach(exam => {
                userScores[exam.userId] = (userScores[exam.userId] || 0) + parseFloat(exam.obtainedMarks);
            });

            const [topUserId, topScore] = Object.entries(userScores).reduce(
                (max, entry) => entry[1] > max[1] ? entry : max, 
                ["", -Infinity]
            );

            const topUserObj = users.find(u => u.id === topUserId);
            topUser.textContent = topUserObj ? topUserObj.username : "N/A";
            topUserScore.textContent = topScore.toFixed(2);
        } else {
            avgScores.textContent = "0.00";
            topUser.textContent = "N/A";
            topUserScore.textContent = "0.00";
        }
    }

    // ========== User Actions ========== //
    window.editUser = async function(id) {
        const user = users.find(u => u.id === id);
        if (!user) return;

        const newPassword = prompt("كلمة المرور الجديدة:", user.password);
        if (newPassword === null || newPassword === user.password) return;

        user.password = newPassword;
        if (await updateGoogleSheet()) {
            alert("تم تحديث كلمة المرور بنجاح");
            updateUserTable();
        }
    };

    window.removeUser = async function(id) {
        if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
        
        users = users.filter(u => u.id !== id);
        if (await updateGoogleSheet()) {
            updateStatistics();
        }
    };

    window.suspendUser = async function(id) {
        const user = users.find(u => u.id === id);
        if (!user) return;

        const reason = prompt("سبب الإيقاف:");
        if (!reason) return;

        const duration = prompt("المدة (أيام):");
        if (!duration) return;

        user.status = "موقوف";
        user.reason = `سبب: ${reason} (لمدة ${duration} يوم)`;
        
        if (await updateGoogleSheet()) {
            alert("تم إيقاف المستخدم بنجاح");
            updateUserTable();
        }
    };

    // ========== Exam Actions ========== //
    document.getElementById("add-exam-btn").addEventListener("click", () => {
        const userId = prompt("ID المستخدم:");
        if (!userId) return;

        const examName = prompt("اسم الامتحان:");
        if (!examName) return;

        const totalMarks = parseFloat(prompt("الدرجة الكلية:"));
        if (isNaN(totalMarks)) return;

        const obtainedMarks = parseFloat(prompt("الدرجة المكتسبة:"));
        if (isNaN(obtainedMarks)) return;

        exams.push({ userId, examName, totalMarks, obtainedMarks });
        saveExamsToStorage();
        updateExamTable();
    });

    window.removeExam = function(userId, examName) {
        if (!confirm("هل تريد حذف هذا الامتحان؟")) return;
        
        exams = exams.filter(e => !(e.userId === userId && e.examName === examName));
        saveExamsToStorage();
        updateExamTable();
    };

    // ========== Initialize ========== //
    async function initialize() {
        try {
            const usersData = await fetchUsersFromSheets();
            populateUsers(usersData);
            loadExamsFromStorage();
        } catch (error) {
            console.error("Initialization error:", error);
            if (loadUsersFromBackup()) {
                alert("جارٍ استخدام بيانات محفوظة مسبقًا بسبب مشكلة في الاتصال");
            } else {
                alert("فشل تحميل البيانات. يرجى التحقق من اتصال الإنترنت");
            }
        }
    }

    initialize();
});
