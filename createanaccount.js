const SHEET_ID = "1tpF88JKEVxgx_5clrUWBNry4htp1QtSJAvMll2np1Mo";
const SHEET_NAME = "Sheet1";
const API_KEY = "AIzaSyBm2J_GO7yr3nk6G8t6YtB3UAlod8V2oR0";

async function submitUser(userData) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A1:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
  
  const response = await fetch(url, {
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

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Failed to save data to Google Sheets: ${errorDetails}`);
  }
}

async function fetchUsedIds() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A:A?key=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch used IDs.");
  }

  const data = await response.json();
  const rows = data.values || [];
  const ids = new Set();

  for (let i = 1; i < rows.length; i++) {
    ids.add(rows[i][0]); // جمع المعرفات
  }

  return ids;
}

function generateUniqueId(usedIds) {
  let id;
  do {
    id = Math.floor(1000 + Math.random() * 9000).toString();
  } while (usedIds.has(id)); // التأكد من أن المعرف غير مستخدم
  return id;
}

document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const statusMsg = document.getElementById("statusMsg");
  statusMsg.style.color = "white";
  statusMsg.textContent = "Creating account... ⏳";

  try {
    const usedIds = await fetchUsedIds(); // جلب المعرفات القديمة
    const id = generateUniqueId(usedIds); // إنشاء معرف فريد

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const userData = { id, username, email, password };

    await submitUser(userData);

    statusMsg.style.background = "#00ffcc";
    statusMsg.textContent = `✅ Account created successfully! Your ID: ${id}`;

    setTimeout(() => {
      window.location.href = "/html.html"; // الانتقال إلى صفحة "حسابي"
    }, 3000);
  } catch (err) {
    console.error("Error:", err);

    statusMsg.style.background = "red";
    statusMsg.textContent = "❌ Something went wrong while saving. Contact Mazen for support.";
    
    const contactButton = document.createElement("button");
    contactButton.textContent = "Contact Mazen";
    contactButton.style.marginTop = "10px";
    contactButton.style.padding = "10px";
    contactButton.style.backgroundColor = "#005bea";
    contactButton.style.color = "white";
    contactButton.style.border = "none";
    contactButton.style.borderRadius = "5px";
    contactButton.style.cursor = "pointer";

    contactButton.addEventListener("click", () => {
      window.location.href = "https://wa.me/qr/CZO3X7WAZOEEE1"; // رابط التواصل
    });

    statusMsg.appendChild(contactButton);
  }
});
