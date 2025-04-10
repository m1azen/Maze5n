// إعداد Firebase
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messagingSenderId",
    appId: "your-app-id",
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// كلمة المرور للمدير
const adminPassword = "ma85rg3z5";

// التحقق من كلمة المرور المدخلة
document.getElementById('login-button').addEventListener('click', () => {
    const enteredPassword = document.getElementById('admin-password').value;
    console.log("كلمة المرور المدخلة: ", enteredPassword);  // طباعة كلمة المرور المدخلة

    // تحقق من كلمة المرور
    if (enteredPassword === adminPassword) {
        console.log("تمت المطابقة بنجاح!");  // إذا كانت كلمة المرور صحيحة
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
    } else {
        console.log("كلمة المرور خاطئة!");  // إذا كانت كلمة المرور غير صحيحة
        document.getElementById('error-message').style.display = 'block';
    }
});

// إظهار/إخفاء كلمة المرور
function togglePassword() {
    const passwordField = document.getElementById('admin-password');
    const currentType = passwordField.type;
    passwordField.type = currentType === "password" ? "text" : "password";
}

// تحميل الحسابات من Firebase
document.getElementById('load-users').addEventListener('click', async () => {
    const usersSnapshot = await db.collection('users').get();
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';  // مسح القائمة السابقة

    usersSnapshot.forEach(doc => {
        const user = doc.data();
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');
        
        userCard.innerHTML = `
            <h3>${user.name}</h3>
            <p>البريد الإلكتروني: ${user.email}</p>
            <p>الحالة: ${user.isBlocked ? 'موقوف' : 'مفعل'}</p>
            <button id="stop-account" onclick="blockAccount('${doc.id}')">${user.isBlocked ? 'إلغاء الإيقاف' : 'إيقاف الحساب'}</button>
            <button id="reset-password" onclick="resetPassword('${doc.id}')">إعادة تعيين كلمة المرور</button>
            <button id="delete-account" onclick="deleteAccount('${doc.id}')">حذف الحساب</button>
            <div id="grades"></div>
            <button onclick="addExamGrade('${doc.id}')">إضافة نتيجة امتحان</button>
        `;
        
        userList.appendChild(userCard);
    });
});

// إيقاف/إلغاء إيقاف الحساب
async function blockAccount(userId) {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const isBlocked = userDoc.data().isBlocked;
    await userRef.update({
        isBlocked: !isBlocked
    });
    document.getElementById('load-users').click();  // إعادة تحميل البيانات
}

// إعادة تعيين كلمة المرور
async function resetPassword(userId) {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const email = userDoc.data().email;
    
    // إعادة تعيين كلمة المرور باستخدام Firebase Authentication
    await auth.sendPasswordResetEmail(email);
    alert('تم إرسال رابط إعادة تعيين كلمة المرور إلى البريد الإلكتروني.');
}

// حذف الحساب
async function deleteAccount(userId) {
    await db.collection('users').doc(userId).delete();
    document.getElementById('load-users').click();  // إعادة تحميل البيانات
}

// إضافة درجة امتحان
async function addExamGrade(userId) {
    const examName = prompt('اسم الامتحان:');
    const totalGrade = prompt('الدرجة الكلية:');
    const obtainedGrade = prompt('الدرجة التي حصلت عليها:');
    
    const gradeData = {
        examName,
        totalGrade: parseInt(totalGrade),
        obtainedGrade: parseInt(obtainedGrade)
    };
    
    await db.collection('users').doc(userId).collection('grades').add(gradeData);
    alert('تم إضافة الدرجة بنجاح');
}

// تحميل البيانات بتنسيق Excel
document.getElementById('export-data').addEventListener('click', () => {
    // أكواد لتحميل البيانات بتنسيق Excel
});
