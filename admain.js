import { firebaseConfig } from "./firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// تحميل بيانات المستخدمين وعرضها
document.addEventListener('DOMContentLoaded', async () => {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);
  const adminContainer = document.getElementById("adminContainer");

  adminContainer.innerHTML = ''; // تفريغ الحاوية

  snapshot.forEach((docSnap) => {
    const userData = docSnap.data();

    // إنشاء مربع المستخدم
    const adminBox = document.createElement('div');
    adminBox.classList.add('admin-box');

    // تفاصيل الحساب
    const adminDetails = document.createElement('div');
    adminDetails.classList.add('admin-details');
    adminDetails.innerHTML = `
      <p><strong>اسم المستخدم:</strong> ${userData.username}</p>
      <p><strong>الإيميل:</strong> ${userData.email}</p>
      <p><strong>الحالة:</strong> ${userData.status || 'نشط'}</p>
    `;

    // أدوات التحكم
    const adminControls = document.createElement('div');
    adminControls.classList.add('admin-controls');
    adminControls.innerHTML = `
      <button onclick="changePassword('${docSnap.id}')">تعديل كلمة المرور</button>
      <button onclick="addExam('${docSnap.id}')">إضافة درجات الامتحان</button>
      ${
        userData.status === 'Suspended'
          ? `<button onclick="unsuspendAccount('${docSnap.id}')">فك الإيقاف</button>`
          : `<button onclick="suspendAccount('${docSnap.id}')">إيقاف الحساب</button>`
      }
      <button onclick="deleteAccount('${docSnap.id}')">حذف الحساب</button>
    `;

    // الرسائل
    const adminMessages = document.createElement('div');
    adminMessages.classList.add('admin-messages');
    adminMessages.innerHTML = `<strong>الرسائل:</strong> ${userData.adminMessage || 'لا توجد رسائل.'}`;

    // درجات الامتحانات
    const adminExams = document.createElement('div');
    adminExams.classList.add('admin-exams');
    const exams = (userData.examResults || []).map(
      (exam) => `<li>${exam.examName}: ${exam.obtainedScore}/${exam.totalScore}</li>`
    ).join('');
    adminExams.innerHTML = `<strong>درجات الامتحانات:</strong><ul>${exams || 'لا توجد درجات.'}</ul>`;

    // إضافة العناصر إلى مربع المستخدم
    adminBox.appendChild(adminDetails);
    adminBox.appendChild(adminControls);
    adminBox.appendChild(adminMessages);
    adminBox.appendChild(adminExams);

    // إضافة مربع المستخدم إلى الحاوية
    adminContainer.appendChild(adminBox);
  });
});

// تعديل كلمة المرور
async function changePassword(userId) {
  const newPassword = prompt('أدخل كلمة المرور الجديدة:');
  if (newPassword) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { password: newPassword });
    alert('تم تحديث كلمة المرور بنجاح!');
    location.reload(); // تحديث الصفحة
  }
}

// إضافة درجات الامتحان
async function addExam(userId) {
  const examName = prompt('أدخل اسم الامتحان:');
  const totalScore = prompt('أدخل الدرجة الكلية:');
  const obtainedScore = prompt('أدخل الدرجة التي حصل عليها:');
  
  if (!examName || !totalScore || !obtainedScore || isNaN(totalScore) || isNaN(obtainedScore)) {
    alert('يرجى إدخال البيانات بشكل صحيح.');
    return;
  }

  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  const examResults = userData.examResults || [];
  examResults.push({ examName, totalScore: Number(totalScore), obtainedScore: Number(obtainedScore) });

  await updateDoc(userRef, { examResults });
  alert('تمت إضافة درجات الامتحان بنجاح!');
  location.reload(); // تحديث الصفحة
}

// إيقاف أو فك الإيقاف
async function suspendAccount(userId) {
  const userRef = doc(db, "users", userId);
  const accountSnap = await getDoc(userRef);
  const account = accountSnap.data();

  if (account.status === 'Suspended') {
    await updateDoc(userRef, { status: 'نشط', suspendUntil: null });
    alert('تم فك الإيقاف بنجاح!');
  } else {
    const days = prompt('كم يوم تريد إيقاف الحساب؟');
    if (days && !isNaN(days)) {
      const suspensionDate = new Date();
      const suspendUntil = suspensionDate.getTime() + Number(days) * 24 * 60 * 60 * 1000;
      await updateDoc(userRef, {
        status: `موقوف حتى ${new Date(suspendUntil).toLocaleDateString()}`,
        suspendUntil,
      });
      alert(`تم إيقاف الحساب لمدة ${days} يومًا.`);
    }
  }
  location.reload(); // تحديث الصفحة
}

// حذف الحساب
async function deleteAccount(userId) {
  if (confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
    alert('تم حذف الحساب بنجاح!');
    location.reload(); // تحديث الصفحة
  }
}
