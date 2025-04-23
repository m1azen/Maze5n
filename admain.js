import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfigUsers = {
  apiKey: "AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0",
  authDomain: "admin-panel-5f716.firebaseapp.com",
  projectId: "admin-panel-5f716",
  storageBucket: "admin-panel-5f716.firebasestorage.app",
  messagingSenderId: "488571843727",
  appId: "1:488571843727:web:3d3d7d5ad495b1fee5acfa",
  measurementId: "G-ZJ9835SCHW",
};

const firebaseConfigScores = {
  apiKey: "AIzaSyCc_LyGshkApqre4NIRKF7UTNjfE08cenw",
  authDomain: "websits-turoria.firebaseapp.com",
  projectId: "websits-turoria",
  storageBucket: "websits-turoria.firebasestorage.app",
  messagingSenderId: "689962826966",
  appId: "1:689962826966:web:babc4f1bbcc7eeb8705d77",
  measurementId: "G-L6XTRJQQBH",
};

// تهيئة Firebase
const appUsers = initializeApp(firebaseConfigUsers, "usersApp");
const appScores = initializeApp(firebaseConfigScores, "scoresApp");

const dbUsers = getFirestore(appUsers);
const dbScores = getFirestore(appScores);

// جلب بيانات المستخدمين
async function fetchUsers() {
  const usersCollection = collection(dbUsers, "users");
  const usersSnapshot = await getDocs(usersCollection);
  const userTableBody = document.querySelector("#user-table tbody");

  userTableBody.innerHTML = "";
  usersSnapshot.forEach((doc) => {
    const userData = doc.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${doc.id}</td>
      <td>${userData.email}</td>
      <td>${userData.status || "Active"}</td>
      <td><button onclick="editUser('${doc.id}')">تعديل</button></td>
    `;
    userTableBody.appendChild(row);
  });
}

// تعديل بيانات المستخدم
window.editUser = async function (id) {
  const newStatus = prompt("أدخل الحالة الجديدة للمستخدم (Active/Inactive):");
  if (newStatus) {
    const userDoc = doc(dbUsers, "users", id);
    await updateDoc(userDoc, { status: newStatus });
    alert("تم تعديل الحالة بنجاح!");
    fetchUsers();
  }
};

// إضافة درجة امتحان
document.getElementById("add-score-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const studentId = document.getElementById("studentId").value.trim();
  const examId = document.getElementById("examId").value.trim();
  const score = parseInt(document.getElementById("score").value);

  try {
    await addDoc(collection(dbScores, "examScores"), {
      studentId,
      examId,
      score,
      timestamp: new Date(),
    });
    alert("تم حفظ الدرجة بنجاح!");
    updateExamTable();
  } catch (error) {
    console.error("Error adding exam score: ", error);
    alert("تعذر حفظ الدرجة.");
  }
});

// جلب درجات الامتحانات
async function updateExamTable() {
  const examTableBody = document.querySelector("#exam-table tbody");
  const scoresCollection = collection(dbScores, "examScores");
  const scoresSnapshot = await getDocs(scoresCollection);

  examTableBody.innerHTML = "";
  scoresSnapshot.forEach((doc) => {
    const scoreData = doc.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${scoreData.studentId}</td>
      <td>${scoreData.examId}</td>
      <td>${scoreData.score}</td>
    `;
    examTableBody.appendChild(row);
  });
}

// تحميل تقرير المستخدمين PDF
document.getElementById("download-users-pdf").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new js
