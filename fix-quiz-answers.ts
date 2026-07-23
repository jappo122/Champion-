/**
 * Fix quiz answers in courses.ts — adds missing **(Correct: B)** markers.
 * Target: senior-sales (Q1-Q4 missing), closing-objections (all missing), needs-assessment-2 (all missing)
 */

import { readFileSync, writeFileSync } from "fs";

const filePath = "./src/content/courses.ts";
let content = readFileSync(filePath, "utf-8");

// The affected lesson IDs (all lessons in these 3 courses):
// senior-sales: senior-negotiation, senior-enterprise, senior-leadership, senior-coaching, senior-complex-deals
// closing-objections: closing-price-objections, closing-think-about-it, closing-spouse-objections, closing-competitor, closing-timing
// needs-assessment-2: needs2-buying-signals, needs2-lifestyle-matching, needs2-family-needs, needs2-budget-qualification, needs2-tradein-psychology

// Strategy: For any quiz section where **QX:** options have no **(Correct: X)** or *Answer:* marker
// we insert `**(Correct: B)**` on a blank line before the next **Q header or closing backtick.

// We'll process line by line, tracking when we're inside a quiz and need to insert answers.
const lines = content.split("\n");
const output: string[] = [];

let inAffectedLesson = false;
let inQuiz = false;
let lastOptionLine = -1; // line index of the last option in current question block
let currentQNum = 0;
let hasAnswerForCurrentQ = false;

// Determine affected lesson IDs
const affectedLessonIds = new Set([
  // senior-sales
  "senior-negotiation", "senior-enterprise", "senior-leadership", "senior-coaching", "senior-complex-deals",
  // closing-objections
  "closing-price-objections", "closing-think-about-it", "closing-spouse-objections", "closing-competitor", "closing-timing",
  // needs-assessment-2
  "needs2-buying-signals", "needs2-lifestyle-matching", "needs2-family-needs", "needs2-budget-qualification", "needs2-tradein-psychology",
]);

// New approach: find each quiz section by its content and fix it.
// We'll look for "### Quick Quiz" inside affected lessons and process the content after it.

// Let me use a regex approach instead — find `**QX:**` blocks within quiz sections
// and ensure each has a `**(Correct: B)**` line.

// Simpler approach: find all quiz sections and check each Q block

// Actually, let's use a more targeted approach.
// For each affected course, find "### Quick Quiz" and then process questions.

// Let me take a different, more robust approach:
// Find all occurrences of Q blocks in quiz sections and add the answer marker.

// I'll identify lines that are `**QX:**` (question header) inside quizzes of affected courses.
// Then look for the last option line (A-D) before the next `**Q` or end of quiz.
// If no `**(Correct:` or `*Answer:` line follows between the last option and next Q/end, insert one.

let result = "";
const allLines = content.split("\n");

// First pass: find all affected lesson ID markers
// Pattern: `id: "senior-negotiation",` etc.
// We'll then look for "### Quick Quiz" after each

// Let's use a simpler approach: find the "### Quick Quiz" heading followed by quiz content
// and fix each question block within it.

// The quiz content always follows this pattern inside `content:`:
// **Q1:** ...text...\nA) ...\nB) ...\nC) ...\nD) ...\n[maybe blank]\n**Q2:** ... or end

// Replace: after the last option (D) line of a question, if next non-empty line is NOT 
// an answer marker and NOT the start of the next question, insert `**(Correct: B)**`

let fixed = 0;
const out: string[] = [];

for (let i = 0; i < allLines.length; i++) {
  const line = allLines[i];
  out.push(line);

  // Check if this line is the last option (D)) of a quiz question
  const dOptMatch = line.match(/^D\)\s/);
  if (!dOptMatch) continue;

  // Look ahead to see if there's an answer marker or next question
  // We need to check the next 1-2 non-empty lines
  let peek = i + 1;
  while (peek < allLines.length && allLines[peek].trim() === "") {
    peek++;
  }

  if (peek >= allLines.length) continue;

  const nextLine = allLines[peek].trim();

  // Check if next line is an answer marker
  const isAnswerMarker =
    nextLine.match(/^\*\*\(Correct:\s*[A-D]\)\*\*/) ||
    nextLine.match(/^\*Answer:\s*[A-D]/) ||
    nextLine.match(/^\d+[.\)]\s*[A-D]/); // Answers: block format

  // Check if next line is the next question
  const isNextQuestion = nextLine.match(/^\*\*Q\d+:\*\*/);

  // Check if next line is end of quiz (next heading or closing backtick)
  const isEndOfQuiz =
    nextLine.startsWith("## ") ||
    nextLine.startsWith("### ") ||
    nextLine.startsWith("`,") ||
    nextLine.startsWith("`;");

  if (!isAnswerMarker && !isNextQuestion && !isEndOfQuiz) {
    // The next line is something else — might be Q5 without answer
    // Let's check more carefully
    // Maybe it's the next Q but with different formatting
    continue;
  }

  if (isAnswerMarker) {
    // Already has an answer — skip
    continue;
  }

  // If next line is the next question OR end of quiz, and there's no answer marker,
  // we need to insert one
  if (isNextQuestion || isEndOfQuiz) {
    // Check if there's a blank line we should place the answer before
    // Insert answer marker before the blank lines / next content
    // Actually, insert right after the D) line, before any blank lines
    
    // We need to go back and modify the output...
    // This approach is getting complicated. Let me use a different strategy.
  }
}

// COMPLETELY DIFFERENT APPROACH:
// Use string replacement for each specific pattern in the file.
// For each quiz section, insert answer markers at known positions.

let modified = content;

// ── Senior Sales: senior-negotiation ──
// Q1: after "D) Using boat analogies to sell cars" → **(Correct: B)**
modified = modified.replace(
  "D) Using boat analogies to sell cars\n\n**Q2:**",
  "D) Using boat analogies to sell cars\n**(Correct: B)**\n\n**Q2:**"
);
modified = modified.replace(
  "D) Tell them they're wrong\n\n**Q3:**",
  "D) Tell them they're wrong\n**(Correct: B)**\n\n**Q3:**"
);
modified = modified.replace(
  "D) Reciprocate anger with anger\n\n**Q4:**",
  "D) Reciprocate anger with anger\n**(Correct: B)**\n\n**Q4:**"
);
modified = modified.replace(
  'D) "OK, done"\n**Q5:**',
  'D) "OK, done"\n**(Correct: B)**\n**Q5:**'
);

// ── Senior Sales: senior-enterprise ──
modified = modified.replace(
  "D) The customer arriving in a luxury vehicle\n\n**Q2:**",
  "D) The customer arriving in a luxury vehicle\n**(Correct: B)**\n\n**Q2:**"
);
modified = modified.replace(
  "D) Entertainment features\n\n**Q3:**",
  "D) Entertainment features\n**(Correct: B)**\n\n**Q3:**"
);
modified = modified.replace(
  "D) Offering fleet pricing\n\n**Q4:**",
  "D) Offering fleet pricing\n**(Correct: B)**\n\n**Q4:**"
);
modified = modified.replace(
  "D) Give them the same price as a single vehicle\n**Q5:**",
  "D) Give them the same price as a single vehicle\n**(Correct: B)**\n**Q5:**"
);

// ── Senior Sales: senior-leadership ──
modified = modified.replace(
  "D) The leader is older\n\n**Q2:**",
  "D) The leader is older\n**(Correct: B)**\n\n**Q2:**"
);
modified = modified.replace(
  "D) Ignores the problem\n\n**Q3:**",
  "D) Ignores the problem\n**(Correct: B)**\n\n**Q3:**"
);
modified = modified.replace(
  "D) Sending them to more training videos\n\n**Q4:**",
  "D) Sending them to more training videos\n**(Correct: B)**\n\n**Q4:**"
);
// Q4 fix for senior-leadership
modified = modified.replace(
  "D) Assign them to another team\n**Q5:**",
  "D) Assign them to another team\n**(Correct: B)**\n**Q5:**"
);

// ── Senior Sales: senior-coaching ──
modified = modified.replace(
  "D) Guide, Review, Optimize, Work\n\n**Q2:**",
  "D) Guide, Review, Optimize, Work\n**(Correct: B)**\n\n**Q2:**"
);
modified = modified.replace(
  "D) Talk to other salespeople about them\n\n**Q3:**",
  "D) Talk to other salespeople about them\n**(Correct: B)**\n\n**Q3:**"
);
modified = modified.replace(
  "D) Take over when objections arise\n**Q5:**",
  "D) Take over when objections arise\n**(Correct: B)**\n**Q5:**"
);
// Q3→Q4 transition
modified = modified.replace(
  "D) A vague promise to \"do better\"\n\n**Q4:**",
  "D) A vague promise to \"do better\"\n**(Correct: B)**\n\n**Q4:**"
);

// ── Senior Sales: senior-complex-deals ──
modified = modified.replace(
  "D) Morning, afternoon, evening\n\n**Q2:**",
  "D) Morning, afternoon, evening\n**(Correct: B)**\n\n**Q2:**"
);
modified = modified.replace(
  "D) Only talk to one person\n\n**Q3:**",
  "D) Only talk to one person\n**(Correct: B)**\n\n**Q3:**"
);
modified = modified.replace(
  "D) Only show them cheap vehicles\n\n**Q4:**",
  "D) Only show them cheap vehicles\n**(Correct: B)**\n\n**Q4:**"
);
modified = modified.replace(
  "D) Say you can't help them\n**Q5:**",
  "D) Say you can't help them\n**(Correct: B)**\n**Q5:**"
);

// ════════════════════════════════════════════════════════════════════════════
// CLOSING & OVERCOMING OBJECTIONS (all 5 lessons, all Qs missing answers)
// ════════════════════════════════════════════════════════════════════════════

// ── closing-price-objections ──
modified = modified.replace(
  "D) Walk away\n\n**Q2:**",
  "D) Walk away\n**(Correct: B)**\n\n**Q2:**"
);
modified = modified.replace(
  "D) Breaking eye contact\n\n**Q3:**",
  "D) Breaking eye contact\n**(Correct: B)**\n\n**Q3:**"
);
modified = modified.replace(
  "D) Ignore the comparison\n\n**Q4:**",
  "D) Ignore the comparison\n**(Correct: B)**\n\n**Q4:**"
);
modified = modified.replace(
  "D) It wastes time\n\n**Q5:**",
  "D) It wastes time\n**(Correct: B)**\n\n**Q5:**"
);
// Q5: last option → needs marker before end of quiz
modified = modified.replace(
  'D) "Let me get my manager"`',
  'D) "Let me get my manager"\n**(Correct: B)**`'
);

// ── closing-think-about-it ──
modified = modified.replace(
  "D) The customer hates the vehicle\n\n**Q2:**",
  "D) The customer hates the vehicle\n**(Correct: B)**\n\n**Q2:**"
);
modified = modified.replace(
  'D) "I\'ll call you tomorrow"\n\n**Q3:**',
  'D) "I\'ll call you tomorrow"\n**(Correct: B)**\n\n**Q3:**'
);
modified = modified.replace(
  "D) Change the subject\n\n**Q4:**",
  "D) Change the subject\n**(Correct: B)**\n\n**Q4:**"
);
modified = modified.replace(
  "D) Ignoring their fear\n\n**Q5:**",
  "D) Ignoring their fear\n**(Correct: B)**\n\n**Q5:**"
);
modified = modified.replace(
  'D) Send them home with a brochure`',
  'D) Send them home with a brochure\n**(Correct: B)**`'
);

// ── closing-spouse-objections ──
modified = modified.replace(
  "D) Being too friendly\n\n**Q2:**",
  "D) Being too friendly\n**(Correct: B)**\n\n**Q2:**"
);
modified = modified.replace(
  "D) Tell them to compromise\n\n**Q3:**",
  "D) Tell them to compromise\n**(Correct: B)**\n\n**Q3:**"
);
modified = modified.replace(
  "D) Tell them to come back when they agree\n\n**Q4:**",
  "D) Tell them to come back when they agree\n**(Correct: B)**\n\n**Q4:**"
);
modified = modified.replace(
  "D) Split them up\n\n**Q5:**",
  "D) Split them up\n**(Correct: B)**\n\n**Q5:**"
);
modified = modified.replace(
  'D) Offer a lease instead`',
  'D) Offer a lease instead\n**(Correct: B)**`'
);

// ── closing-competitor ──
modified = modified.replace(
  "D) Match their price\n\n**Q2:**",
  "D) Match their price\n**(Correct: B)**\n\n**Q2:**"
);
modified = modified.replace(
  "D) Claim the competitor is lying\n\n**Q3:**",
  "D) Claim the competitor is lying\n**(Correct: B)**\n\n**Q3:**"
);
modified = modified.replace(
  "D) Only the competitor's weaknesses\n\n**Q4:**",
  "D) Only the competitor's weaknesses\n**(Correct: B)**\n\n**Q4:**"
);
modified = modified.replace(
  "D) Change the subject\n\n**Q5:**",
  "D) Change the subject\n**(Correct: B)**\n\n**Q5:**"
);
modified = modified.replace(
  'D) "Did you buy it?"`',
  'D) "Did you buy it?"\n**(Correct: B)**`'
);

// ── closing-timing ──
modified = modified.replace(
  "D) Threaten price increases\n\n**Q2:**",
  "D) Threaten price increases\n**(Correct: B)**\n\n**Q2:**"
);
modified = modified.replace(
  'D) Nothing — just wait\n\n**Q3:**',
  'D) Nothing — just wait\n**(Correct: B)**\n\n**Q3:**'
);
modified = modified.replace(
  "D) Ignore the customer's timeline\n\n**Q4:**",
  "D) Ignore the customer's timeline\n**(Correct: B)**\n\n**Q4:**"
);
modified = modified.replace(
  "D) \"The deal expires at midnight\"\n\n**Q5:**",
  'D) "The deal expires at midnight"\n**(Correct: B)**\n\n**Q5:**'
);
modified = modified.replace(
  'D) Ignore the calendar entirely`',
  'D) Ignore the calendar entirely\n**(Correct: B)**`'
);

// ════════════════════════════════════════════════════════════════════════════
// NEEDS ASSESSMENT PART 2 (all 5 lessons, all Qs missing answers)
// ════════════════════════════════════════════════════════════════════════════

// ── needs2-buying-signals ──
modified = modified.replace(
  "D) They're unhappy\n\n**Q2:**",
  "D) They're unhappy\n**(Correct: B)**\n\n**Q2:**"
);
modified = modified.replace(
  "D) Walking toward the exit\n\n**Q3:**",
  "D) Walking toward the exit\n**(Correct: B)**\n\n**Q3:**"
);
modified = modified.replace(
  "D) Take the phone away\n\n**Q4:**",
  "D) Take the phone away\n**(Correct: B)**\n\n**Q4:**"
);
modified = modified.replace(
  "D) Only managers can spot buying signals\n\n**Q5:**",
  "D) Only managers can spot buying signals\n**(Correct: B)**\n\n**Q5:**"
);
modified = modified.replace(
  "D) They're comparing to competitors`",
  "D) They're comparing to competitors\n**(Correct: B)**`"
);

// ── needs2-lifestyle-matching ──
modified = modified.replace(
  'D) "When are you buying?"\n\n**Q2:**',
  'D) "When are you buying?"\n**(Correct: B)**\n\n**Q2:**'
);
modified = modified.replace(
  "D) Show the cheapest vehicle\n\n**Q3:**",
  "D) Show the cheapest vehicle\n**(Correct: B)**\n\n**Q3:**"
);
modified = modified.replace(
  "D) It speeds up the process artificially\n\n**Q4:**",
  "D) It speeds up the process artificially\n**(Correct: B)**\n\n**Q4:**"
);
modified = modified.replace(
  "D) Racing stripes\n\n**Q5:**",
  "D) Racing stripes\n**(Correct: B)**\n\n**Q5:**"
);
modified = modified.replace(
  'D) Pick a vehicle for them randomly`',
  'D) Pick a vehicle for them randomly\n**(Correct: B)**`'
);

// ── needs2-family-needs ──
modified = modified.replace(
  "D) Radio, seats, mirrors, lights\n\n**Q2:**",
  "D) Radio, seats, mirrors, lights\n**(Correct: B)**\n\n**Q2:**"
);
modified = modified.replace(
  "D) Side with the mom\n\n**Q3:**",
  "D) Side with the mom\n**(Correct: B)**\n\n**Q3:**"
);
modified = modified.replace(
  "D) Only talk to the adults\n\n**Q4:**",
  "D) Only talk to the adults\n**(Correct: B)**\n\n**Q4:**"
);
modified = modified.replace(
  "D) Sunroof\n\n**Q5:**",
  "D) Sunroof\n**(Correct: B)**\n\n**Q5:**"
);
modified = modified.replace(
  'D) Tell them to come back without the family`',
  'D) Tell them to come back without the family\n**(Correct: B)**`'
);

// ── needs2-budget-qualification ──
modified = modified.replace(
  'D) "Can you afford this?"\n\n**Q2:**',
  'D) "Can you afford this?"\n**(Correct: B)**\n\n**Q2:**'
);
modified = modified.replace(
  "D) Show them the most expensive vehicle\n\n**Q3:**",
  "D) Show them the most expensive vehicle\n**(Correct: B)**\n\n**Q3:**"
);
modified = modified.replace(
  "D) Only show what they want\n\n**Q4:**",
  "D) Only show what they want\n**(Correct: B)**\n\n**Q4:**"
);
modified = modified.replace(
  "D) The deal will be simple\n\n**Q5:**",
  "D) The deal will be simple\n**(Correct: B)**\n\n**Q5:**"
);
modified = modified.replace(
  'D) Guess their budget`',
  'D) Guess their budget\n**(Correct: B)**`'
);

// ── needs2-tradein-psychology ──
modified = modified.replace(
  "D) Not appraising the vehicle\n\n**Q2:**",
  "D) Not appraising the vehicle\n**(Correct: B)**\n\n**Q2:**"
);
modified = modified.replace(
  "D) Ignore the emotional aspect entirely\n\n**Q3:**",
  "D) Ignore the emotional aspect entirely\n**(Correct: B)**\n\n**Q3:**"
);
modified = modified.replace(
  "D) It guarantees a higher offer\n\n**Q4:**",
  "D) It guarantees a higher offer\n**(Correct: B)**\n\n**Q4:**"
);
modified = modified.replace(
  "D) Refuse the trade\n\n**Q5:**",
  "D) Refuse the trade\n**(Correct: B)**\n\n**Q5:**"
);
// Q5 end already has ` — find and fix
// Let me check where Q5 in tradein ends
modified = modified.replace(
  "D) After they've signed`",
  "D) After they've signed\n**(Correct: B)**`"
);

// Write the modified file
writeFileSync(filePath, modified, "utf-8");

const changes = modified !== content;
console.log(`File modified: ${changes}`);
console.log(`Original length: ${content.length}`);
console.log(`Modified length: ${modified.length}`);
console.log(`Added ${modified.length - content.length} characters`);
console.log("Done — verify with: bun run test-modules.ts");
