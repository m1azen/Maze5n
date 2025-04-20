document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn !== "true") {
    // إذا لم يكن مسجل الدخول، يتم تحويله إلى صفحة تسجيل الدخول
    window.location.href = "login.html"; // قم بتعديل الرابط حسب اسم صفحة تسجيل الدخول
  }
});
