import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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
  const accountsContainer = document.getElementById('accounts');
  accountsContainer.innerHTML = '';

  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);

  snapshot.forEach(doc => {
    const user = doc.data();
    const userElement = document.createElement('div');
    userElement.className = 'account-card';
    userElement.innerHTML = `
      <p>👤 <strong>الاسم:</strong> ${user.username}</p>
      <p>📧 <strong>البريد:</strong> ${user.email}</p>
      <p>📅 <strong>الحالة:</strong> ${user.status || "نشط"}</p>
      <button onclick="stopAccount('${doc.id}')">⛔ إيقاف الحساب</button>
      <button onclick="deleteAccount('${doc.id}')">🗑️ حذف الحساب</button>
      <button onclick="editAccount('${doc.id}')">✏️ تعديل الحساب</button>
      <button onclick="addExamResults('${doc.id}')">📝 إضافة درجات</button>
      <button onclick="grantAccess('${doc.id}')">✔️ السماح بالوصول</button>
    `;
    accountsContainer.appendChild(userElement);
  });
}

// Stop Account
async function stopAccount(userId) {
  const reason = prompt("🚨 أدخل سبب وقف الحساب:");
  const duration = prompt("⏳ أدخل مدة الوقف (ساعات/أيام):");
  await updateDoc(doc(db, "users", userId), {
    status: `موقوف بسبب: ${reason} لمدة: ${duration}`
  });
  alert("✅ تم إيقاف الحساب بنجاح!");
  loadAccounts();
}

// Delete Account
async function deleteAccount(userId) {
  if (confirm("❓ هل أنت متأكد من حذف الحساب؟")) {
    await deleteDoc(doc(db, "users", userId));
    alert("🗑️ تم حذف الحساب بنجاح!");
    loadAccounts();
  }
}

// Edit Account
async function editAccount(userId) {
  const newUsername = prompt("✏️ أدخل الاسم الجديد:");
  const newEmail = prompt("✏️ أدخل البريد الجديد:");
  await updateDoc(doc(db, "users", userId), {
    username: newUsername,
    email: newEmail
  });
  alert("✅ تم تعديل الحساب بنجاح!");
  loadAccounts();
}

// Add Exam Results
async function addExamResults(userId) {
  const examName = prompt("📚 أدخل اسم الامتحان:");
  const totalScore = prompt("📊 أدخل الدرجة الكلية:");
  const obtainedScore = prompt("🔢 أدخل الدرجة التي حصل عليها:");
  const userRef = doc(db, "users", userId);

  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();
  const newResults = userData.examResults || [];
  newResults.push({ examName, totalScore, obtainedScore });

  await updateDoc(userRef, {
    examResults: newResults
  });

  alert("✅ تم إضافة درجات الامتحان بنجاح!");
  loadAccounts();
}

// Grant Access
async function grantAccess(userId) {
  await updateDoc(doc(db, "users", userId), {
    access: "مسموح"
  });
  alert("✅ تم السماح بالوصول!");
  loadAccounts();
}

// Reload Data
document.getElementById('reloadBtn').addEventListener('click', loadAccounts);
loadAccounts();
