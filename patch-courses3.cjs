// Patch Course 3 (Advanced Closing) and Course 5 (Customer Experience)
// using pre-written lesson text files
const fs = require('fs');
const path = require('path');

const coursesPath = path.join(__dirname, 'src', 'content', 'courses.ts');
let src = fs.readFileSync(coursesPath, 'utf8');
const lessonsDir = path.join(__dirname, 'lessons');

function readLesson(name) {
  return fs.readFileSync(path.join(lessonsDir, name), 'utf8').trim();
}
function esc(s) {
  return s.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}
function lesson(id, title, desc, file) {
  return `      {
        id: "${id}",
        title: "${title}",
        description: "${desc}",
        duration: "10 min",
        content: \`${esc(readLesson(file))}\`,
      }`;
}

// ===== Course 3 =====
const c3Start = '// ===== Course 3: Advanced Closing (existing, kept as-is) =====';
const c3End = '// ===== Course 3b: Advanced Closing Part 2 (Plus-gated) =====';
const c3Idx = src.indexOf(c3Start);
const c3EndIdx = src.indexOf(c3End);
if (c3Idx === -1 || c3EndIdx === -1) { console.error('C3 markers not found'); process.exit(1); }

const c3 = `// ===== Course 3: Advanced Closing (expanded with MCQs) =====
  {
    id: "advanced-closing",
    title: "Advanced Closing Techniques",
    subtitle: "Take your closing rate to the next level",
    description:
      "Advanced techniques for experienced sales professionals. Each module includes in-depth strategy breakdowns, real-world applications, and 5 multiple-choice quiz questions. Master negotiation, handle multiple decision makers, and build a referral network that drives consistent sales.",
    levels: "Advanced",
    duration: "3 hours",
    lessons: 5,
    image: "closing",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    lessonsList: [
${lesson('negotiation', 'Negotiation Mastery', 'Learn advanced negotiation tactics to maximize deal value.', 'ac-negotiation.txt')},
${lesson('multi-decision-maker', 'Handling Multiple Decision Makers', 'Navigate sales involving spouses, partners, and family members.', 'ac-multi-decision.txt')},
${lesson('phone-up', 'Phone-Up and Internet Lead Closing', 'Convert remote inquiries into showroom visits and closed deals.', 'ac-phone-up.txt')},
${lesson('referral-networks', 'Building a Referral Network', 'Create a sustainable pipeline of repeat and referral business.', 'ac-referral.txt')},
${lesson('closing-psychology', 'The Psychology of Closing', 'Understand the psychological triggers that lead to buying decisions.', 'ac-psychology.txt')},
    ],
  },`;

src = src.slice(0, c3Idx) + c3 + '\n' + src.slice(c3EndIdx);

// ===== Course 5 =====
const c5Start = '// ===== Course 5: Customer Experience (existing, kept as-is) =====';
const c5End = '// ===== Course 6: Sales Drills (existing, kept as-is) =====';
const c5Idx = src.indexOf(c5Start);
const c5EndIdx = src.indexOf(c5End);
if (c5Idx === -1 || c5EndIdx === -1) { console.error('C5 markers not found'); process.exit(1); }

const c5 = `// ===== Course 5: Customer Experience (expanded with MCQs) =====
  {
    id: "customer-experience",
    title: "Customer Experience Excellence",
    subtitle: "Turn every interaction into a 5-star experience",
    description:
      "Learn how to deliver exceptional customer experiences that drive satisfaction, positive reviews, and repeat business. Each module includes in-depth strategies, real-world applications, and 5 multiple-choice quiz questions.",
    levels: "Intermediate",
    duration: "2 hours",
    lessons: 4,
    image: "experience",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    lessonsList: [
${lesson('first-contact', 'First Contact to First Visit', 'Convert online inquiries into showroom visits with a world-class first impression.', 'cx-first-contact.txt')},
${lesson('showroom-experience', 'The Showroom Experience', 'Create an environment that makes customers comfortable, confident, and ready to buy.', 'cx-showroom.txt')},
${lesson('online-reviews', 'Managing Online Reviews', 'Build a 5-star online reputation that attracts and converts customers.', 'cx-reviews.txt')},
${lesson('delivery-experience', 'The Delivery Experience', 'Make the final delivery memorable and exciting — the start of a lifelong customer relationship.', 'cx-delivery.txt')},
    ],
  },`;

src = src.slice(0, c5Idx) + c5 + '\n' + src.slice(c5EndIdx);

fs.writeFileSync(coursesPath, src, 'utf8');
console.log('Both courses patched! Length:', src.length);
