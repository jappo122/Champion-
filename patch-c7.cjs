// Fix C7 only: add Q5 + Correct answer before closing backtick
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'src', 'content', 'courses.ts'), 'utf8');

const c7Start = '// ===== Course 7: Senior Sales Training (Plus+ required) =====';
const c7End = '// ===== Course 8: Closing & Overcoming Objections =====';
const c7Idx = src.indexOf(c7Start);
const c7EndIdx = src.indexOf(c7End, c7Idx);

const c7Q5s = [
  '\n**Q5:** A customer wants a specific number below your dealership minimum. Best response:\nA) "No, we can\'t do that"\nB) "Let me show you exactly how we arrived at our number and see if we can find creative ways to close the gap"\nC) Walk away from the deal\nD) Accept the loss to make the sale\n**(Correct: B)**',
  '\n**Q5:** A fleet customer mentions they\'re also considering a competitor. You should:\nA) Badmouth the competitor\nB) Acknowledge the competition respectfully and differentiate on value and service, not price alone\nC) Offer an immediate discount\nD) Ignore the mention\n**(Correct: B)**',
  '\n**Q5:** A team member resists coaching after multiple sessions. You should:\nA) Give up on them\nB) Have a direct, private conversation about their goals and whether this role is the right fit\nC) Humiliate them in front of the team\nD) Assign them only low-value leads\n**(Correct: B)**',
  '\n**Q5:** The most important quality in a sales coach is:\nA) Being the best closer on the team\nB) The ability to diagnose skill gaps and provide specific, actionable feedback\nC) Having the most experience\nD) Being liked by everyone\n**(Correct: B)**',
  '\n**Q5:** A customer wants a vehicle sold out nationwide. You should:\nA) Tell them it\'s impossible\nB) Be honest about availability, offer a committed search with updates, and present the closest alternatives\nC) Lie and say it\'s coming next week\nD) Pressure them to buy whatever is on the lot\n**(Correct: B)**',
];

let c7Section = src.slice(c7Idx, c7EndIdx);
let count = 0;

// Find each `,\n      },` or `,\n    ],` pattern in C7 and insert Q5 before the closing `
c7Section = c7Section.replace(/`,\n      }/g, (match) => {
  if (count < 5) {
    const result = c7Q5s[count] + '\n' + match;
    count++;
    return result;
  }
  return match;
});

console.log('C7 Q5s added:', count);
const newSrc = src.slice(0, c7Idx) + c7Section + src.slice(c7EndIdx);
fs.writeFileSync(path.join(__dirname, 'src', 'content', 'courses.ts'), newSrc, 'utf8');

// Verify
const c7check = awkCount(newSrc);
console.log('C7 total Qs after:', c7check);

function awkCount(s) {
  const c7s = s.indexOf(c7Start);
  const c7e = s.indexOf(c7End, c7s);
  const section = s.slice(c7s, c7e);
  return (section.match(/\*\*Q[0-9]:/g) || []).length;
}
