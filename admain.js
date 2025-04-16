// admain.js

// شاشة التحميل لمدة 5 ثواني
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById("preloader").style.display = "none";
  }, 5000);
});

// ترحيب متحرك بـ Mazen
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const greeting = document.createElement('div');
  greeting.classList.add('greeting');
  greeting.innerHTML = "مرحباً بك يا <strong>Mazen</strong>! أنت الآن في عالم البرمجة الخرافي!";
  header.appendChild(greeting);
});

// عرض الإحصائيات من Google Sheets
const sheetId = "1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo";
const apiKey = "AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0";
const sheetName = "users";
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

async function fetchUsers() {
  const res = await fetch(url);
  const data = await res.json();
  const users = data.values;
  if (!users || users.length < 2) return;

  const table = document.getElementById('userTable');
  let grades = [];

  users.slice(1).forEach((user, index) => {
    const row = table.insertRow();
    user.forEach((item, i) => {
      const cell = row.insertCell();
      cell.textContent = item;
      if (i === 3) grades.push(Number(item));
    });
  });

  showStats(grades);
}

function showStats(grades) {
  const total = grades.length;
  const avg = grades.reduce((a, b) => a + b, 0) / total;
  document.getElementById("totalUsers").textContent = total;
  document.getElementById("avgScore").textContent = avg.toFixed(1);

  if (avg >= 90) {
    alert("وااااااو! كل ده لأنهم بيتعلموا مع المبرمج Mazen العبقري!");
  }

  // رسم بياني
  const ctx = document.getElementById("chart").getContext("2d");
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["متوسط الدرجات"],
      datasets: [{
        label: "الدرجات",
        data: [avg],
        backgroundColor: "#00ffc3"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });
}

fetchUsers();

// ذكاء اصطناعي داخلي بسيط
document.getElementById("aiForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = document.getElementById("aiQuestion").value.toLowerCase();
  const output = document.getElementById("aiAnswer");

  if (q.includes("html")) {
    output.textContent = "HTML هي لغة ترميز تُستخدم لبناء هيكل صفحات الويب. مثال: <p>مرحبا</p>";
  } else if (q.includes("css")) {
    output.textContent = "CSS تُستخدم لتنسيق صفحات الويب. مثال: p { color: red; }";
  } else if (q.includes("js") || q.includes("javascript")) {
    output.textContent = "JavaScript تضيف التفاعل للموقع. مثال: alert('أهلاً بك!');";
  } else {
    output.textContent = "أنا هنا لأساعدك! جرب تسأل عن HTML أو CSS أو JS.";
  }
});
