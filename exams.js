const exams = [
    {
        id: 1,
        name: "امتحان 1",
        password: "2009",
        questions: [
            { question: "السؤال 1: ماذا تعني HTML؟", options: ["لغة البرمجة", "لغة وصفية", "نظام تشغيل", "قاعدة بيانات"], answer: 1 },
            { question: "السؤال 2: ما هو الغرض من CSS؟", options: ["إضافة تفاعلية", "تصميم المظهر", "إدارة البيانات", "تحليل البيانات"], answer: 1 },
            // أضف المزيد من الأسئلة هنا
        ]
    },
    {
        id: 2,
        name: "امتحان 2",
        password: "4444",
        questions: [
            { question: "السؤال 1: ماذا تعني JS؟", options: ["لغة البرمجة", "نظام تشغيل", "قاعدة بيانات", "برنامج تصميم"], answer: 0 },
            { question: "السؤال 2: ما هو DOM؟", options: ["نظام تشغيل", "هيكل البيانات", "نموذج كائن المستند", "لغة برمجة"], answer: 2 },
            // أضف المزيد من الأسئلة هنا
        ]
    },
    // أضف المزيد من الامتحانات هنا
];

document.addEventListener("DOMContentLoaded", () => {
    const examList = document.getElementById("examList");
    const gradesBody = document.getElementById("gradesBody");

    exams.forEach(exam => {
        const li = document.createElement("li");
        li.innerHTML = `<button onclick="attemptExam('${exam.name}', '${exam.password}', ${exam.id})">${exam.name}</button>`;
        examList.appendChild(li);
    });

    document.getElementById("openExamList").onclick = () => {
        document.getElementById("sidebar").classList.toggle("hidden");
    };

    loadGrades();
});

function loadGrades() {
    const gradesBody = document.getElementById("gradesBody");
    const grades = JSON.parse(localStorage.getItem("grades")) || [];

    grades.forEach(grade => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${grade.student}</td><td>${grade.exam}</td><td>${grade.score}</td><td>${grade.percentage}%</td>`;
        gradesBody.appendChild(row);
    });
}

function attemptExam(name, password, examId) {
    const userPassword = prompt(`أدخل كلمة مرور ${name}`);
    if (userPassword !== password) {
        alert("كلمة المرور غير صحيحة!");
        return;
    }

    const grades = JSON.parse(localStorage.getItem("grades")) || [];
    if (grades.find(grade => grade.exam === name)) {
        alert("لقد قمت بأداء هذا الامتحان بالفعل.");
        return;
    }

    startExam(examId);
}

function startExam(examId) {
    const exam = exams.find(e => e.id === examId);
    let score = 0;

    exam.questions.forEach((q, index) => {
        const userAnswer = prompt(`${q.question}\n${q.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`);
        if (parseInt(userAnswer) - 1 === q.answer) {
            score++;
        }
    });

    const percentage = (score / exam.questions.length) * 100;
    const studentName = "الطالب"; // يمكن استبدالها باسم الطالب الفعلي

    const grades = JSON.parse(localStorage.getItem("grades")) || [];
    grades.push({ student: studentName, exam: exam.name, score, percentage });
    localStorage.setItem("grades", JSON.stringify(grades));

    alert(`نتيجتك: ${score} من ${exam.questions.length} (${percentage.toFixed(2)}%)`);

    loadGrades();
}
