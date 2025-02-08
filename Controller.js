// Controller.js

import { getFoodByCode } from './model.js';

// ตัวแปรในการเก็บข้อมูลรายงาน
let report = {
  fresh: { valid: 0, expired: 0 },
  pickled: { valid: 0, expired: 0 },
  canned: { valid: 0, expired: 0 },
  totalChecked: 0,
  totalExpired: 0,
  totalValid: 0
};

// Function to check expiration date based on food type
const checkExpiration = (expirationDate, foodType) => {
  const today = new Date();
  const [day, month, year] = expirationDate.split('/').map(Number);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    console.error('Invalid expiration date format');
    return 'unknown';
  }

  const foodDate = new Date(year, month - 1, day);

  switch (foodType) {
    case 'fresh':
      return today > foodDate ? 'expired' : 'valid';
    case 'pickled':
      const pickledDate = new Date(year, month - 1, 1); // Only month/year matters for pickled
      return today > pickledDate ? 'expired' : 'valid';
    case 'canned':
      const cannedDate = new Date(year, 11, 31); // End of the year
      cannedDate.setMonth(cannedDate.getMonth() + 9); // Add 9 months to it
      return today > cannedDate ? 'expired' : 'valid';
    default:
      return 'unknown';
  }
};

// ฟังก์ชันอัปเดตรายงาน
const updateReport = (foodType, expirationStatus) => {
  if (foodType && expirationStatus) {
    report.totalChecked++;
    if (expirationStatus === 'expired') {
      report.totalExpired++;
      report[foodType].expired++;
    } else if (expirationStatus === 'valid') {
      report.totalValid++;
      report[foodType].valid++;
    }
  }
};

// Event listener for checking expiration date
document.getElementById("checkExpirationBtn").addEventListener("click", () => {
  const code = document.getElementById("foodCodeInput").value;
  if (!/^[1-9][0-9]{5}$/.test(code)) {
    alert("Invalid Food Coad! It must be an 6-digit number not starting with 0.");
    return;
  }
  const foodItem = getFoodByCode(code);

  if (foodItem) {
    const expirationStatus = checkExpiration(foodItem['Expiration Date'], foodItem['Food Type']);

    // Update the report with the food type and expiration status
    updateReport(foodItem['Food Type'], expirationStatus);
    const today = new Date();

    // แสดงผลลัพธ์
    document.getElementById("code").textContent = `Food Code: ${code}`;
    document.getElementById("type").textContent = `Food Type: ${foodItem['Food Type']}`;
    document.getElementById("Today").textContent = `today: ${today}`;
    document.getElementById("ExpirationDate").textContent = `Expiration Date: ${foodItem['Expiration Date']}`;
    document.getElementById("result").textContent = `Expiration Status: ${expirationStatus}`;

    // อัปเดตรายงานการตรวจสอบ
    document.getElementById("report").textContent = `
      Total Checked: ${report.totalChecked}
      | Fresh: ${report.fresh.valid} Valid, ${report.fresh.expired} Expired
      | Pickled: ${report.pickled.valid} Valid, ${report.pickled.expired} Expired
      | Canned: ${report.canned.valid} Valid, ${report.canned.expired} Expired
      | Total Valid: ${report.totalValid}, Total Expired: ${report.totalExpired}
    `;
  } else {
    alert('Food code not found!');
  }
});

