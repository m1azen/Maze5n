let examsData = {}; // حالة الامتحانات
let timer; // المؤقت
let currentExam = ""; // الامتحان الحالي
let timeLeft = 30 * 60; // 30 دقيقة

// تحميل حالة الامتحانات عند فتح الصفحة
function loadExams() {
  examsData = JSON.parse(localStorage.getItem("examsData")) || {}; // قراءة البيانات من التخزين
}

// فتح وإغلاق الشريط الجانبي
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const isHidden = sidebar.classList.contains("hidden");
  sidebar.classList.toggle("hidden", !isHidden);
}

// بدء امتحان محدد
function startExam(examName) {
  if (examsData[examName]) {
    alert("You have already taken this exam."); // رسالة إذا كان الامتحان مكتمل
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
      <input type="radio" name="q${index + 1}" value="${question.correctAnswer === 0 ? "correct" : "wrong"}"> ${question.options[0]}
      <input type="radio" name="q${index + 1}" value="${question.correctAnswer === 1 ? "correct" : "wrong"}"> ${question.options[1]}
      <input type="radio" name="q${index + 1}" value="${question.correctAnswer === 2 ? "correct" : "wrong"}"> ${question.options[2]}
    `;
    questionsContainer.appendChild(questionDiv);
  });

  startTimer();
}

// تعريف الأسئلة لكل امتحان
function getQuestionsForExam(examName) {
  const questionsPool = {
    "Exam 1": [
      { text: "What does HTML stand for?", options: ["HyperText Markup Language", "Hot Mail Text Links", "Home Tool Markup Language"], correctAnswer: 0 },
      { text: "What does CSS stand for?", options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets"], correctAnswer: 0 },
      { text: "What is 10 + 5?", options: ["15", "20", "10"], correctAnswer: 0 },
      { text: "What is 6 * 7?", options: ["42", "36", "30"], correctAnswer: 0 },
      { text: "What is 8 * 8?", options: ["64", "56", "48"], correctAnswer: 0 },
      { text: "What is 9 - 3?", options: ["6", "8", "4"], correctAnswer: 0 },
      { text: "What is 12 / 4?", options: ["3", "4", "5"], correctAnswer: 0 },
      { text: "What is 14 + 6?", options: ["20", "18", "22"], correctAnswer: 0 },
      { text: "What does JS stand for?", options: ["JavaScript", "JavaSyntax", "JustScript"], correctAnswer: 0 },
      { text: "Which tag is used for links?", options: ["<a>", "<link>", "<href>"], correctAnswer: 0 },
    ],
    // كرر الامتحانات حتى Exam 29 مع أسئلة مختلفة لكل امتحان
    "Exam 29": [
      { text: "What is 15 + 10?", options: ["25", "30", "20"], correctAnswer: 0 },
      { text: "What is 5 * 3?", options: ["15", "10", "20"], correctAnswer: 0 },
      { text: "What is 100 - 50?", options: ["50", "60", "40"], correctAnswer: 0 },
      { text: "What does API stand for?", options: ["Application Programming Interface", "Advanced Program Integration", "App Process Input"], correctAnswer: 0 },
      { text: "Which is used for styling?", options: ["CSS", "HTML", "JS"], correctAnswer: 0 },
      { text: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Logic", "Standard Query List"], correctAnswer: 0 },
      { text: "What is 8 / 2?", options: ["4", "3", "5"], correctAnswer: 0 },
      { text: "What is 18 - 6?", options: ["12", "10", "8"], correctAnswer: 0 },
      { text: "Which tag is used for images?", options: ["<img>", "<image>", "<picture>"], correctAnswer: 0 },
      { text: "What does DOM stand for?", options: ["Document Object Model", "Data Object Method", "Digital Output Model"], correctAnswer: 0 },
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
  const result = { exam: currentExam, score, percentage, date: new Date().toLocaleString() };
  examsData[currentExam] = result;
  localStorage.setItem("examsData", JSON.stringify(examsData));
  showResults(result);
}

// عرض النتائج مع البالونات
function showResults(result) {
  const balloonsContainer = document.getElementById("balloonsContainer");
  balloonsContainer.classList.remove("hidden");
  for (let i = 0; i < 50; i++) {
    const balloon = document.createElement("div");
    balloon.classList.add("balloon");
    balloon.style.left = Math.random() * 100 + "%";
    balloonsContainer.appendChild(balloon);
  }
  setTimeout(() => {
    balloonsContainer.innerHTML = ""; // تفريغ البالونات
    balloonsContainer.classList.add("hidden");
  }, 10000);
  alert(`Exam Submitted!\nScore: ${result.score}/10\nPercentage: ${result.percentage}%`);
  document.getElementById("examContainer").classList.add("hidden");
  document.getElementById("sidebar").classList.remove("hidden");
}

// تحميل الامتحانات عند بدء الصفحة
document.addEventListener("DOMContentLoaded", loadExams);
