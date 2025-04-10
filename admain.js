import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "API_KEY_HERE",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load Accounts
async function loadAccounts() {
  const accountSelects = [
    document.getElementById('accountSelect'),
    document.getElementById('viewAccountSelect'),
  ];

  accountSelects.forEach(select => select.innerHTML = '<option value="">اختر الحساب...</option>');
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);

  snapshot.forEach(doc => {
    const user = doc.data();
    const option = document.createElement('option');
    option.value = doc.id;
    option.textContent = user.username;
    accountSelects.forEach(select => select.appendChild(option));
  });
}

// Add Exam Grades
document.getElementById('addExamBtn').addEventListener('click', async () => {
  const userId = document.getElementById('accountSelect').value;
  const examName = document.getElementById('examName').value;
  const totalScore = document.getElementById('totalScore').value;
  const obtainedScore = document.getElementById('obtainedScore').value;

  if (!userId || !examName || !totalScore || !obtainedScore) {
    alert("❗ يرجى ملء جميع الحقول.");
    return;
  }

  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  const examResults = userData.examResults || [];
  examResults.push({
    examName,
    totalScore: Number(totalScore),
    obtainedScore: Number(obtainedScore),
  });

  await updateDoc(userRef, { examResults });
  alert("✅ تم إضافة درجات الامتحان بنجاح!");
  loadAccounts();
});

// View Account Details
document.getElementById('viewDetailsBtn').addEventListener('click', async () => {
  const userId = document.getElementById('viewAccountSelect').value;
  if (!userId) {
    alert("❗ يرجى اختيار الحساب.");
    return;
  }

  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  const accountDetailsDiv = document.getElementById('accountDetails');
  accountDetailsDiv.innerHTML = `
    <p>👤 <strong>الاسم:</strong> ${userData.username}</p>
    <p>📧 <strong>البريد:</strong> ${userData.email}</p>
    <p>📅 <strong>الحالة:</strong> ${userData.status || "نشط"}</p>
    <p>🔢 <strong>عدد مرات الدخول:</strong> ${userData.loginCount || 0}</p>
    <h3>📚 درجات الامتحانات:</h3>
    <ul>
      ${(userData.examResults || []).map(result => `
        <li>${result.examName}: ${result.obtainedScore}/${result.totalScore}</li>
      `).join('')}
    </ul>
  `;
});

// Load Data on Page Load
loadAccounts();
