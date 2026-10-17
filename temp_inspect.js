const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const lines = content.split('\n');

console.log('=== VERIFYING REMAINING UNWANTED LIGHT TEXT ===');
let foundAny = false;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const num = i + 1;
  // Check for suspicious text colors
  if (/(text-slate-200|text-slate-300)\b/.test(line)) {
    if (num < 935 || num > 1030) {
      // Exclude dark elements like buttons with bg-slate-800
      if (!/(bg-slate-800|bg-slate-900|bg-black)/.test(line)) {
        console.log(`Line ${num}: [SLATE-200/300] ${line.trim()}`);
        foundAny = true;
      }
    }
  }
}
if (!foundAny) {
  console.log('No unwanted text-slate-200/300 found in light backgrounds!');
}

console.log('\n=== VERIFYING DROPDOWN MENU BACKGROUNDS ===');
const dropdownMatches = content.match(/class="[^"]*dropdown-menu[^"]*"/g) || [];
dropdownMatches.forEach((m, idx) => {
  console.log(`Dropdown ${idx + 1}: ${m}`);
});

console.log('\n=== VERIFYING MOBILE MENU BACKGROUND ===');
const mobileMatches = content.match(/id="mobile-menu"[^>]*/g) || [];
mobileMatches.forEach(m => console.log(m));
