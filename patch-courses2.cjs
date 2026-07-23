// This script replaces the digital marketing course in courses.ts
// using properly formatted backtick template literals
const fs = require('fs');
const path = require('path');

const coursesPath = path.join(__dirname, 'src', 'content', 'courses.ts');
let src = fs.readFileSync(coursesPath, 'utf8');

const startMarker = '// ===== Course 4: Digital Marketing (existing, kept as-is) =====';
const endMarker = '// ===== Course 5: Customer Experience (existing, kept as-is) =====';

const startIdx = src.indexOf(startMarker);
const endIdx = src.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find markers!');
  process.exit(1);
}

// Read content from individual lesson files
const lessonsDir = path.join(__dirname, 'lessons');
const lessonFiles = ['social-media.txt', 'email-marketing.txt', 'direct-mail.txt', 'marketing-roi.txt'];
const lessonContents = lessonFiles.map(f => {
  const raw = fs.readFileSync(path.join(lessonsDir, f), 'utf8').trim();
  // Escape backticks: replace ` with \`
  // Escape ${ to prevent template literal interpolation
  let escaped = raw.replace(/`/g, '\\`');
  escaped = escaped.replace(/\$\{/g, '\\${');
  return escaped;
});

function makeLesson(id, title, desc, content) {
  return `      {
        id: "${id}",
        title: "${title}",
        description: "${desc}",
        duration: "10 min",
        content: \`${content}\`,
      }`;
}

const replacement = `  // ===== Course 4: Digital Marketing (expanded with MCQs) =====
  {
    id: "digital-marketing",
    title: "Digital Marketing for Dealers",
    subtitle: "Modern marketing strategies that drive traffic",
    description:
      "Learn how to use digital marketing to attract more customers to your dealership. Each 5-minute module includes detailed strategies and 5 multiple-choice quiz questions. Covers social media, email campaigns, direct mail, and marketing analytics.",
    levels: "Intermediate",
    duration: "2.5 hours",
    lessons: 4,
    image: "marketing",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    lessonsList: [
${makeLesson('social-media', 'Social Media for Car Dealers', 'Use social platforms to attract and engage customers.', lessonContents[0])},
${makeLesson('email-marketing', 'Email Marketing Campaigns', 'Build and nurture leads through targeted email.', lessonContents[1])},
${makeLesson('direct-mail', 'Direct Mail That Works', 'Create effective direct mail campaigns that drive showroom traffic.', lessonContents[2])},
${makeLesson('marketing-roi', 'Measuring Marketing ROI', 'Track, analyze, and optimize your marketing spend for maximum return.', lessonContents[3])},
    ],
  },`;

const newSrc = src.slice(0, startIdx) + replacement + '\n' + src.slice(endIdx);
fs.writeFileSync(coursesPath, newSrc, 'utf8');
console.log('Patch applied successfully!');
console.log('Old length:', src.length);
console.log('New length:', newSrc.length);
