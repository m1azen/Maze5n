document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const username = localStorage.getItem("username");

  const navbar = document.getElementById("navbar");

  if (isLoggedIn === "true" && username) {
    // إذا كان المستخدم مسجل الدخول
    navbar.innerHTML = `
      <p>Welcome, ${username}!</p>
      <button onclick="logout()">Logout</button>
    `;
  } else {
    // إذا لم يكن مسجل الدخول
    navbar.innerHTML = `
      <button onclick="location.href='login.html'">Login</button>
    `;
  }
});

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  location.reload(); // إعادة تحميل الصفحة لتحديث حالة تسجيل الدخول
}
