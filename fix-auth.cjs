// Fix all pages that delete token on auth failure
const fs = require('fs');
const path = require('path');

const files = [
  'src/routes/training/$courseId.tsx',
  'src/routes/manager/index.tsx',
  'src/routes/steps.tsx',
  'src/routes/profile.tsx',
  'src/routes/account.tsx',
];

const base = '/home/team/shared/site';

for (const file of files) {
  const fp = path.join(base, file);
  let content = fs.readFileSync(fp, 'utf8');
  let changed = false;

  // Pattern 1: removeItem + setAuthState("unauthenticated")
  const p1 = /localStorage\.removeItem\("salesdrive_token"\);\s*\n\s*setAuthState\("unauthenticated"\);/g;
  if (content.match(p1)) {
    content = content.replace(p1,
      '// Token kept — transient failures should not log you out\n        setAuthState("unauthenticated");');
    changed = true;
  }

  // Pattern 2: removeItem + window.location.href = "/login"
  const p2 = /localStorage\.removeItem\("salesdrive_token"\);\s*\n\s*window\.location\.href = "\/login";/g;
  if (content.match(p2)) {
    content = content.replace(p2,
      '// Token kept — transient failures should not log you out\n        window.location.href = "/login";');
    changed = true;
  }

  // Pattern 3: standalone removeItem (not in a sign-out button) followed by window.location = "/profile"
  const p3 = /localStorage\.removeItem\("salesdrive_token"\);\s*\n\s*window\.location\.href = "\/profile";/g;
  if (content.match(p3)) {
    content = content.replace(p3,
      '// Token kept — transient failures should not log you out\n        window.location.href = "/profile";');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fp, content, 'utf8');
    console.log('Fixed:', file);
  } else {
    console.log('No match:', file);
  }
}
