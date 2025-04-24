// التحقق من تسجيل الدخول
if (!localStorage.getItem("loggedIn")) {
  alert("يجب عليك تسجيل الدخول أولًا!");
  window.location.href = "login.html"; // إذا لم يكن قد سجل الدخول، الانتقال إلى صفحة تسجيل الدخول
}

// التحقق إذا كانت نتيجة الامتحان محفوظة
if (localStorage.getItem("examTaken")) {
  document.getElementById("examContent").style.display = "none"; // إخفاء الامتحان
  document.getElementById("result").textContent = `لقد قمت بأداء الامتحان مسبقًا. نتيجة الامتحان السابقة: ${localStorage.getItem("examResult")}`;
}

// تعيين موقت زمني (30 دقيقة)
let timer = 30 * 60;
const countdown = document.getElementById("timer");

function startTimer() {
  setInterval(function() {
    if (timer > 0) {
      timer--;
      let minutes = Math.floor(timer / 60);
      let seconds = timer % 60;
      countdown.textContent = `${minutes}:${seconds}`;
    } else {
      alert("انتهى الوقت!");
      submitQuiz(); // إذا انتهى الوقت، إرسال الامتحان
    }
  }, 1000);
}

function submitQuiz() {
  const answers = {
    q1: "4",
    q2: "3",
    q3: "4"
  };

  let score = 0;
  const form = document.getElementById("quizForm");
  const resultDiv = document.getElementById("result");

  // التحقق من الإجابات التي تم اختيارها
  for (let question in answers) {
    const selectedOption = form.querySelector(`input[name=${question}]:checked`);
    if (selectedOption && selectedOption.value === answers[question]) {
      score++;
    }
  }

  resultDiv.textContent = `لقد حصلت على ${score} من ${Object.keys(answers).length}`;

  // حفظ نتيجة الامتحان في localStorage
  localStorage.setItem("examTaken", "true");
  localStorage.setItem("examResult", `لقد حصلت على ${score} من ${Object.keys(answers).length}`);

  window.location.href = "thankyou.html"; // الانتقال إلى صفحة شكر
}

startTimer(); // بدء العد التنازلي
