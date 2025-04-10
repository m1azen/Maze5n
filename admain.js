<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>صفحة الادمن</title>
    <script src="https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js"></script>
    <link rel="stylesheet" href="admain.css">
    <script type="module" src="admain.js" defer></script>
</head>
<body>
    <div id="login-screen">
        <div class="login-container">
            <h2>تسجيل الدخول</h2>
            <input type="password" id="password" placeholder="أدخل كلمة المرور" />
            <button id="login-button">دخول</button>
            <p id="error-message" style="color: red; display: none;">كلمة المرور خاطئة!</p>
        </div>
    </div>

    <div id="admin-dashboard" style="display: none;">
        <div class="header">
            <h2>لوحة التحكم</h2>
            <button id="logout-button">تسجيل الخروج</button>
        </div>

        <div class="messages">
            <textarea id="general-message" placeholder="اكتب الرسالة العامة هنا"></textarea>
            <button id="save-general-message">حفظ الرسالة</button>
            <p id="message-status" style="color: blue; display: none;">تم حفظ الرسالة!</p>
        </div>

        <div class="user-actions">
            <button id="load-users">تحميل الحسابات</button>
            <div id="user-list"></div>
        </div>

        <div id="user-account" style="display: none;">
            <h3>تفاصيل الحساب</h3>
            <div id="account-info"></div>
        </div>
    </div>
</body>
</html>
