// admin.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCc_LyGshkApqre4NIRKF7UTNjfE08cenw",
  authDomain: "websits-turoria.firebaseapp.com",
  projectId: "websits-turoria",
  storageBucket: "websits-turoria.firebasestorage.app",
  messagingSenderId: "689962826966",
  appId: "1:689962826966:web:babc4f1bbcc7eeb8705d77",
  measurementId: "G-L6XTRJQQBH",
  databaseURL: "https://websits-turoria-default-rtdb.firebaseio.com/",
};

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const totalUsersElement = document.getElementById("totalUsers");
const averageScoreElement = document.getElementById("averageScore");
const totalExamsElement = document.getElementById("totalExams");
const examTopicsList = document.getElementById("examTopicsList");
const usersTable = document.getElementById("usersTable");
const adminMessageInput = document.getElementById("adminMessageInput");

// إضافة موضوع امتحان
document.getElementById("addExamTopicBtn").addEventListener("click", () => {
  const topicInput = document.getElementById("examTopicInput");
  const topic = topicInput.value.trim();
  if (topic) {
    push(ref(db, "examTopics"), { topic });
    topicInput.value = ""; // مسح الحقل
  }
});

// عرض موضوعات الامتحان
const topicsRef = ref(db, "examTopics");
onValue(topicsRef, (snapshot) => {
  examTopicsList.innerHTML = "";
  snapshot.forEach((childSnapshot) => {
    const topicData = childSnapshot.val();
    const topicItem = document.createElement("li");
    topicItem.textContent = topicData.topic;
    examTopicsList.appendChild(topicItem);
  });
});

// إرسال رسالة لجميع المستخدمين
document.getElementById("sendMessageBtn").addEventListener("click", () => {
  const message = adminMessageInput.value.trim();
  if (message) {
    push(ref(db, "messages"), { text: message });
    alert("تم إرسال الرسالة!");
    adminMessageInput.value = ""; // مسح الحقل
  }
});

// جلب المستخدمين
const usersRef = ref(db, "users");
onValue(usersRef, (snapshot) => {
  const users = snapshot.val();
  if (!users) {
    totalUsersElement.textContent = "0";
    usersTable.innerHTML = "<tr><td colspan='4'>لا توجد بيانات.</td></tr>";
    return;
  }

  const userArray = Object.values(users);
  totalUsersElement.textContent = userArray.length;
  usersTable.innerHTML = "";
  userArray.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.username}</td>
      <td>${user.status}</td>
      <td>
        <button onclick="suspendUser('${index}')">إيقاف</button>
        <button onclick="deleteUser('${index}')">حذف</button>
      </td>
    `;
    usersTable.appendChild(row);
  });
});

// إيقاف مستخدم
window.suspendUser = (userId) => {
  const userStatusRef = ref(db, `users/${userId}/status`);
  update(userStatusRef, "Suspended")
    .then(() => alert("تم إيقاف المستخدم بنجاح"))
    .catch((err) => console.error(err));
};

// حذف مستخدم
window.deleteUser = (userId) => {
  const userRef = ref(db, `users/${userId}`);
  remove(userRef)
    .then(() => alert("تم حذف المستخدم بنجاح"))
    .catch((err) => console.error(err));
};
