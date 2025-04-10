import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
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
const auth = getAuth(app);
const db = getFirestore(app);

// Handle Navigation
document.getElementById('viewDataBtn').addEventListener('click', () => {
  document.getElementById('view-data-section').classList.remove('hidden');
  document.getElementById('manage-accounts-section').classList.add('hidden');
});

document.getElementById('manageAccountsBtn').addEventListener('click', () => {
  document.getElementById('manage-accounts-section').classList.remove('hidden');
  document.getElementById('view-data-section').classList.add('hidden');
});

// Load Accounts for Dropdowns
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

  const accountDetailsDiv = document
