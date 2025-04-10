import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, getDocs, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCc_LyGshkApqre4NIRKF7UTNjfE08cenw",
  authDomain: "websits-turoria.firebaseapp.com",
  projectId: "websits-turoria",
  storageBucket: "websits-turoria.appspot.com",
  messagingSenderId: "689962826966",
  appId: "1:689962826966:web:babc4f1bbcc7eeb8705d77",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// التنقل بين الصفحات
document.getElementById('viewDataBtn').addEventListener('click', () => {
  document.getElementById('view-data-section').classList.remove('hidden');
  document.getElementById('manage-accounts-section').classList.add('hidden');
});

document.getElementById('manageAccountsBtn').addEventListener('click', () => {
  document.getElementById('manage-accounts-section').classList.remove('hidden');
  document.getElementById('view-data-section').classList.add('hidden');
});

// تحميل الحسابات في الـ select
async function loadAccounts() {
  const accountSelects = [
    document.getElementById('accountSelect'),
    document.getElementById('viewAccountSelect'),
  ];

  accountSelects.forEach(select => {
    select.innerHTML = '<option value="">اختر الحساب...</option>';
  });

  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);

  snapshot.forEach(docSnap => {
    const user = docSnap.data();
    const option = document.createElement('option');
    option.value = docSnap.id;
    option.textContent = user.username || "بدون اسم";
    accountSelects.forEach(select => select.appendChild(option));
  });
}

// عند الضغط لإضافة نتيجة امتحان
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

// عرض تفاصيل حساب
document.getElementById('viewDetailsBtn').addEventListener('click', async () => {
  const userId = document.getElementById('viewAccountSelect').value;
  if (!userId) {
    alert("❗ يرجى اختيار الحساب.");
    return;
  }

  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    alert("❌ الحساب غير موجود.");
    return;
  }

  const userData = userSnap.data();
  const accountDetailsDiv = document.getElementById('accountDetails');

  accountDetailsDiv.innerHTML = `
    <p><strong>Username:</strong> ${userData.username || "غير متوفر"}</p>
    <p><strong>Email:</strong> ${userData.email || "غير متوفر"}</p>
    <h4>نتائج الامتحانات:</h4>
    <ul>
      ${(userData.examResults || []).map(result => `
        <li>${result.examName}: ${result.obtainedScore}/${result.totalScore}</li>
      `).join('')}
    </ul>
  `;
});

// تحميل الحسابات عند فتح الصفحة
window.addEventListener('DOMContentLoaded', loadAccounts);
