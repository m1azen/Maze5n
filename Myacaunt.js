document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = true; // Example login check
  const userAverage = 75; // Example average score
  const isTopUser = true; // Example top user check

  const accountPage = document.getElementById('accountPage');
  const loginCheck = document.getElementById('loginCheck');
  const logoutButton = document.getElementById('logoutButton');
  const motivationMessage = document.getElementById('motivationMessage');
  const averageScoreCircle = document.querySelector('.animated-circle');
  const balloons = document.getElementById('balloons');

  // Login check
  if (isLoggedIn) {
    accountPage.style.display = 'block';
    loginCheck.style.display = 'none';
  } else {
    accountPage.style.display = 'none';
    loginCheck.style.display = 'flex';
  }

  // Logout button
  logoutButton.addEventListener('click', () => {
    alert('You have logged out successfully.');
    window.location.href = '/login'; // Redirect to login page
  });

  // Display balloons if top user
  if (isTopUser) {
    balloons.classList.remove('hidden');
    motivationMessage.textContent = "You're the best! Keep shining! 🎉";
  } else if (userAverage < 50) {
    motivationMessage.textContent = 'Keep going! You can achieve great results!';
  } else {
    motivationMessage.textContent = 'Well done! Keep maintaining this level!';
  }

  // Set average grades circle
  averageScoreCircle.style.setProperty('--percentage', `${userAverage}%`);
  document.getElementById('averageScore').textContent = `${userAverage}%`;

  // Load dummy exam results
  const examTable = document.getElementById('examTable');
  examTable.innerHTML = `
    <tr><td>Math</td><td>100</td><td>85</td><td>Pass</td></tr>
    <tr><td>Science</td><td>100</td><td>90</td><td>Pass</td></tr>
    <tr><td>History</td><td>100</td><td>70</td><td>Pass</td></tr>
  `;
});
