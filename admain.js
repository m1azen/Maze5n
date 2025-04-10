import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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
  // إعداد الحسابات لمختلف الأقسام
  const accountSelects = [
    document.getElementById('accountSelect'),
    document.getElementById('editAccountSelect'),
    document.getElementById('suspendAccountSelect'),
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

// Update Account Information
document.getElementById('updateAccountBtn').addEventListener('click', async () => {
  const userId = document.getElementById('editAccountSelect').value;
  const newUsername = document.getElementById('newUsername').value;
  const newEmail = document.getElementById('newEmail').value;
  const newPassword = document.getElementById('newPassword').value;

  if (!userId || (!newUsername && !newEmail && !newPassword)) {
    alert("❗ يرجى إدخال المعلومات المطلوبة.");
    return;
  }

  const updates = {};
  if (newUsername) updates.username = newUsername;
  if (newEmail) updates.email = new
