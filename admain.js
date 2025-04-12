import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// إعداد اتصال Supabase
const SUPABASE_URL = 'https://obimikymmvrwljbpmnxb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaW1pa3ltbXZyd2xqYnBtbnhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTk3MDgsImV4cCI6MjA2MDAzNTcwOH0.iwAiOK8xzu3b2zau-CfubioYdU9Dzmj5UjsbOldZbsw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // جلب بيانات المستخدمين
    const { data: users, error } = await supabase.from('users').select('*');

    if (error) {
      console.error("Error fetching users:", error.message);
      return;
    }

    // تحديث الإحصائيات
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'Active').length;
    const suspendedUsers = users.filter(user => user.status.includes('Suspended')).length;

    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('activeUsers').textContent = activeUsers;
    document.getElementById('suspendedUsers').textContent = suspendedUsers;

    // تحديث جدول المستخدمين
    const usersTable = document.getElementById('usersTable');
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.status}</td>
        <td>
          <button onclick="editUser(${user.id})">Edit</button>
          <button onclick="deleteUser(${user.id})">Delete</button>
        </td>
      `;
      usersTable.appendChild(row);
    });
  } catch (error) {
    console.error("Error initializing admin panel:", error.message);
  }
});

// دوال للتعديل والحذف
function editUser(userId) {
  alert(`Edit user with ID: ${userId}`);
}

function deleteUser(userId) {
  alert(`Delete user with ID: ${userId}`);
}
