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
  
  // إغلاق القائمة لو المستخدم ضغط براها
  window.onclick = function(event) {
    if (!event.target.matches('#accountButton')) {
      const dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
        const openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
// تسجيل الدخول وتخزين البيانات
function login(username, email) {
    const userData = {
      username: username,
      email: email,
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    alert('Login successful!');
    window.location.href = 'index.html';
  }
  
  // عرض بيانات المستخدم عند الضغط على "My Account"
  document.getElementById('accountButton').onclick = function() {
    const dropdownContent = document.getElementById('dropdownContent');
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (userData) {
      document.getElementById('displayUsername').textContent = userData.username;
      document.getElementById('displayEmail').textContent = userData.email;
      dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
    } else {
      alert('No account data found. Please log in.');
    }
  };
  
  // تسجيل الخروج
  function logout() {
    localStorage.removeItem('userData');
    alert('Logout successful!');
    window.location.href = 'login.html';
  }
  
  // التأكد من بقاء المستخدم مسجل الدخول
  window.onload = function() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      document.getElementById('accountButton').textContent = `Welcome, ${userData.username}`;
      document.querySelector('button[onclick="window.location.href=\'login.html\'"]').style.display = 'none';
      document.querySelector('button[onclick="window.location.href=\'createanaccount.html\'"]').style.display = 'none';
    }
  };
    
