// admain.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCc_LyGshkApqre4NIRKF7UTNjfE08cenw",
  authDomain: "websits-turoria.firebaseapp.com",
  projectId: "websits-turoria",
  storageBucket: "websits-turoria.appspot.com",
  messagingSenderId: "689962826966",
  appId: "1:689962826966:web:babc4f1bbcc7eeb8705d77"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// تحميل الحسابات في القوائم المنسدلة
async function loadAccounts() {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);

  const selects = [
    document.getElementById("accountSelect"),
    document.getElementById("viewAccountSelect")
  ];

  selects.forEach(select => {
    if (select) {
      select.innerHTML = "<option value=''>اختر الحساب...</option>";
    }
  });

  snapshot.forEach(docSnap => {
    const user = docSnap.data();
    const option = document.createElement("option");
    option.value = docSnap.id;
    option.textContent = user.username || "مستخدم غير معرف";
    selects.forEach(select => {
      if (select) select.appendChild(option);
    });
  });
}

// عرض تفاصيل حساب
document.getElementById("viewDetailsBtn").addEventListener("click", async () => {
  const userId = document.getElementById("viewAccountSelect").value;
  if (!userId) return alert("❗ اختر الحساب أولًا.");

  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  const detailsDiv = document.getElementById("accountDetails");
  if (!userData) {
    detailsDiv.innerHTML = "<p>❌ لم يتم العثور على بيانات.</p>";
    return;
  }

  let examsHtml = "<ul>";
  if (userData.examResults && userData.examResults.length > 0) {
    userData.examResults.forEach(exam => {
      examsHtml += `<li>${exam.examName}: ${exam.obtainedScore}/${exam.totalScore}</li>`;
    });
  } else {
    examsHtml += "<li>لا توجد نتائج امتحانات.</li>";
  }
  examsHtml += "</ul>";

  detailsDiv.innerHTML = `
    <p>👤 الاسم: ${userData.username}</p>
    <p>📧 البريد: ${userData.email}</p>
    <p>📚 النتائج:</p>${examsHtml}
  `;
});

// إضافة درجات امتحان
document.getElementById("addExamBtn").addEventListener("click", async () => {
  const userId = document.getElementById("accountSelect").value;
  const examName = document.getElementById("examName").value;
  const totalScore = document.getElementById("totalScore").value;
  const obtainedScore = document.getElementById("obtainedScore").value;

  if (!userId || !examName || !totalScore || !obtainedScore) {
    alert("❗ يرجى ملء كل الحقول.");
    return;
  }

  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  const examResults = userData.examResults || [];
  examResults.push({
    examName,
    totalScore: Number(totalScore),
    obtainedScore: Number(obtainedScore)
  });

  await updateDoc(userRef, { examResults });

  alert("✅ تم إضافة الدرجة بنجاح!");
  loadAccounts();
});

// تحميل الحسابات عند تحميل الصفحة
window.addEventListener("DOMContentLoaded", loadAccounts);
