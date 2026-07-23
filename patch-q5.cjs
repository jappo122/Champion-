// Fix C2 and C7: add Q5 before closing backtick of each lesson
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'src', 'content', 'courses.ts'), 'utf8');

// Course 2 Q5s (one per lesson)
const c2Q5s = [
  '\n**Q5:** What is the single best predictor of whether a customer will buy from you?\nA) The price you offer\nB) How quickly you build genuine rapport and trust\nC) The specific vehicle they looked at first\nD) The weather on the day of their visit\n*Answer: B — Trust and rapport built in the first moments predict purchase intent more than any other factor.*',
  '\n**Q5:** A customer gives vague, short answers to your qualification questions. You should:\nA) Accept the answers and move on\nB) Ask more specific, open-ended follow-ups like "Tell me more about that"\nC) Guess what they need\nD) Skip to the test drive\n*Answer: B — Vague answers signal a need for deeper, more specific follow-up questions.*',
  '\n**Q5:** What is the biggest mistake during vehicle presentation?\nA) Showing too many vehicles\nB) Presenting features the customer never said they cared about\nC) Letting the customer touch the controls\nD) Standing too close to the vehicle\n*Answer: B — Irrelevant features waste time and signal you weren\'t listening during qualification.*',
  '\n**Q5:** A customer seems uncomfortable during the test drive. You should:\nA) Talk more to distract them\nB) Ask "How are you feeling about the driving position? Would you like to adjust anything?"\nC) End the test drive immediately\nD) Ignore it and keep going\n*Answer: B — Address discomfort directly; a small adjustment can turn the experience around.*',
  '\n**Q5:** A customer refuses to discuss their trade-in. You should:\nA) Insist on seeing it\nB) Respect their decision and proceed with the new car discussion only\nC) Refuse to sell them a car\nD) Lower the new car price to compensate\n*Answer: B — Some customers prefer to handle trade-in separately; don\'t let it block the sale.*',
  '\n**Q5:** Why should you present price from MSRP down rather than starting with the lowest number?\nA) It\'s legally required\nB) It creates a perception of getting a deal as each discount is revealed\nC) Customers prefer higher numbers first\nD) It makes negotiations longer\n*Answer: B — Descending from MSRP creates a psychological sense of savings at each step.*',
  '\n**Q5:** A customer says yes but their body language says no. You should:\nA) Celebrate the sale immediately\nB) Pause and say "You seem hesitant — is there something you\'re unsure about?"\nC) Ignore body language and focus on words\nD) Offer a discount\n*Answer: B — Body language tells the truth; address unspoken concerns before finalizing.*',
  '\n**Q5:** What information should you share with the F&I manager before the handoff?\nA) Nothing — they\'ll figure it out\nB) The customer\'s priorities, budget range, and any concerns they expressed\nC) Only the vehicle price\nD) The customer\'s credit score\n*Answer: B — Briefing F&I on customer priorities ensures a seamless, personalized experience.*',
  '\n**Q5:** What should you do if you discover a delivery issue (e.g., a scratch on the vehicle)?\nA) Hide it and hope the customer doesn\'t notice\nB) Point it out proactively, apologize, and explain how you\'ll resolve it\nC) Blame the detail team\nD) Delay delivery without explanation\n*Answer: B — Proactive honesty about issues builds more trust than hoping they go unnoticed.*',
  '\n**Q5:** A customer you sold a car to 6 months ago calls with a minor complaint. You should:\nA) Transfer them to service and move on\nB) Listen, empathize, and personally help resolve the issue — this is a referral opportunity\nC) Tell them it\'s not your problem anymore\nD) Ignore the call\n*Answer: B — Every post-sale interaction is a chance to earn referrals and repeat business.*',
];

// Course 7 Q5s
const c7Q5s = [
  '\n**Q5:** A customer wants a specific number below your dealership\'s minimum. Best response:\nA) "No, we can\'t do that"\nB) "Let me show you exactly how we arrived at our number and see if we can find creative ways to close the gap"\nC) Walk away from the deal\nD) Accept the loss to make the sale\n**(Correct: B)**',
  '\n**Q5:** A fleet customer mentions they\'re also considering a competitor. You should:\nA) Badmouth the competitor\nB) Acknowledge the competition respectfully and differentiate on value and service, not price alone\nC) Offer an immediate discount\nD) Ignore the mention\n**(Correct: B)**',
  '\n**Q5:** A team member resists coaching after multiple sessions. You should:\nA) Give up on them\nB) Have a direct, private conversation about their goals and whether this role is the right fit\nC) Humiliate them in front of the team\nD) Assign them only low-value leads\n**(Correct: B)**',
  '\n**Q5:** The most important quality in a sales coach is:\nA) Being the best closer on the team\nB) The ability to diagnose skill gaps and provide specific, actionable feedback\nC) Having the most experience\nD) Being liked by everyone\n**(Correct: B)**',
  '\n**Q5:** A customer wants a vehicle sold out nationwide. You should:\nA) Tell them it\'s impossible\nB) Be honest about availability, offer a committed search with updates, and present the closest alternatives\nC) Lie and say it\'s coming next week\nD) Pressure them to buy whatever is on the lot\n**(Correct: B)**',
];

// ===== Fix Course 2 =====
const c2Start = '// ===== Course 2: 10 Steps of the Sale Part 2 (Quiz) =====';
const c2End = '// ===== Course 3:';
let c2Idx = src.indexOf(c2Start);
let c2EndIdx = src.indexOf(c2End, c2Idx);

// For C2, each lesson closes with: *Answer: ...*`,\n      },
// We need to insert Q5 before the closing `
let c2Section = src.slice(c2Idx, c2EndIdx);
let qi = 0;
// Match the end of Q4's answer right before the closing backtick
// Pattern: *Answer: ...anything...*`  followed by ,\n      }
c2Section = c2Section.replace(/\*Answer: [A-D] — [^*]+\*`/g, (match) => {
  if (qi < 10) {
    return match.slice(0, -1) + c2Q5s[qi] + '\n`';
    qi++;
  }
  return match;
});

console.log('C2 Q5s added:', qi);
let newSrc = src.slice(0, c2Idx) + c2Section + src.slice(c2EndIdx);

// ===== Fix Course 7 =====
const c7Start = '// ===== Course 7: Senior Sales Training (Plus+ required) =====';
const c7End = '// ===== Course 8: Closing & Overcoming Objections =====';
let c7Idx = newSrc.indexOf(c7Start);
let c7EndIdx = newSrc.indexOf(c7End, c7Idx);

let c7Section = newSrc.slice(c7Idx, c7EndIdx);
let qj = 0;
// C7 lessons end with: **(Correct: X)**`,\n      },
c7Section = c7Section.replace(/\(\*\*Correct: [A-D]\*\*\)`/g, (match) => {
  if (qj < 5) {
    return match.slice(0, -1) + c7Q5s[qj] + '\n`';
    qj++;
  }
  return match;
});

console.log('C7 Q5s added:', qj);
let finalSrc = newSrc.slice(0, c7Idx) + c7Section + newSrc.slice(c7EndIdx);

fs.writeFileSync(path.join(__dirname, 'src', 'content', 'courses.ts'), finalSrc, 'utf8');
console.log('Done. Final length:', finalSrc.length);
