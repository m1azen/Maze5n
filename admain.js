import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// إعداد اتصال Supabase
const SUPABASE_URL = 'https://obimikymmvrwljbpmnxb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaW1pa3ltbXZyd2xqYnBtbnhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTk3MDgsImV4cCI6MjA2MDAzNTcwOH0.iwAiOK8xzu3b2zau-CfubioYdU9Dzmj5UjsbOldZbsw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let selectedUserId = null;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // جلب بيانات المستخدمين
    const { data: users, error } = await supabase.from('users').select('*');

    if (error) {
      console.error("Error fetching users:", error.message);
      return;
    }

    const usersTable = document.getElementById('usersTable');

    // عرض بيانات المستخدمين في الجدول
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.status}</td>
        <td>
          <button onclick="showSuspendOverlay(${user.id})">إيقاف</button>
          <button onclick="showAddExamOverlay(${user.id})">إضافة درجات</button>
        </td>
      `;
      usersTable.appendChild(row);
    });
  } catch (error) {
    console.error("Error initializing admin panel:", error.message);
  }
});

// إظهار نافذة الإيقاف
function showSuspendOverlay(userId) {
  selectedUserId = userId;
  document.getElementById('suspendOverlay').style.display = 'flex';

  document.getElementById('confirmSuspend').onclick = async () => {
    const reason = document.getElementById('suspendReason').value.trim();
    if (!reason) return alert("يرجى إدخال سبب الإيقاف.");
    await supabase.from('users').update({ status: `موقوف: ${reason}` }).eq('id', selectedUserId);
    alert("تم إيقاف الحساب بنجاح.");
    location.reload();
  };

  document.getElementById('cancelSuspend').onclick = () => {
    document.getElementById('suspendOverlay').style.display = 'none';
  };
}

// إظهار نافذة إضافة الدرجات
function showAddExamOverlay(userId) {
  selectedUserId = userId;
  document.getElementById('addExamOverlay').style.display = 'flex';

  document.getElementById('confirmAddExam').onclick = async () => {
    const examName = document.getElementById('examName').value.trim();
    const totalMarks = parseInt(document.getElementById('totalMarks').value, 10);
    const obtainedMarks = parseInt(document.getElementById('obtainedMarks').value, 10);

    if (!examName || isNaN(totalMarks) || isNaN(obtainedMarks)) {
      return alert("يرجى ملء جميع الحقول
