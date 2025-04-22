let examsData = {};
let timer;
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

function openExam(examName, password) {
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
    const correctIndex = Math.floor(Math.random() * 3);
    const questionDiv = document.createElement("div");
    questionDiv.innerHTML = `
      <p>Question ${index + 1}: ${question.text}</p>
      ${question.options.map(
        (option, i) =>
          `<input type="radio" name="q${index + 1}" value="${i === correctIndex ? "correct" : "wrong"}"> ${option}`
      ).join("<br>")}
    `;
    questionsContainer.appendChild(questionDiv);
  });

  startTimer();
}

function getQuestionsForExam(examName) {
  const questionsPool = {
    "Exam 1": [
      { text: "What is 5 + 5?", options: ["10", "12", "15"] },
      { text: "What is 2 * 6?", options: ["12", "10", "14"] },
      // أكمل 10 أسئلة لكل امتحان
   
