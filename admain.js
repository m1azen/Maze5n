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

document.addEventListener('DOMContentLoaded', displayAccounts);

async function displayAccounts() {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);
  const accountsContainer = document.getElementById('accountsContainer');

  accountsContainer.innerHTML = ''; // تفريغ الحاوية قبل ملئها

  snapshot.forEach((docSnap) => {
    const account = docSnap.data();

    // إنشاء مربع الحساب
    const accountBox = document.createElement('div');
    accountBox.classList.add('account-box');

    // تفاصيل الحساب
    const accountDetails = document.createElement('div');
    accountDetails.classList.add('account-details');
    accountDetails.innerHTML = `
      <p><strong>اسم المستخدم:</strong> ${account.username}</p>
      <p><strong>الإيميل:</strong> ${account.email}</p>
      <p><strong>الحالة:</strong> ${account.status || 'نشط'}</p>
    `;

    // أدوات التحكم
    const accountControls = document.createElement('div');
    accountControls.classList.add('account-controls');
    accountControls.innerHTML = `
      <button onclick="changePassword('${docSnap.id}')">تعديل كلمة المرور</button>
      <button onclick="suspendAccount('${docSnap.id}')">${account.status === 'Suspended' ? 'فك الإيقاف' : 'إيقاف الحساب'}</button>
      <button onclick="addExam('${docSnap.id}')">إضافة درجات الامتحان</button>
    `;

    // الرسائل
    const accountMessages = document.createElement('div');
    accountMessages.classList.add('account-messages');
    accountMessages.innerHTML = `<strong>الرسائل:</strong> ${account.adminMessage || 'لا توجد رسائل.'}`;

    // درجات الامتحانات
    const accountExams = document.createElement('div');
    accountExams.classList.add('account-exams');
    const exams = (account.examResults || []).map(
      (exam) => `<li>${exam.examName}: ${exam.obtainedScore}/${exam.totalScore}</li>`
    ).join('');
    accountExams.innerHTML = `<strong>درجات الامتحانات:</strong><ul>${exams || 'لا توجد درجات.'}</ul>`;

    // إضافة العناصر إلى مربع الحساب
    accountBox.appendChild(accountDetails);
    accountBox.appendChild(accountControls);
    accountBox.appendChild(accountMessages);
    accountBox.appendChild(accountExams);

    // إضافة مربع الحساب إلى الحاوية
    accountsContainer.appendChild(accountBox);
  });
}

// تعديل كلمة المرور
async function changePassword(userId) {
  const newPassword = prompt('أدخل كلمة المرور الجديدة:');
  if (newPassword) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { password: newPassword });
    alert('تم تحديث كلمة المرور بنجاح!');
    displayAccounts();
  }
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

  displayAccounts();
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
  displayAccounts();
}
