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
const db = firebase.firestore();

// التحقق من كلمة المرور
document.getElementById('login-button').addEventListener('click', () => {
    const password = document.getElementById('password').value;
    
    // كلمة المرور المطلوبة
    if (password === 'ma85rg3z5') {
        // إخفاء شاشة تسجيل الدخول
        document.getElementById('login-screen').style.display = 'none';
        // عرض لوحة تحكم المدير
        document.getElementById('admin-dashboard').style.display = 'block';
    } else {
        // عرض رسالة خطأ
        document.getElementById('error-message').style.display = 'block';
    }
});

// حفظ الرسالة العامة
document.getElementById('save-general-message').addEventListener('click', async () => {
    const message = document.getElementById('general-message').value;
    await db.collection('settings').doc('general-message').set({
        message: message
    });
    alert('تم حفظ الرسالة العامة');
});

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
            <button onclick="showUserAccount('${doc.id}')">عرض الحساب</button>
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

// عرض حساب المستخدم
async function showUserAccount(userId) {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    
    document.getElementById('user-account').style.display = 'block';
    document.getElementById('account-info').innerHTML = `
        <p>الاسم: ${userData.name}</p>
        <p>البريد الإلكتروني: ${userData.email}</p>
        <p>الحالة: ${userData.isBlocked ? 'موقوف' : 'مفعل'}</p>
    `;
}

// تحميل البيانات بتنسيق Excel
document.getElementById('export-data').addEventListener('click', () => {
    // أكواد لتحميل البيانات بتنسيق Excel
});
