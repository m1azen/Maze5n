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

  const enteredPassword = prompt(`Enter password for ${examName}:`);
  if (enteredPassword === password) {
    startExam(examName);
  } else {
    alert("Incorrect password!");
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
      { text:
