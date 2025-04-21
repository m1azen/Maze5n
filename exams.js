// تخزين البيانات
let examsData = {}; // تخزين حالة الامتحانات
let timer; // المؤقت
let currentExam = ""; // الامتحان الحالي
let timeLeft = 30 * 60; // 30 دقيقة

// تحميل حالة الامتحانات عند فتح الصفحة
function loadExams() {
  examsData = JSON.parse(localStorage.getItem("examsData")) || {};
}

// عرض قائمة الامتحانات وبدء امتحان محدد
function startExam(examName) {
  if (examsData[examName]) {
    alert("You have already taken this exam.");
    return;
  }

  currentExam = examName;
  document.getElementById("sidebar").classList.add("hidden");
  const examContainer = document.getElementById("examContainer");
  examContainer.classList.remove("hidden");

  document.getElementById("examTitle").textContent = examName;

  const questionsContainer = document.getElementById("questionsContainer");
  questionsContainer.innerHTML = ""; // تفريغ الأسئلة القديمة

  const examQuestions = getQuestionsForExam(examName);
  examQuestions.forEach((question, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.innerHTML = `
      <p>Question ${index + 1}: ${question.text}</p>
      <input type="radio" name="q${index + 1}" value="${question.correctAnswer}"> ${question.options[0]} <!-- الإجابة الصحيحة -->
      <input type="radio" name="q${index + 1}" value="${question.correctAnswer === "correct" ? "wrong" : "correct"}"> ${question.options[1]}
      <input type="radio" name="q${index + 1}" value="${question.correctAnswer === "correct" ? "wrong" : "correct"}"> ${question.options[2]}
    `;
    questionsContainer.appendChild(questionDiv);
  });

  startTimer();
}

// تعريف الأسئلة لكل امتحان
function getQuestionsForExam(examName) {
  const questionsPool = {
    "Exam 1": [
      { text: "What is 10 + 5?", options: ["15", "20", "10"], correctAnswer: "15" }, // الإجابة الصحيحة: الخيار الأول
      { text: "What is 6 * 7?", options: ["42", "36", "30"], correctAnswer: "42" }, // الإجابة الصحيحة: الخيار الأول
      // أضف باقي الأسئلة
    ],
    "Exam 2": [
      { text: "What is 8 * 8?", options: ["64", "56", "48"], correctAnswer: "64" }, // الإجابة الصحيحة: الخيار الأول
      { text: "What is 9 - 3?", options: ["6", "8", "4"], correctAnswer: "6" }, // الإجابة الصحيحة: الخيار الأول
      // أضف باقي الأسئلة
    ],
    "Exam 20": [
      { text: "What is 12 / 4?", options: ["3", "4", "5"], correctAnswer: "3" }, // الإجابة الصحيحة: الخيار الأول
      { text: "What is 14 + 6?", options: ["20", "18", "22"], correctAnswer: "20" }, // الإجابة الصحيحة: الخيار الأول
      // أضف باقي الأسئلة
    ],
  };

  return questionsPool[examName];
}

// بدء العداد الزمني
function startTimer() {
  const timerElement = document.getElementById("timeLeft");

  timer = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      submitExam();
    }

    timeLeft--;
  }, 1000);
}

// تسليم الامتحان
function submitExam() {
  clearInterval(timer);

  const questionsContainer = document.getElementById("questionsContainer");
  const answers = questionsContainer.querySelectorAll("input[type='radio']:checked");

  let score = 0;
  answers.forEach((answer) => {
    if (answer.value === "correct") {
      score++;
    }
  });

  const percentage = ((score / 10) * 100).toFixed(2);
  const result = {
    exam: currentExam,
    score: score,
    percentage: percentage,
    totalQuestions: 10,
    date: new Date().toLocaleString(),
  };

  // حفظ النتائج
  examsData[currentExam] = result;
  localStorage.setItem("examsData", JSON.stringify(examsData));

  showResults(result);
}

// عرض النتائج
function showResults(result) {
  alert(`Exam Submitted!\nScore: ${result.score}/10\nPercentage: ${result.percentage}%`);
  document.getElementById("examContainer").classList.add("hidden");
  document.getElementById("sidebar").classList.remove("hidden");
}

// تحميل الامتحانات عند بدء الصفحة
document.addEventListener("DOMContentLoaded", loadExams);
