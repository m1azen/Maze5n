let examsData = {};
let currentExam = "";
let timeLeft = 30 * 60; // 30 دقيقة
let timer;
let circleCircumference = 283;

function loadExams() {
  examsData = JSON.parse(localStorage.getItem("examsData")) || {};
}

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("shown");
}

function handleExamSelection(examName, password) {
  // إخفاء القائمة بعد الاختيار
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.remove("shown");

  const enteredPassword = prompt(`Enter password for ${examName}:`);
  if (enteredPassword === password) {
    startExam(examName);
  } else {
    alert("Incorrect password!");
  }
}

function startExam(examName) {
  currentExam = examName;
  document.getElementById("examTitle").textContent = examName;
  document.getElementById("examContainer").classList.remove("hidden");

  // إعادة ضبط المؤقت (تولو 30 دقيقة)
  timeLeft = 30 * 60;

  const questionsContainer = document.getElementById("questionsContainer");
  questionsContainer.innerHTML = "";

  const questions = getQuestionsForExam(examName);
  questions.forEach((question, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question-box");
    questionDiv.innerHTML = `
      <p>Question ${index + 1}: ${question.text}</p>
      ${question.options.map((option, i) =>
        `<div class="option">
           <input type="radio" name="q${index + 1}" value="${i === question.correctAnswer ? "correct" : "wrong"}" id="${examName}-q${index+1}-opt${i}">
           <label for="${examName}-q${index+1}-opt${i}">${option}</label>
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
      { text: "Exam 1 Q1: What is 5 + 5?", options: ["10", "12", "15", "8"], correctAnswer: 0 },
      { text: "Exam 1 Q2: What is 3 * 3?", options: ["9", "6", "8", "7"], correctAnswer: 1 },
      { text: "Exam 1 Q3: What does HTML stand for?", options: ["HyperText Markup Language", "Home Tool Markup Language", "Hot Mail Text", "HyperText Management Language"], correctAnswer: 2 },
      { text: "Exam 1 Q4: What is 10 - 5?", options: ["5", "6", "4", "7"], correctAnswer: 3 },
      { text: "Exam 1 Q5: What is 6 * 6?", options: ["36", "30", "32", "40"], correctAnswer: 0 },
      { text: "Exam 1 Q6: What is 8 + 2?", options: ["10", "12", "9", "11"], correctAnswer: 1 },
      { text: "Exam 1 Q7: What is 12 / 4?", options: ["3", "4", "5", "6"], correctAnswer: 2 },
      { text: "Exam 1 Q8: What is 14 + 6?", options: ["20", "22", "24", "18"], correctAnswer: 3 },
      { text: "Exam 1 Q9: What does JS stand for?", options: ["JavaScript", "JavaSyntax", "JustScript", "JsonScript"], correctAnswer: 0 },
      { text: "Exam 1 Q10: Which tag is used for links?", options: ["<a>", "<link>", "<href>", "<url>"], correctAnswer: 1 },
    ],
    "Exam 2": [
      { text: "Exam 2 Q1: What is 6 + 4?", options: ["10", "11", "12", "13"], correctAnswer: 0 },
      { text: "Exam 2 Q2: What is 9 * 2?", options: ["18", "16", "20", "14"], correctAnswer: 1 },
      { text: "Exam 2 Q3: What does CSS stand for?", options: ["Cascading Style Sheets", "Colorful Style Sheets", "Creative Sheets", "Computer Style Sheets"], correctAnswer: 2 },
      { text: "Exam 2 Q4: What is 20 - 5?", options: ["15", "16", "14", "17"], correctAnswer: 3 },
      { text: "Exam 2 Q5: What is 4 * 5?", options: ["20", "18", "22", "16"], correctAnswer: 0 },
      { text: "Exam 2 Q6: What is 15 / 3?", options: ["5", "6", "7", "4"], correctAnswer: 1 },
      { text: "Exam 2 Q7: What is 11 + 9?", options: ["20", "21", "19", "18"], correctAnswer: 2 },
      { text: "Exam 2 Q8: What is 25 - 5?", options: ["20", "22", "18", "24"], correctAnswer: 3 },
      { text: "Exam 2 Q9: What is the purpose of the <title> tag?", options: ["Page Title", "Page Body", "Page Footer", "Page Header"], correctAnswer: 0 },
      { text: "Exam 2 Q10: Which attribute is used for image links?", options: ["src", "href", "link", "alt"], correctAnswer: 1 },
    ],
    "Exam 3": [
      { text: "Exam 3 Q1: What is 7 * 7?", options: ["49", "48", "50", "47"], correctAnswer: 0 },
      { text: "Exam 3 Q2: What is 8 + 12?", options: ["20", "18", "22", "19"], correctAnswer: 2 },
      { text: "Exam 3 Q3: What does SQL stand for?", options: ["Structured Query Language", "Strong Query Language", "Syntax Query Language", "Smart Query Language"], correctAnswer: 1 },
      { text: "Exam 3 Q4: What is 30 / 3?", options: ["10", "11", "9", "8"], correctAnswer: 3 },
      { text: "Exam 3 Q5: What is 5 * 4?", options: ["20", "25", "30", "15"], correctAnswer: 0 },
      { text: "Exam 3 Q6: What is 9 + 1?", options: ["10", "11", "9", "8"], correctAnswer: 1 },
      { text: "Exam 3 Q7: What is 100 - 90?", options: ["10", "15", "8", "12"], correctAnswer: 2 },
      { text: "Exam 3 Q8: Which tag is used for paragraphs?", options: ["<p>", "<div>", "<header>", "<footer>"], correctAnswer: 0 },
      { text: "Exam 3 Q9: What is 4 * 6?", options: ["24", "22", "26", "20"], correctAnswer: 1 },
      { text: "Exam 3 Q10: What is the default CSS position?", options: ["Static", "Relative", "Absolute", "Fixed"], correctAnswer: 2 },
    ],
    "Exam 4": [
      { text: "Exam 4 Q1: What is 2 + 8?", options: ["10", "12", "11", "13"], correctAnswer: 0 },
      { text: "Exam 4 Q2: What is 5 * 6?", options: ["30", "25", "35", "20"], correctAnswer: 1 },
      { text: "Exam 4 Q3: What is 15 / 3?", options: ["5", "4", "6", "7"], correctAnswer: 2 },
      { text: "Exam 4 Q4: What is 9 + 11?", options: ["20", "19", "18", "21"], correctAnswer: 3 },
      { text: "Exam 4 Q5: What does API stand for?", options: ["Application Programming Interface", "Advanced Process Integration", "Application Performance Index", "Automated Programming Interface"], correctAnswer: 0 },
      { text: "Exam 4 Q6: What is 8 * 3?", options: ["24", "26", "22", "20"], correctAnswer: 1 },
      { text: "Exam 4 Q7: What does DOM stand for?", options: ["Document Object Model", "Data Output Method", "Digital Operation Module", "Document Order Map"], correctAnswer: 2 },
      { text: "Exam 4 Q8: Which tag is used for headings?", options: ["<h1>", "<header>", "<head>", "<title>"], correctAnswer: 3 },
      { text: "Exam 4 Q9: What is 4 + 16?", options: ["20", "21", "22", "19"], correctAnswer: 0 },
      { text: "Exam 4 Q10: What is 6 / 2?", options: ["3", "2", "4", "1"], correctAnswer: 1 },
    ],
    "Exam 5": [
      { text: "Exam 5 Q1: What is 7 + 8?", options: ["15", "16", "14", "17"], correctAnswer: 0 },
      { text: "Exam 5 Q2: What is 10 * 2?", options: ["20", "18", "22", "24"], correctAnswer: 0 },
      { text: "Exam 5 Q3: What is 9 - 3?", options: ["5", "6", "7", "4"], correctAnswer: 3 },
      { text: "Exam 5 Q4: What is 12 / 3?", options: ["3", "4", "5", "2"], correctAnswer: 1 },
      { text: "Exam 5 Q5: What is 4 + 4?", options: ["7", "8", "6", "9"], correctAnswer: 1 },
      { text: "Exam 5 Q6: What is 3 + 4?", options: ["7", "6", "8", "9"], correctAnswer: 0 },
      { text: "Exam 5 Q7: What is 5 + 3?", options: ["7", "8", "9", "10"], correctAnswer: 1 },
      { text: "Exam 5 Q8: What is 2 * 2?", options: ["2", "3", "4", "5"], correctAnswer: 2 },
      { text: "Exam 5 Q9: What is 10 - 2?", options: ["7", "8", "9", "6"], correctAnswer: 1 },
      { text: "Exam 5 Q10: What is 2 + 2?", options: ["4", "3", "5", "6"], correctAnswer: 0 },
    ],
    "Exam 6": [
      { text: "Exam 6 Q1: What is 8 + 1?", options: ["9", "10", "11", "8"], correctAnswer: 0 },
      { text: "Exam 6 Q2: What is 4 * 4
