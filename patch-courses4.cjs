// Patch Course 2 (+Q5), Course 6 (full rewrite), Course 7 (+Q5)
const fs = require('fs');
const path = require('path');
const coursesPath = path.join(__dirname, 'src', 'content', 'courses.ts');
const lessonsDir = path.join(__dirname, 'lessons');
let src = fs.readFileSync(coursesPath, 'utf8');

// Helper: write lesson content from .txt file (for Course 6)
function drillLesson(id, title, desc, file) {
  const raw = fs.readFileSync(path.join(lessonsDir, file), 'utf8').trim();
  const esc = raw.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  return `      {
        id: "${id}",
        title: "${title}",
        description: "${desc}",
        duration: "5 min",
        content: \`${esc}\`,
      }`;
}

// Helper: add Q5 before the closing backtick of a lesson content string
// Matches the last ``` (end of Answers block) before closing backtick
function addQ5(content, q5Text) {
  // Find the last occurrence of a line like "5. ..." in the Answers section,
  // then find the closing backtick after it
  // Pattern: look for the end of Answers section, then insert Q5 before closing
  const lastAnswer = content.lastIndexOf('**Answers:**');
  if (lastAnswer === -1) return content;
  // Find the closing backtick after the last answer
  const closingBt = content.indexOf('`', lastAnswer);
  if (closingBt === -1) return content;
  return content.slice(0, closingBt) + '\n' + q5Text + '\n' + content.slice(closingBt);
}

// ===== COURSE 2: Add Q5 to each of 10 lessons =====
const c2StartMarker = '// ===== Course 2: 10 Steps of the Sale Part 2 (Quiz) =====';
const c2EndMarker = '// ===== Course 3:';
let c2Idx = src.indexOf(c2StartMarker);
let c2EndIdx = src.indexOf(c2EndMarker, c2Idx);
if (c2Idx === -1 || c2EndIdx === -1) { console.error('C2 markers not found'); process.exit(1); }

const c2Q5s = [
  '\n**Q5:** What is the single best predictor of whether a customer will buy from you?\nA) The price you offer\nB) How quickly you build genuine rapport and trust\nC) The specific vehicle they looked at first\nD) The weather on the day of their visit\n\n**Answers:** 5. B — Trust and rapport built in the first moments predict purchase intent more than any other factor.',
  '\n**Q5:** A customer gives vague, short answers to your qualification questions. You should:\nA) Accept the answers and move on\nB) Ask more specific, open-ended follow-ups like "Tell me more about that"\nC) Guess what they need\nD) Skip to the test drive\n\n**Answers:** 5. B — Vague answers signal a need for deeper, more specific follow-up questions.',
  '\n**Q5:** What is the biggest mistake during vehicle presentation?\nA) Showing too many vehicles\nB) Presenting features the customer never said they cared about\nC) Letting the customer touch the controls\nD) Standing too close to the vehicle\n\n**Answers:** 5. B — Irrelevant features waste time and signal you weren\'t listening during qualification.',
  '\n**Q5:** A customer seems uncomfortable during the test drive. You should:\nA) Talk more to distract them\nB) Ask "How are you feeling about the driving position? Would you like to adjust anything?"\nC) End the test drive immediately\nD) Ignore it and keep going\n\n**Answers:** 5. B — Address discomfort directly; a small adjustment can turn the experience around.',
  '\n**Q5:** A customer refuses to discuss their trade-in. You should:\nA) Insist on seeing it\nB) Respect their decision and proceed with the new car discussion only\nC) Refuse to sell them a car\nD) Lower the new car price to compensate\n\n**Answers:** 5. B — Some customers prefer to handle trade-in separately; don\'t let it block the sale.',
  '\n**Q5:** Why should you present price from MSRP down rather than starting with the lowest number?\nA) It\'s legally required\nB) It creates a perception of getting a deal as each discount is revealed\nC) Customers prefer higher numbers first\nD) It makes negotiations longer\n\n**Answers:** 5. B — Descending from MSRP creates a psychological sense of savings at each step.',
  '\n**Q5:** A customer says yes but their body language says no. You should:\nA) Celebrate the sale immediately\nB) Pause and say "You seem hesitant — is there something you\'re unsure about?"\nC) Ignore body language and focus on words\nD) Offer a discount\n\n**Answers:** 5. B — Body language tells the truth; address unspoken concerns before finalizing.',
  '\n**Q5:** What information should you share with the F&I manager before the handoff?\nA) Nothing — they\'ll figure it out\nB) The customer\'s priorities, budget range, and any concerns they expressed\nC) Only the vehicle price\nD) The customer\'s credit score\n\n**Answers:** 5. B — Briefing F&I on customer priorities ensures a seamless, personalized experience.',
  '\n**Q5:** What should you do if you discover a delivery issue (e.g., a scratch on the vehicle)?\nA) Hide it and hope the customer doesn\'t notice\nB) Point it out proactively, apologize, and explain how you\'ll resolve it\nC) Blame the detail team\nD) Delay delivery without explanation\n\n**Answers:** 5. B — Proactive honesty about issues builds more trust than hoping they go unnoticed.',
  '\n**Q5:** A customer you sold a car to 6 months ago calls with a minor complaint. You should:\nA) Transfer them to service and move on\nB) Listen, empathize, and personally help resolve the issue — this is a referral opportunity\nC) Tell them it\'s not your problem anymore\nD) Ignore the call\n\n**Answers:** 5. B — Every post-sale interaction is a chance to earn referrals and repeat business.',
];

let c2Section = src.slice(c2Idx, c2EndIdx);
// Find each lesson content area and add Q5
// The lessons in Course 2 have content: `...` patterns
// We need to find the closing backtick of each lesson's content
// Strategy: split on "### Quick Quiz" and work from there
// Simpler: find each `\n**Q4:` in order and insert Q5 after the Answers section

// Actually, let's use a regex approach: find each Q4, then after its Answers block add Q5
// Pattern: after a Q4 block, there's a **Answers:** block ending with `\n\n` then next lesson or end
let qCount = 0;
c2Section = c2Section.replace(/5\. [^\n]+(?=\n\n---|\n\n\*\*Q1|\n`,\n|\n`\n)/g, (match) => {
  if (qCount < 10) {
    const replacement = match + c2Q5s[qCount];
    qCount++;
    return replacement;
  }
  return match;
});

// If the regex didn't work, let's try a simpler approach
if (qCount === 0) {
  // Fallback: find each answer block and insert
  const parts = c2Section.split('**Answers:**');
  // parts[0] is before first Answers, then each part has "5. ..." then backtick
  // We need to insert Q5 before the closing backtick of each lesson
  // Let me try finding all ``` (closing code blocks) after Answers sections
  let newSection = '';
  let qi = 0;
  // Split more carefully
  let lastIdx = 0;
  // Find each occurrence of "**Answers:**" and look for the next closing ` that ends the content
  const re = /\*\*Answers:\*\*\n([\s\S]*?)`,\n\s*}/g;
  let match;
  let result = '';
  let lastEnd = 0;
  while ((match = re.exec(c2Section)) !== null) {
    const before = c2Section.slice(lastEnd, match.index);
    const fullMatch = match[0];
    const answersBlock = match[1];
    // Find the last "5. " line in the answers block
    const lastAnswer5 = answersBlock.lastIndexOf('5. ');
    if (lastAnswer5 !== -1 && qi < 10) {
      // Insert Q5 right before the closing `
      const newMatch = fullMatch.replace('`,\n  }', c2Q5s[qi] + '\n`,\n  }');
      result += before + newMatch;
      qi++;
    } else {
      result += before + fullMatch;
    }
    lastEnd = match.index + match[0].length;
  }
  result += c2Section.slice(lastEnd);
  if (qi > 0) c2Section = result;
}

src = src.slice(0, c2Idx) + c2Section + src.slice(c2EndIdx);

// ===== COURSE 6: Full rewrite with drill files =====
const c6Start = '// ===== Course 6: Sales Drills (existing, kept as-is) =====';
const c6End = '// ===== Course 7: Senior Sales Training (Plus+ required) =====';
let c6Idx = src.indexOf(c6Start);
let c6EndIdx = src.indexOf(c6End);
if (c6Idx === -1 || c6EndIdx === -1) { console.error('C6 markers not found'); process.exit(1); }

const c6 = `// ===== Course 6: Sales Drills (expanded with 5 MCQs per lesson) =====
  {
    id: "sales-drills",
    title: "5-Minute Sales Drills",
    subtitle: "Quick, focused modules for every step of the sale",
    description:
      "Bite-sized 5-minute training modules covering each step of the automotive sales process. Each module includes detailed strategy breakdowns and 5 multiple-choice quiz questions to sharpen your skills. Perfect for daily practice.",
    levels: "Beginner",
    duration: "2 hours",
    lessons: 10,
    image: "drills",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    lessonsList: [
${drillLesson('drill-greeting', 'Step 1: Meet & Greet', 'Master the 10-second first impression that sets the tone.', 'drill-1.txt')},
${drillLesson('drill-qualification', 'Step 2: Qualification', 'Uncover the customer\'s true needs in 2 minutes.', 'drill-2.txt')},
${drillLesson('drill-presentation', 'Step 3: Vehicle Presentation', 'Connect features to customer needs with the FAB method.', 'drill-3.txt')},
${drillLesson('drill-test-drive', 'Step 4: Test Drive', 'Guide the test drive that builds emotional ownership.', 'drill-4.txt')},
${drillLesson('drill-trade-in', 'Step 5: Trade-In Appraisal', 'Handle trade-in discussions transparently and professionally.', 'drill-5.txt')},
${drillLesson('drill-price', 'Step 6: Price Presentation', 'Present pricing that builds value and protects gross.', 'drill-6.txt')},
${drillLesson('drill-closing', 'Step 7: Closing', 'Guide customers to a confident yes.', 'drill-7.txt')},
${drillLesson('drill-fni', 'Step 8: F&I Introduction', 'Transition customers to F&I smoothly.', 'drill-8.txt')},
${drillLesson('drill-delivery', 'Step 9: Delivery', 'Create a memorable delivery experience.', 'drill-9.txt')},
${drillLesson('drill-follow-up', 'Step 10: Follow-Up', 'Build systematic follow-up for repeat business and referrals.', 'drill-10.txt')},
    ],
  },`;

src = src.slice(0, c6Idx) + c6 + '\n' + src.slice(c6EndIdx);

// ===== COURSE 7: Add Q5 to each of 5 lessons =====
const c7Start = '// ===== Course 7: Senior Sales Training (Plus+ required) =====';
const c7End = '// ===== Course 8: Closing & Overcoming Objections =====';
let c7Idx = src.indexOf(c7Start);
let c7EndIdx = src.indexOf(c7End);
if (c7Idx === -1 || c7EndIdx === -1) { console.error('C7 markers not found'); process.exit(1); }

const c7Q5s = [
  '\n**Q5:** A customer wants a specific number that\'s below your dealership\'s minimum. The best senior-level response is:\nA) "No, we can\'t do that"\nB) "Let me show you exactly how we arrived at our number and see if we can find creative ways to close the gap"\nC) Walk away from the deal\nD) Accept the loss to make the sale\n**(Correct: B)**',
  '\n**Q5:** A fleet customer mentions they\'re also considering a competitor. You should:\nA) Badmouth the competitor\nB) Acknowledge the competition respectfully and differentiate on value and service, not price alone\nC) Offer an immediate discount\nD) Ignore the mention\n**(Correct: B)**',
  '\n**Q5:** A team member resists your coaching after multiple sessions. You should:\nA) Give up on them\nB) Have a direct, private conversation about their goals and whether this role is the right fit\nC) Humiliate them in front of the team\nD) Assign them only to low-value leads\n**(Correct: B)**',
  '\n**Q5:** The most important quality in a sales coach is:\nA) Being the best closer on the team\nB) The ability to diagnose skill gaps and provide specific, actionable feedback\nC) Having the most experience\nD) Being liked by everyone\n**(Correct: B)**',
  '\n**Q5:** A customer wants a vehicle that\'s sold out nationwide. You should:\nA) Tell them it\'s impossible\nB) Be honest about availability, offer a committed search with updates, and present the closest available alternatives\nC) Lie and say it\'s coming next week\nD) Pressure them to buy whatever is on the lot\n**(Correct: B)**',
];

let c7Section = src.slice(c7Idx, c7EndIdx);
// Find each lesson's closing backtick and insert Q5 before it
// Course 7 lessons end with `,\n  } or `\n    },
// Use regex to find the content closing: **Answers:** block ending with \`,\n
// Actually, let's find each "**Answers:**" and work from there
let qi7 = 0;
const c7Result = c7Section.replace(/\*\*Answers:\*\*\n([\s\S]*?)`,\n/g, (match, answers) => {
  if (qi7 < 5) {
    const replacement = '**Answers:**\n' + answers + c7Q5s[qi7] + '\n`,\n';
    qi7++;
    return replacement;
  }
  return match;
});
if (qi7 > 0) c7Section = c7Result;

src = src.slice(0, c7Idx) + c7Section + src.slice(c7EndIdx);

fs.writeFileSync(coursesPath, src, 'utf8');
console.log('All patches applied! Q5s added to C2:', qCount, 'C7:', qi7, 'C6: full rewrite. Length:', src.length);
