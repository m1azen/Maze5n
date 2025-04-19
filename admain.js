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
    let exams = JSON.parse(localStorage.getItem('exams')) || []; // استرجاع درجات الامتحانات من localStorage

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
        await updateGoogleSheet(); // تحديث Google Sheets بعد الحذف
        updateUserTable();
    };

    window.suspendUser = async function(id) {
        const reason = prompt("اذكر السبب لإيقاف الحساب:");
        if (reason) {
            const user = users.find(user => user.id === id);
            user.status = "موقوف";
            user.reason = reason; // تحديث السبب في المصفوفة
            await updateGoogleSheet(); // تحديث Google Sheets
            updateUserTable();
        }
    };

    document.getElementById("add-exam-btn").addEventListener("click", async () => {
        const userId = prompt("أدخل ID المستخدم:");
        const examName = prompt("اسم الامتحان:");
        const totalMarks = prompt("الدرجة الكلية:");
        const obtainedMarks = prompt("الدرجة المكتسبة:");

        if (userId && examName && totalMarks && obtainedMarks) {
            const exam = { userId, examName, totalMarks, obtainedMarks };
            exams.push(exam);
            localStorage.setItem('exams', JSON.stringify(exams)); // حفظ الدرجات في localStorage
            await updateExamTable();
        }
    });

    async function updateExamTable() {
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
        localStorage.setItem('exams', JSON.stringify(exams)); // تحديث localStorage بعد الحذف
        updateExamTable();
    };

    function updateStatistics() {
        totalUsers.textContent = users.length;
        activeUsers.textContent = users.filter(user => user.status === "نشط").length;

        const totalScores = exams.reduce((acc, exam) => acc + Number(exam.obtainedMarks), 0);
        const averageScore = totalScores / exams.length || 0;
        avgScores.textContent = averageScore.toFixed(2);

        const topScorer = exams.reduce((acc, exam) => {
            const userExamScores = exams.filter(e => e.userId === exam.userId);
            const userTotalScore = userExamScores.reduce((sum, e) => sum + Number(e.obtainedMarks), 0);
            if (userTotalScore > acc.score) {
                return { username: exam.userId, score: userTotalScore };
            }
            return acc;
        }, { username: "لا يوجد", score: 0 });

        topUser.textContent = topScorer.username;
        topUserScore.textContent = (topScorer.score / (userExamScores.length * 100) * 100).toFixed(2) + "%";
    }

    async function updateGoogleSheet() {
        const values = users.map(user => [user.id, user.username, user.email, user.password, user.status, user.reason]);
        const body = {
            "values": values
        };
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A2:F?valueInputOption=RAW&key=${API_KEY}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
    }

    fetchData();
    updateExamTable(); // تحديث جدول الدرجات عند تحميل الصفحة
});
