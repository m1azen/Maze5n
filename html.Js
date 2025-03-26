document.addEventListener("DOMContentLoaded", function () {
    let image = document.querySelector(".centered-image");
    let moveDirection = 1; // 1 = للأعلى، -1 = للأسفل
    let moveAmount = 1; // تقليل مقدار الحركة بالبكسل
    let maxMove = 10; // تقليل أقصى مسافة للحركة
    let baseTop = image.offsetTop; // تخزين الموضع الأساسي

    function moveImage() {
        let newTop = image.offsetTop + (moveAmount * moveDirection);
        image.style.top = newTop + "px";

        if (Math.abs(newTop - baseTop) >= maxMove) {
            moveDirection *= -1; // تغيير الاتجاه عند الوصول لأقصى نقطة
        }
    }

    setInterval(moveImage, 50); // تحديث الحركة كل 50 مللي ثانية
});

document.addEventListener("DOMContentLoaded", function () {
    let image = document.querySelector(".centered-image");
    let position = 50; // موضع البداية في المنتصف
    let direction = 1; // 1 للأعلى، -1 للأسفل
    let speed = 0.2; // تقليل سرعة الحركة

    function moveImage() {
        if (position <= 45) direction = 1; // إذا وصلت لأعلى، انزل
        if (position >= 55) direction = -1; // إذا وصلت لأسفل، اصعد

        position += direction * speed; // تعديل الموضع
        image.style.top = position + "vh"; // تحريك الصورة عموديًا

        requestAnimationFrame(moveImage); // استدعاء الحركة بشكل متكرر
    }

    moveImage(); // تشغيل الحركة عند تحميل الصفحة
});
function toggleMenu() {
    const navButtons = document.getElementById('navButtons');
    navButtons.style.display = navButtons.style.display === 'flex' ? 'none' : 'flex';
  }
  document.getElementById("accountButton").addEventListener("click", function() {
    const dropdown = document.getElementById("accountDropdown");
    dropdown.classList.toggle("show");
  });
  
// التأكد من حالة تسجيل الدخول عند تحميل الصفحة
window.onload = function () {
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');

  if (username && email) {
    // إظهار بيانات المستخدم
    document.getElementById('displayUsername').textContent = username;
    document.getElementById('displayEmail').textContent = email;
    document.getElementById('accountButton').style.display = 'block';
    document.getElementById('loginButton').style.display = 'none';
    document.getElementById('createAccountButton').style.display = 'none';
  } else {
    // في حالة عدم وجود بيانات
    document.getElementById('accountButton').style.display = 'none';
    document.getElementById('loginButton').style.display = 'block';
    document.getElementById('createAccountButton').style.display = 'block';
  }
};

// إظهار القائمة المنسدلة
document.getElementById('accountButton').addEventListener('click', function () {
  const dropdown = document.getElementById('dropdownContent');
  dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
});

// تسجيل الخروج
function logout() {
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  alert('You have been logged out.');
  window.location.reload();
}
function showAccountDetails() {
  // جلب البيانات من Local Storage
  const username = localStorage.getItem("username") || "Unknown User";
  const email = localStorage.getItem("email") || "Unknown Email";

  // عرض البيانات في رسالة منبثقة
  alert(`Username: ${username}\nEmail: ${email}`);
}
