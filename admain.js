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

    let users = [];
    let exams = [];

    async function fetchData() {
        try {
            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`);
            const data = await response.json();
            populateUsers(data.values);
            
            // جلب بيانات الامتحانات
            const examsResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet2?key=${API_KEY}`);
            const examsData = await examsResponse.json();
            if (examsData.values) {
                exams = examsData.values.slice(1).map(row => ({
                    userId: row[0],
                    examName: row[1],
                    totalMarks: row[2],
                    obtainedMarks: row[3]
                }));
                updateExamTable();
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("حدث خطأ أثناء جلب البيانات");
        }
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
                <td>${user.reason || ''}</td>
                <td>
                    <button onclick="editUser('${user.id}')">تعديل</button>
                    <button onclick="removeUser('${user.id}')">حذف</button>
                    <button onclick="suspendUser('${user.id}')">إيقاف</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    }

    async function updateGoogleSheet() {
        try {
            const values = [
                ["ID", "Username", "Email", "Password", "Status", "Reason"],
                ...users.map(user => [user.id, user.username, user.email, user.password, user.status, user.reason])
            ];
            
            const response = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?valueInputOption=USER_ENTERED&key=${API_KEY}`, 
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        range: "Sheet1!A1:F" + (users.length + 1),
                        majorDimension: "ROWS",
                        values: values
                    })
                }
            );

            if (!response.ok) {
                const error = await response.json();
                console.error("Error updating sheet:", error);
                alert("حدث خطأ أثناء التحديث: " + (error.error?.message || "Unknown error"));
                return false;
            }
            
            console.log("تم تحديث البيانات بنجاح");
            return true;
        } catch (error) {
            console.error("Error:", error);
            alert("حدث خطأ غير متوقع: " + error.message);
            return false;
        }
    }

    async function updateGoogleSheetExams() {
        try {
            const values = [
                ["User ID", "Exam Name", "Total Marks", "Obtained Marks"],
                ...exams.map(exam => [exam.userId, exam.examName, exam.totalMarks, exam.obtainedMarks])
            ];
            
            const response = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet2?valueInputOption=USER_ENTERED&key=${API_KEY}`, 
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        range: "Sheet2!A1:D" + (exams.length + 1),
                        majorDimension: "ROWS",
                        values: values
                    })
                }
            );

            if (!response.ok) {
                const error = await response.json();
                console.error("Error updating exams sheet:", error);
                return false;
            }
            
            console.log("تم تحديث بيانات الامتحانات بنجاح");
            return true;
        } catch (error) {
            console.error("Error:", error);
            return false;
        }
    }

    window.editUser = async function(id) {
        const user = users.find(user => user.id === id);
        const newPassword = prompt("أدخل كلمة المرور الجديدة:", user.password);
        if (newPassword) {
            user.password = newPassword;
            const success = await updateGoogleSheet();
            if (success) {
                alert(`تم تحديث كلمة المرور للمستخدم ${user.username}`);
                updateUserTable();
            }
        }
    };

    window.removeUser = async function(id) {
        if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
            users = users.filter(user => user.id !== id);
            const success = await updateGoogleSheet();
            if (success) {
                updateUserTable();
                updateStatistics();
            }
        }
    };

    window.suspendUser = async function(id) {
        const reason = prompt("اذكر السبب لإيقاف الحساب:");
        const duration = prompt("مدة الإيقاف (أيام):");
        if (reason && duration) {
            const user = users.find(user => user.id === id);
            user.status = "موقوف";
            user.reason = `${reason} (لمدة ${duration} أيام)`;
            const success = await updateGoogleSheet();
            if (success) {
                updateUserTable();
            }
        }
    };

    document.getElementById("add-exam-btn").addEventListener("click", async () => {
        const userId = prompt("أدخل ID المستخدم:");
        const examName = prompt("اسم الامتحان:");
        const totalMarks = prompt("الدرجة الكلية:");
        const obtainedMarks = prompt("الدرجة المكتسبة:");

        if (userId && examName && totalMarks && obtainedMarks) {
            exams.push({ 
                userId, 
                examName, 
                totalMarks, 
                obtainedMarks 
            });
            const success = await updateGoogleSheetExams();
            if (success) {
                updateExamTable();
                updateStatistics();
            }
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

    window.removeExam = async function(userId, examName) {
        if (confirm("هل أنت متأكد من حذف هذا الامتحان؟")) {
            exams = exams.filter(exam => !(exam.userId === userId && exam.examName === examName));
            const success = await updateGoogleSheetExams();
            if (success) {
                updateExamTable();
                updateStatistics();
            }
        }
    };

    function updateStatistics() {
        totalUsers.textContent = users.length;
        activeUsers.textContent = users.filter(user => user.status === "نشط").length;

        const totalScores = exams.reduce((acc, exam) => acc + Number(exam.obtainedMarks), 0);
        const averageScore = exams.length > 0 ? (totalScores / exams.length).toFixed(2) : "0.00";
        avgScores.textContent = averageScore;

        if (exams.length > 0) {
            const userScores = {};
            exams.forEach(exam => {
                if (!userScores[exam.userId]) {
                    userScores[exam.userId] = 0;
                }
                userScores[exam.userId] += Number(exam.obtainedMarks);
            });

            let topUserId = "";
            let topScore = 0;
            for (const [userId, score] of Object.entries(userScores)) {
                if (score > topScore) {
                    topScore = score;
                    topUserId = userId;
                }
            }

            const user = users.find(u => u.id === topUserId);
            topUser.textContent = user ? user.username : "غير معروف";
            topUserScore.textContent = topScore;
        } else {
            topUser.textContent = "لا يوجد";
            topUserScore.textContent = "0";
        }
    }

    fetchData();
});
