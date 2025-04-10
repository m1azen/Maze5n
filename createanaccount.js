import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, listUsers } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// إعدادات Firebase
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

// تحميل جميع البيانات وعرضها
document.addEventListener('DOMContentLoaded', async function () {
  const accounts = await fetchAllData();
  displayAccounts(accounts);
});

// جلب البيانات من جميع المواقع (Authentication و Firestore)
async function fetchAllData() {
  const accounts = [];

  try {
    // جلب المستخدمين من Authentication
    const usersFromAuth = await listUsers(auth, 100);
    for (const userRecord of usersFromAuth) {
      const user = userRecord.toJSON();

      // جلب بيانات إضافية من Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userFirestoreData = userDoc.exists() ? userDoc.data() : {};

      // دمج البيانات في كائن واحد
      accounts.push({
        uid: user.uid,
        email: user.email || "لا يوجد بريد",
        username: user.displayName || "اسم غير معرف",
        firestoreData: userFirestoreData,
      });
    }
  } catch (error) {
    console.error("❌ حدث خطأ أثناء جلب البيانات:", error);
  }

  return accounts;
}

// عرض البيانات في صفحة HTML
function displayAccounts(accounts) {
  const accountsContainer = document.getElementById('accountsContainer');
  accountsContainer.innerHTML = ''; // تفريغ الحاوية

  if (accounts.length === 0) {
    accountsContainer.innerHTML = '<p>لا توجد بيانات لعرضها.</p>';
    return;
  }

  accounts.forEach((account) => {
    const accountBox = document.createElement('div');
    accountBox.classList.add('account-box');

    // إنشاء قسم بيانات الحساب
    const accountDetails = document.createElement('div');
    accountDetails.classList.add('account-details');
    accountDetails.innerHTML = `
      <p><strong>اسم المستخدم:</strong> ${account.username}</p>
      <p><strong>الإيميل:</strong> ${account.email}</p>
      <p><strong>الحالة:</strong> ${account.firestoreData.status || 'نشط'}</p>
    `;

    // إنشاء قسم التحكم
    const accountControls = document.createElement('div');
    accountControls.classList.add('account-controls');
    accountControls.innerHTML = `
      <button onclick="changePassword('${account.uid}')">تعديل كلمة المرور</button>
      <button onclick="addExam('${account.uid}')">إضافة درجات الامتحان</button>
      ${
        account.firestoreData.status === 'Suspended'
          ? `<button onclick="unsuspendAccount('${account.uid}')">فك الإيقاف</button>`
          : `<button onclick="suspendAccount('${account.uid}')">إيقاف الحساب</button>`
      }
    `;

    // إنشاء قسم الرسائل
    const accountMessages = document.createElement('div');
    accountMessages.classList.add('account-messages');
    accountMessages.innerHTML = `<strong>الرسائل:</strong> ${account.firestoreData.adminMessage || 'لا توجد رسائل.'}`;

    // إنشاء قسم درجات الامتحانات
    const accountExams = document.createElement('div');
    accountExams.classList.add('account-exams');
    const exams = (account.firestoreData.examResults || []).map(
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
    displayAccounts(await fetchAllData());
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

  displayAccounts(await fetchAllData());
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
  displayAccounts(await fetchAllData());
}
