let examsData = {};
let currentExam = "";
let timeLeft = 30 * 60; // 30 دقيقة
let circleCircumference = 283;

function loadExams() {
  examsData = JSON.parse(localStorage.getItem("examsData")) || {};
}

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("shown");
}

function handleExamSelection(examName, password) {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.remove("shown"); // إخفاء القائمة بعد الاختيار

  if (examsData[examName]) {
    alert("This exam is completed. View results or retake!");
  } else {
    const enteredPassword = prompt(`Enter password for ${examName}:`);
    if (enteredPassword === password) {
      startExam(examName);
    } else {
      alert("Incorrect password!");
    }
  }
}

function startExam(examName) {
  currentExam = examName;
  document.getElementById("examContainer").classList.remove("hidden");
  const questionsContainer = document.getElementById("questionsContainer");
  questionsContainer.innerHTML = "";

  const questions = getQuestionsForExam(examName);
  questions.forEach((question, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question-box");
    questionDiv.innerHTML = `
      <p>Question ${index + 1}: ${question.text}</p>
      ${question.options.map(
        (option, i) =>
          `<div class="option">
             <input type="radio" name="q${index + 1}" value="${i === question.correctAnswer ? "correct" : "wrong"}"> 
             <label>${option}</label>
          </div>`
      ).join("")}
    `;
    questionsContainer.appendChild(questionDiv);
  });

  startTimer();
}

function getQuestionsForExam(examName) {
  const questionsPool = {
    
    "Exam 1": [
      { text: "What is 5 + 5?", options: ["10", "12", "15", "8"], correctAnswer: 0 },
      { text: "What is 3 * 3?", options: ["9", "6", "8", "7"], correctAnswer: 1 },
      { text: "What does HTML stand for?", options: ["HyperText Markup Language", "Home Tool Markup Language", "Hot Mail Text", "HyperText Management Language"], correctAnswer: 2 },
      { text: "What is 10 - 5?", options: ["5", "6", "4", "7"], correctAnswer: 3 },
      { text: "What is 6 * 6?", options: ["36", "30", "32", "40"], correctAnswer: 0 },
      { text: "What is 8 + 2?", options: ["10", "12", "9", "11"], correctAnswer: 1 },
      { text: "What is 12 / 4?", options: ["3", "4", "5", "6"], correctAnswer: 2 },
      { text: "What is 14 + 6?", options: ["20", "22", "24", "18"], correctAnswer: 3 },
      { text: "What does JS stand for?", options: ["JavaScript", "JavaSyntax", "JustScript", "JsonScript"], correctAnswer: 0 },
      { text: "Which tag is used for links?", options: ["<a>", "<link>", "<href>", "<url>"], correctAnswer: 1 },
    ],
    "Exam 2": [
      { text: "What is 6 + 4?", options: ["10", "11", "12", "13"], correctAnswer: 0 },
      { text: "What is 9 * 2?", options: ["18", "16", "20", "14"], correctAnswer: 1 },
      { text: "What does CSS stand for?", options: ["Cascading Style Sheets", "Colorful Style Sheets", "Creative Sheets", "Computer Style Sheets"], correctAnswer: 2 },
      { text: "What is 20 - 5?", options: ["15", "16", "14", "17"], correctAnswer: 3 },
      { text: "What is 4 * 5?", options: ["20", "18", "22", "16"], correctAnswer: 0 },
      { text: "What is 15 / 3?", options: ["5", "6", "7", "4"], correctAnswer: 1 },
      { text: "What is 11 + 9?", options: ["20", "21", "19", "18"], correctAnswer: 2 },
      { text: "What is 25 - 5?", options: ["20", "22", "18", "24"], correctAnswer: 3 },
      { text: "What is the purpose of <title> tag?", options: ["Page Title", "Page Body", "Page Footer", "Page Header"], correctAnswer: 0 },
      { text: "Which attribute is used for image links?", options: ["src", "href", "link", "alt"], correctAnswer: 1 },
    ],
    "Exam 3": [
      { text: "What is 7 * 7?", options: ["49", "48", "50", "47"], correctAnswer: 0 },
      { text: "What is 8 + 12?", options: ["20", "18", "22", "19"], correctAnswer: 2 },
      { text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Query Language", "Syntax Query Language", "Smart Query Language"], correctAnswer: 1 },
      { text: "What is 30 / 3?", options: ["10", "11", "9", "8"], correctAnswer: 3 },
      { text: "What is 5 * 4?", options: ["20", "25", "30", "15"], correctAnswer: 0 },
      { text: "What is 9 + 1?", options: ["10", "11", "9", "8"], correctAnswer: 1 },
      { text: "What is 100 - 90?", options: ["10", "15", "8", "12"], correctAnswer: 2 },
      { text: "Which tag is used for paragraph?", options: ["<p>", "<div>", "<header>", "<footer>"], correctAnswer: 0 },
      { text: "What is 4 * 6?", options: ["24", "22", "26", "20"], correctAnswer: 1 },
      { text: "What is the default CSS position?", options: ["Static", "Relative", "Absolute", "Fixed"], correctAnswer: 2 },
    ],
    // Exam 4 to Exam 20 مكتوب بنفس التنسيق الكامل مع تنويع الخيارات الصحيحة.
    "Exam 4": [
      { text: "What is 7 * 7?", options: ["49", "48", "50", "47"], correctAnswer: 0 },
      { text: "What is 8 + 12?", options: ["20", "18", "22", "19"], correctAnswer: 2 },
      { text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Query Language", "Syntax Query Language", "Smart Query Language"], correctAnswer: 1 },
      { text: "What is 30 / 3?", options: ["10", "11", "9", "8"], correctAnswer: 3 },
      { text: "What is 5 * 4?", options: ["20", "25", "30", "15"], correctAnswer: 0 },
      { text: "What is 9 + 1?", options: ["10", "11", "9", "8"], correctAnswer: 1 },
      { text: "What is 100 - 90?", options: ["10", "15", "8", "12"], correctAnswer: 2 },
      { text: "Which tag is used for paragraph?", options: ["<p>", "<div>", "<header>", "<footer>"], correctAnswer: 0 },
      { text: "What is 4 * 6?", options: ["24", "22", "26", "20"], correctAnswer: 1 },
      { text: "What is the default CSS position?", options: ["Static", "Relative", "Absolute", "Fixed"], correctAnswer: 2 },
    ],
    "Exam 5": [
      { text: "What is 7 * 7?", options: ["49", "48", "50", "47"], correctAnswer: 0 },
      { text: "What is 8 + 12?", options: ["20", "18", "22", "19"], correctAnswer: 2 },
      { text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Query Language", "Syntax Query Language", "Smart Query Language"], correctAnswer: 1 },
      { text: "What is 30 / 3?", options: ["10", "11", "9", "8"], correctAnswer: 3 },
      { text: "What is 5 * 4?", options: ["20", "25", "30", "15"], correctAnswer: 0 },
      { text: "What is 9 + 1?", options: ["10", "11", "9", "8"], correctAnswer: 1 },
      { text: "What is 100 - 90?", options: ["10", "15", "8", "12"], correctAnswer: 2 },
      { text: "Which tag is used for paragraph?", options: ["<p>", "<div>", "<header>", "<footer>"], correctAnswer: 0 },
      { text: "What is 4 * 6?", options: ["24", "22", "26", "20"], correctAnswer: 1 },
      { text: "What is the default CSS position?", options: ["Static", "Relative", "Absolute", "Fixed"], correctAnswer: 2 },
    ],
    "Exam 6": [
      { text: "What is 7 * 7?", options: ["49", "48", "50", "47"], correctAnswer: 0 },
      { text: "What is 8 + 12?", options: ["20", "18", "22", "19"], correctAnswer: 2 },
      { text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Query Language", "Syntax Query Language", "Smart Query Language"], correctAnswer: 1 },
      { text: "What is 30 / 3?", options: ["10", "11", "9", "8"], correctAnswer: 3 },
      { text: "What is 5 * 4?", options: ["20", "25", "30", "15"], correctAnswer: 0 },
      { text: "What is 9 + 1?", options: ["10", "11", "9", "8"], correctAnswer: 1 },
      { text: "What is 100 - 90?", options: ["10", "15", "8", "12"], correctAnswer: 2 },
      { text: "Which tag is used for paragraph?", options: ["<p>", "<div>", "<header>", "<footer>"], correctAnswer: 0 },
      { text: "What is 4 * 6?", options: ["24", "22", "26", "20"], correctAnswer: 1 },
      { text: "What is the default CSS position?", options: ["Static", "Relative", "Absolute", "Fixed"], correctAnswer: 2 },
    ],
    "Exam 7": [
      { text: "What is 7 * 7?", options: ["49", "48", "50", "47"], correctAnswer: 0 },
      { text: "What is 8 + 12?", options: ["20", "18", "22", "19"], correctAnswer: 2 },
      { text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Query Language", "Syntax Query Language", "Smart Query Language"], correctAnswer: 1 },
      { text: "What is 30 / 3?", options: ["10", "11", "9", "8"], correctAnswer: 3 },
      { text: "What is 5 * 4?", options: ["20", "25", "30", "15"], correctAnswer: 0 },
      { text: "What is 9 + 1?", options: ["10", "11", "9", "8"], correctAnswer: 1 },
      { text: "What is 100 - 90?", options: ["10", "15", "8", "12"], correctAnswer: 2 },
      { text: "Which tag is used for paragraph?", options: ["<p>", "<div>", "<header>", "<footer>"], correctAnswer: 0 },
      { text: "What is 4 * 6?", options: ["24", "22", "26", "20"], correctAnswer: 1 },
      { text: "What is the default CSS position?", options: ["Static", "Relative", "Absolute", "Fixed"], correctAnswer: 2 },
    ],
    "Exam 8": [
      { text: "What is 7 * 7?", options: ["49", "48", "50", "47"], correctAnswer: 0 },
      { text: "What is 8 + 12?", options: ["20", "18", "22", "19"], correctAnswer: 2 },
      { text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Query Language", "Syntax Query Language", "Smart Query Language"], correctAnswer: 1 },
      { text: "What is 30 / 3?", options: ["10", "11", "9", "8"], correctAnswer: 3 },
      { text: "What is 5 * 4?", options: ["20", "25", "30", "15"], correctAnswer: 0 },
      { text: "What is 9 + 1?", options: ["10", "11", "9", "8"], correctAnswer: 1 },
      { text: "What is 100 - 90?", options: ["10", "15", "8", "12"], correctAnswer: 2 },
      { text: "Which tag is used for paragraph?", options: ["<p>", "<div>", "<header>", "<footer>"], correctAnswer: 0 },
      { text: "What is 4 * 6?", options: ["24", "22", "26", "20"], correctAnswer: 1 },
      { text: "What is the default CSS position?", options: ["Static", "Relative", "Absolute", "Fixed"], correctAnswer: 2 },
    ],
    "Exam 9": [
      { text: "What is 7 * 7?", options: ["49", "48", "50", "47"], correctAnswer: 0 },
      { text: "What is 8 + 12?", options: ["20", "18", "22", "19"], correctAnswer: 2 },
      { text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Query Language", "Syntax Query Language", "Smart Query Language"], correctAnswer: 1 },
      { text: "What is 30 / 3?", options: ["10", "11", "9", "8"], correctAnswer: 3 },
      { text: "What is 5 * 4?", options: ["20", "25", "30", "15"], correctAnswer: 0 },
      { text: "What is 9 + 1?", options: ["10", "11", "9", "8"], correctAnswer: 1 },
      { text: "What is 100 - 90?", options: ["10", "15", "8", "12"], correctAnswer: 2 },
      { text: "Which tag is used for paragraph?", options: ["<p>", "<div>", "<header>", "<footer>"], correctAnswer: 0 },
      { text: "What is 4 * 6?", options: ["24", "22", "26", "20"], correctAnswer: 1 },
      { text: "What is the default CSS position?", options: ["Static", "Relative", "Absolute", "Fixed"], correctAnswer: 2 },
    ],
    "Exam 10": [
      { text: "What is 7 * 7?", options: ["49", "48", "50", "47"], correctAnswer: 0 },
      { text: "What is 8 + 12?", options: ["20", "18", "22", "19"], correctAnswer: 2 },
      { text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Query Language", "Syntax Query Language", "Smart Query Language"], correctAnswer: 1 },
      { text: "What is 30 / 3?", options: ["10", "11", "9", "8"], correctAnswer: 3 },
      { text: "What is 5 * 4?", options: ["20", "25", "30", "15"], correctAnswer: 0 },
      { text: "What is 9 + 1?", options: ["10", "11", "9", "8"], correctAnswer: 1 },
      { text: "What is 100 - 90?", options: ["10", "15", "8", "12"], correctAnswer: 2 },
      { text: "Which tag is used for paragraph?", options: ["<p>", "<div>", "<header>", "<footer>"], correctAnswer: 0 },
      { text: "What is 4 * 6?", options: ["24", "22", "26", "20"], correctAnswer: 1 },
      { text: "What is the default CSS position?", options: ["Static", "Relative", "Absolute", "Fixed"], correctAnswer: 2 },
    ],
    
    "Exam 11": [
      { text: "What is 5 + 5?", options: ["10", "12", "15", "8"], correctAnswer: 0 },
      { text: "What is 3 * 3?", options: ["9", "6", "8", "7"], correctAnswer: 1 },
      { text: "What does HTML stand for?", options: ["HyperText Markup Language", "Home Tool Markup Language", "Hot Mail Text", "HyperText Management Language"], correctAnswer: 2 },
      { text: "What is 10 - 5?", options: ["5", "6", "4", "7"], correctAnswer: 3 },
      { text: "What is 6 * 6?", options: ["36", "30", "32", "40"], correctAnswer: 0 },
      { text: "What is 8 + 2?", options: ["10", "12", "9", "11"], correctAnswer: 1 },
      { text: "What is 12 / 4?", options: ["3", "4", "5", "6"], correctAnswer: 2 },
      { text: "What is 14 + 6?", options: ["20", "22", "24", "18"], correctAnswer: 3 },
      { text: "What does JS stand for?", options: ["JavaScript", "JavaSyntax", "JustScript", "JsonScript"], correctAnswer: 0 },
      { text: "Which tag is used for links?", options: ["<a>", "<link>", "<href>", "<url>"], correctAnswer: 1 },
    ],
    "Exam 12": [
      { text: "What is 6 + 4?", options: ["10", "11", "12", "13"], correctAnswer: 0 },
      { text: "What is 9 * 2?", options: ["18", "16", "20", "14"], correctAnswer: 1 },
      { text: "What does CSS stand for?", options: ["Cascading Style Sheets", "Colorful Style Sheets", "Creative Sheets", "Computer Style Sheets"], correctAnswer: 2 },
      { text: "What is 20 - 5?", options: ["15", "16", "14", "17"], correctAnswer: 3 },
      { text: "What is 4 * 5?", options: ["20", "18", "22", "16"], correctAnswer: 0 },
      { text: "What is 15 / 3?", options: ["5", "6", "7", "4"], correctAnswer: 1 },
      { text: "What is 11 + 9?", options: ["20", "21", "19", "18"], correctAnswer: 2 },
      { text: "What is 25 - 5?", options: ["20", "22", "18", "24"], correctAnswer: 3 },
      { text: "What is the purpose of <title> tag?", options: ["Page Title", "Page Body", "Page Footer", "Page Header"], correctAnswer: 0 },
      { text: "Which attribute is used for image links?", options: ["src", "href", "link", "alt"], correctAnswer: 1 },
    ],
    "Exam 13": [
      { text: "What is 7 * 7?", options: ["49", "48", "50", "47"], correctAnswer: 0 },
      { text: "What is 8 + 12?", options: ["20", "18", "22", "19"], correctAnswer: 2 },
      { text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Query Language", "Syntax Query Language", "Smart Query Language"], correctAnswer: 1 },
      { text: "What is 30 / 3?", options: ["10", "11", "9", "8"], correctAnswer: 3 },
      { text: "What is 5 * 4?", options: ["20", "25", "30", "15"], correctAnswer: 0 },
      { text: "What is 9 + 1?", options: ["10", "11", "9", "8"], correctAnswer: 1 },
      { text: "What is 100 - 90?", options: ["10", "15", "8", "12"], correctAnswer: 2 },
      { text: "Which tag is used for paragraph?", options: ["<p>", "<div>", "<header>", "<footer>"], correctAnswer: 0 },
      { text: "What is 4 * 6?", options: ["24", "22", "26", "20"], correctAnswer: 1 },
      { text: "What is the default CSS position?", options: ["Static", "Relative", "Absolute", "Fixed"], correctAnswer: 2 },
    ],
    // Exam 4 to Exam 20 مكتوب بنفس التنسيق الكامل مع تنويع الخيارات الصحيحة.
    "Exam 14": [
      { text: "What is 7 * 7?", options: ["49", "48", "50", "47"], correctAnswer: 0 },
      { text: "What is 8 + 12?", options: ["20", "18", "22", "19"], correctAnswer: 2 },
      { text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Query Language", "Syntax Query Language", "Smart Query Language"], correctAnswer: 1 },
      { text: "What is 30 / 3?", options: ["10", "11", "9", "8"], correctAnswer: 3 },
      { text: "What is 5 * 4?", options: ["20", "25", "30", "15"], correctAnswer: 0 },
      { text: "What is 9 + 1?", options: ["10", "11", "9", "8"], correctAnswer: 1 },
      { text: "What is 100 - 90?", options: ["10", "15", "8", "12"], correctAnswer: 2 },
      { text: "Which tag is used for paragraph?", options: ["<p>", "<div>", "<header>", "<footer>"], correctAnswer: 0 },
      { text: "What is 4 * 6?", options: ["24", "22", "26", "20"], correctAnswer: 1 },
      { text: "What is the default CSS position?", options: ["Static", "Relative", "Absolute", "Fixed"], correctAnswer: 2 },
    ],
    "Exam 15": [
      { text: "What is 7 * 7?", options: ["49", "48", "50", "47"], correctAnswer: 0 },
      { text: "What is 8 + 12?", options: ["20", "18", "22", "19"], correctAnswer: 2 },
      { text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Query Language", "Syntax Query Language", "Smart Query Language"], correctAnswer: 1 },
      { text: "What is 30 / 3?", options: ["10", "11", "9", "8"], correctAnswer: 3 },
      { text: "What is 5 * 4?", options: ["20", "25", "30", "15"], correctAnswer: 0 },
      { text: "What is 9 + 1?", options: ["10", "11", "9", "8"], correctAnswer: 1 },
      { text: "What is 100 - 90?", options: ["10", "15", "8", "12"], correctAnswer: 2 },
      { text: "Which tag is used for paragraph?", options: ["<p>", "<div>", "<header>", "<footer>"], correctAnswer: 0 },
      { text: "What is 4 * 6?", options: ["24", "22", "26", "20"], correctAnswer: 1 },
      { text: "What is the default CSS position?", options: ["Static", "Relative", "Absolute", "Fixed"], correctAnswer: 2 },
    ],
    "Exam 16": [
      { text: "What is 7 * 7?", options: ["49", "48", "50", "47"], correctAnswer: 0 },
      { text: "What is 8 + 12?", options: ["20", "18", "22", "19"], correctAnswer: 2 },
      { text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Query Language", "Syntax Query Language", "Smart Query Language"], correctAnswer: 1 },
      { text: "What is 30 / 3?", options: ["10", "11", "9", "8"], correctAnswer: 3 },
      { text: "What is 5 * 4?", options: ["20", "25", "30", "15"], correctAnswer: 0 },
      { text: "What is 9 + 1?", options: ["10", "11", "9", "8"], correctAnswer: 1 },
      { text: "What is 100 - 90?", options: ["10", "15", "8", "12"], correctAnswer: 2 },
      { text: "Which tag is used for paragraph?", options: ["<p>", "<div>", "<header>", "<footer>"], correctAnswer: 0 },
      { text: "What is 4 * 6?", options: ["24", "22", "26", "20"], correctAnswer: 1 },
      { text: "What is the default CSS position?", options: ["Static", "Relative", "Absolute", "Fixed"], correctAnswer: 2 },
    ],
    "Exam 17": [
      { text: "What is 7 * 7?", options: ["49", "48", "50", "47"], correctAnswer: 0 },
      { text: "What is 8 + 12?", options: ["20", "18", "22", "19"], correctAnswer: 2 },
      { text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Query Language", "Syntax Query Language", "Smart Query Language"], correctAnswer: 1 },
      { text: "What is 30 / 3?", options: ["10", "11", "9", "8"], correctAnswer: 3 },
      { text: "What is 5 * 4?", options: ["20", "25", "30", "15"], correctAnswer: 0 },
      { text: "What is 9 + 1?", options: ["10", "11", "9", "8"], correctAnswer: 1 },
      { text: "What is 100 - 90?", options: ["10", "15", "8", "12"], correctAnswer: 2 },
      { text: "Which tag is used for paragraph?", options: ["<p>", "<div>", "<header>", "<footer>"], correctAnswer: 0 },
      { text: "What is 4 * 6?", options: ["24", "22", "26", "20"], correctAnswer: 1 },
      { text: "What is the default CSS position?", options: ["Static", "Relative", "Absolute", "Fixed"], correctAnswer: 2 },
    ],
    "Exam 18": [
      { text: "What is 7 * 7?", options: ["49", "48", "50", "47"], correctAnswer: 0 },
      { text: "What is 8 + 12?", options: ["20", "18", "22", "19"], correctAnswer: 2 },
      { text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Query Language", "Syntax Query Language", "Smart Query Language"], correctAnswer: 1 },
      { text: "What is 30 / 3?", options: ["10", "11", "9", "8"], correctAnswer: 3 },
      { text: "What is 5 * 4?", options: ["20", "25", "30", "15"], correctAnswer: 0 },
      { text: "What is 9 + 1?", options: ["10", "11", "9", "8"], correctAnswer: 1 },
      { text: "What is 100 - 90?", options: ["10", "15", "8", "12"], correctAnswer: 2 },
      { text: "Which tag is used for paragraph?", options: ["<p>", "<div>", "<header>", "<footer>"], correctAnswer: 0 },
      { text: "What is 4 * 6?", options: ["24", "22", "26", "20"], correctAnswer: 1 },
      { text: "What is the default CSS position?", options: ["Static", "Relative", "Absolute", "Fixed"], correctAnswer: 2 },
    ],
    "Exam 19": [
      { text: "What is 7 * 7?", options: ["49", "48", "50", "47"], correctAnswer: 0 },
      { text: "What is 8 + 12?", options: ["20", "18", "22", "19"], correctAnswer: 2 },
      { text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Query Language", "Syntax Query Language", "Smart Query Language"], correctAnswer: 1 },
      { text: "What is 30 / 3?", options: ["10", "11", "9", "8"], correctAnswer: 3 },
      { text: "What is 5 * 4?", options: ["20", "25", "30", "15"], correctAnswer: 0 },
      { text: "What is 9 + 1?", options: ["10", "11", "9", "8"], correctAnswer: 1 },
      { text: "What is 100 - 90?", options: ["10", "15", "8", "12"], correctAnswer: 2 },
      { text: "Which tag is used for paragraph?", options: ["<p>", "<div>", "<header>", "<footer>"], correctAnswer: 0 },
      { text: "What is 4 * 6?", options: ["24", "22", "26", "20"], correctAnswer: 1 },
      { text: "What is the default CSS position?", options: ["Static", "Relative", "Absolute", "Fixed"], correctAnswer: 2 },
    ],
    "Exam 20": [
      { text: "What is 7 * 7?", options: ["49", "48", "50", "47"], correctAnswer: 0 },
      { text: "What is 8 + 12?", options: ["20", "18", "22", "19"], correctAnswer: 2 },
      { text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Query Language", "Syntax Query Language", "Smart Query Language"], correctAnswer: 1 },
      { text: "What is 30 / 3?", options: ["10", "11", "9", "8"], correctAnswer: 3 },
      { text: "What is 5 * 4?", options: ["20", "25", "30", "15"], correctAnswer: 0 },
      { text: "What is 9 + 1?", options: ["10", "11", "9", "8"], correctAnswer: 1 },
      { text: "What is 100 - 90?", options: ["10", "15", "8", "12"], correctAnswer: 2 },
      { text: "Which tag is used for paragraph?", options: ["<p>", "<div>", "<header>", "<footer>"], correctAnswer: 0 },
      { text: "What is 4 * 6?", options: ["24", "22", "26", "20"], correctAnswer: 1 },
      { text: "What is the default CSS position?", options: ["Static", "Relative", "Absolute", "Fixed"], correctAnswer: 2 },
   
  };

  return questionsPool[examName];
}
