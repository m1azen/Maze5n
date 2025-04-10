import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDocs, collection, updateDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messagingSenderId",
    appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById('login-button').addEventListener('click', () => {
    const password = document.getElementById('password').value;
    if (password === 'ma85rg3z5') {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
    } else {
        document.getElementById('error-message').style.display = 'block';
    }
});

document.getElementById('save-general-message').addEventListener('click', async () => {
    const message = document.getElementById('general-message').value;
    try {
        await setDoc(doc(db, 'settings', 'general-message'), {
            message: message
        });
        document.getElementById('message-status').style.color = 'green';
        document.getElementById('message-status').innerHTML = 'تم حفظ الرسالة بنجاح!';
        document.getElementById('message-status').style.display = 'block';
    } catch (error) {
        document.getElementById('message-status').style.color = 'red';
        document.getElementById('message-status').innerHTML = 'حدث خطأ، لم تتم الحفظ!';
        document.getElementById('message-status').style.display = 'block';
    }
});

document.getElementById('load-users').addEventListener('click', async () => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    usersSnapshot.forEach(doc => {
        const user = doc.data();
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');
        userCard.innerHTML = `
            <h3>${user.name}</h3>
            <p>البريد الإلكتروني: ${user.email}</p>
            <p>الحالة: ${user.isBlocked ? 'موقوف' : 'مفعل'}</p>
            <button onclick="blockAccount('${doc.id}')">${user.isBlocked ? 'إلغاء الإيقاف' : 'إيقاف الحساب'}</button>
            <button onclick="resetPassword('${doc.id}')">إعادة تعيين كلمة المرور</button>
            <button onclick="deleteAccount('${doc.id}')">حذف الحساب</button>
            <button onclick="showUserAccount('${doc.id}')">عرض الحساب</button>
        `;
        userList.appendChild(userCard);
    });
});

async function blockAccount(userId) {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const isBlocked = userDoc.data().isBlocked;
    await updateDoc(userRef, {
        isBlocked: !isBlocked
    });
    document.getElementById('load-users').click();
}

async function resetPassword(userId) {
    // منطق إعادة تعيين كلمة المرور
}

async function deleteAccount(userId) {
    await deleteDoc(doc(db, 'users', userId));
    document.getElementById('load-users').click();
}

async function showUserAccount(userId) {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    document.getElementById('user-account').style.display = 'block';
    document.getElementById('account-info').innerHTML = `
        <p>الاسم: ${userData.name}</p>
        <p>البريد الإلكتروني: ${userData.email}</p>
        <p>الحالة: ${userData.isBlocked ? 'موقوف' : 'مفعل'}</p>
    `;
}
