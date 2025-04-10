import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, doc, getDocs, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

// Admin Password
const adminPassword = "ma85rg3z5";
document.getElementById('loginBtn').addEventListener('click', function () {
  const passwordInput = document.getElementById('adminPassword').value.trim();
  if (passwordInput === adminPassword) {
    document.querySelector('.admin-actions').style.display = 'block';
    document.getElementById('loginMessage').textContent = '';
    loadAccounts();
  } else {
    document.getElementById('loginMessage').textContent = 'Invalid Password!';
  }
});

// Load Accounts
async function loadAccounts() {
  const accountsContainer = document.getElementById('accounts');
  accountsContainer.innerHTML = '';

  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);

  snapshot.forEach(doc => {
    const user = doc.data();
    const userElement = document.createElement('div');
    userElement.innerHTML = `
      <p><strong>Username:</strong> ${user.username}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <button onclick="stopAccount('${doc.id}')">Stop Account</button>
      <button onclick="deleteAccount('${doc.id}')">Delete Account</button>
    `;
    accountsContainer.appendChild(userElement);
  });
}

// Stop Account
async function stopAccount(userId) {
  const reason = prompt("Enter reason for stopping the account:");
  const duration = prompt("Enter duration (hours, days, etc):");
  await updateDoc(doc(db, "users", userId), {
    status: `Stopped due to ${reason} for ${duration}`,
  });
  alert("Account stopped successfully!");
  loadAccounts();
}

// Delete Account
async function deleteAccount(userId) {
  await deleteDoc(doc(db, "users", userId));
  alert("Account deleted successfully!");
  loadAccounts();
}
