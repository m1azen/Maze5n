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
