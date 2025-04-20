const SHEET_ID = "1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo";
const API_KEY = "AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0";


async function fetchUsedIds() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  const rows = data.values || [];
  const ids = new Set();

  for (let i = 1; i < rows.length; i++) {
    ids.add(rows[i][0]); // أول عمود هو الـ ID
  }

  return ids;
}

function generateUniqueId(usedIds) {
  let id;
  do {
    id = Math.floor(1000 + Math.random() * 9000).toString(); // توليد ID من 4 أرقام
  } while (usedIds.has(id));
  return id;
}

async function submitUser(userData) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A1:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: [
        [userData.id, userData.username, userData.email, userData.password, "active"]
      ],
    }),
  });
}

document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const statusMsg = document.getElementById("statusMsg");
  statusMsg.textContent = "Creating account... ⏳";

  try {
    const usedIds = await fetchUsedIds();
    const id = generateUniqueId(usedIds);

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const userData = {
      id,
      username,
      email,
      password,
    };

    await submitUser(userData);

    statusMsg.textContent = `✅ Account created! Your ID: ${id}`;

    setTimeout(() => {
      window.location.reload(); // أو بدّلها بـ window.location.href = "myaccount.html";
    }, 2000);
  } catch (err) {
    console.error("Error:", err);
    statusMsg.textContent = "❌ Something went wrong. Please try again.";
  }
});
