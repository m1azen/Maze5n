import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, deleteDoc, doc, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCc_LyGshkApqre4NIRKF7UTNjfE08cenw",
  authDomain: "websits-turoria.firebaseapp.com",
  projectId: "websits-turoria",
  storageBucket: "websits-turoria.appspot.com",
  messagingSenderId: "689962826966",
  appId: "1:689962826966:web:babc4f1bbcc7eeb8705d77",
  measurementId: "G-L6XTRJQQBH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// تحميل البيانات
document.addEventListener("DOMContentLoaded", async () => {
  const usersSnap = await getDocs(collection(db, "users"));
  const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // الإحصائيات
  document.getElementById("totalUsers").textContent = users.length;
  document.getElementById("activeUsers").textContent = users.filter(u => u.status === "active").length;
  document.getElementById("suspendedUsers").textContent = users.filter(u => u.status === "suspended").length;

  // المتوسط
  const grades = users.map(u => u.grade || 0);
  const avg = grades.reduce((a, b) => a + b, 0) / grades.length || 0;
  document.getElementById("avgGrade").textContent = avg.toFixed(1);

  // أفضل حساب
  const best = users.sort((a, b) => (b.grade || 0) - (a.grade || 0))[0];
  document.getElementById("bestUser").textContent = `أفضل مستخدم: ${best?.username || "لا يوجد"}`;

  const table = document.getElementById("usersTable");
  users.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.status}</td>
      <td>${user.grade || "-"}</td>
      <td>
        <button onclick="editUser('${user.id}')">تعديل</button>
        <button onclick="deleteUser('${user.id}')">حذف</button>
        <button onclick="suspendUser('${user.id}')">إيقاف</button>
        <button onclick="addGrade('${user.id}')">درجة</button>
        <button onclick="sendMsg('${user.id}')">رسالة</button>
      </td>
    `;
    table.appendChild(tr);
  });
});

window.editUser = (id) => {
  const newEmail = prompt("أدخل الإيميل الجديد:");
  if (newEmail) {
    updateDoc(doc(db, "users", id), { email: newEmail });
    alert("تم التحديث");
    location.reload();
  }
};

window.deleteUser = async (id) => {
  if (confirm("هل أنت متأكد؟")) {
    await deleteDoc(doc(db, "users", id));
    alert("تم الحذف");
    location.reload();
  }
};

window.suspendUser = async (id) => {
  const reason = prompt("سبب الإيقاف:");
  if (reason) {
    await updateDoc(doc(db, "users", id), { status: "suspended", reason });
    alert("تم الإيقاف");
    location.reload();
  }
};

window.addGrade = async (id) => {
  const exam = prompt("اسم الامتحان:");
  const total = prompt("الدرجة الكلية:");
  const got = prompt("الدرجة التي حصل عليها:");
  if (exam && total && got) {
    await updateDoc(doc(db, "users", id), {
      lastExam: exam,
      grade: Number(got),
      totalGrade: Number(total)
    });
    alert("تم إضافة الدرجة");
    location.reload();
  }
};

window.sendMsg = async (id) => {
  const msg = prompt("اكتب الرسالة للمستخدم:");
  if (msg) {
    await updateDoc(doc(db, "users", id), { message: msg });
    alert("تم إرسال الرسالة");
  }
};
