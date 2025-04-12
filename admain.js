// admain.js - Supabase Version

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// إعداد Supabase
const supabaseUrl = "https://obimikymmvrwljbpmnxb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaW1pa3ltbXZyd2xqYnBtbnhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTk3MDgsImV4cCI6MjA2MDAzNTcwOH0.iwAiOK8xzu3b2zau-CfubioYdU9Dzmj5UjsbOldZbsw";
const supabase = createClient(supabaseUrl, supabaseKey);

// تحميل الحسابات
async function loadAccounts() {
  const { data: users, error } = await supabase.from("users").select("id, username, email, isActive, blockReason, allowLessons, messageToUser, examResults");

  if (error) return alert("فشل في تحميل الحسابات: " + error.message);

  const tableBody = document.getElementById("usersTableBody");
  tableBody.innerHTML = "";

  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username || "---"}</td>
      <td>${user.email}</td>
      <td>${user.isActive ? "نشط" : "موقوف"}</td>
      <td>${user.blockReason || "---"}</td>
      <td>
        <button onclick="editUser('${user.id}')">✏️</button>
        <button onclick="blockUser('${user.id}')">🚫</button>
        <button onclick="deleteUser('${user.id}')">🗑️</button>
        <button onclick="addExam('${user.id}')">📊</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// إيقاف المستخدم
async function blockUser(userId) {
  const reason = prompt("❗ اكتب سبب الإيقاف:");
  if (!reason) return;
  await supabase.from("users").update({ isActive: false, blockReason: reason }).eq("id", userId);
  loadAccounts();
}

// حذف المستخدم
async function deleteUser(userId) {
  if (!confirm("❗ هل أنت متأكد من حذف المستخدم؟")) return;
  await supabase.from("users").delete().eq("id", userId);
  loadAccounts();
}

// تعديل المستخدم
async function editUser(userId) {
  const username = prompt("اسم المستخدم الجديد:");
  const email = prompt("البريد الإلكتروني الجديد:");
  const allowLessons = confirm("هل يُسمح له بدخول صفحة الدروس؟");
  const message = prompt("رسالة تظهر له عند محاولة الدخول:");

  await supabase.from("users").update({ username, email, allowLessons, messageToUser: message }).eq("id", userId);
  loadAccounts();
}

// إضافة درجة
async function addExam(userId) {
  const examName = prompt("اسم الامتحان:");
  const totalScore = Number(prompt("الدرجة الكلية:"));
  const obtainedScore = Number(prompt("الدرجة التي حصل عليها:"));

  const { data: userData, error } = await supabase.from("users").select("examResults").eq("id", userId).single();
  const currentResults = userData.examResults || [];

  currentResults.push({ examName, totalScore, obtainedScore });

  await supabase.from("users").update({ examResults: currentResults }).eq("id", userId);
  loadAccounts();
}

// تشغيل
window.addEventListener("DOMContentLoaded", loadAccounts);
