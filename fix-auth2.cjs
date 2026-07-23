// Update remaining pages to use client-side JWT validation
const fs = require('fs');
const path = require('path');

const base = '/home/team/shared/site';

// Pages to update: each has a similar useEffect pattern calling getAuthInfo
const pages = [
  {
    file: 'src/routes/training/$courseId.tsx',
    importSearch: "import { getAuthInfo } from \"~/lib/auth-guard\";",
    importReplace: "import { getAuthInfo } from \"~/lib/auth-guard\";\nimport { isTokenValid, getTokenPayload } from \"~/lib/client-auth\";",
    // Replace the useEffect that calls getAuthInfo
    effectOld: /const token = localStorage\.getItem\("salesdrive_token"\);\s*if \(!token\) \{\s*setAuthState\("unauthenticated"\);\s*return;\s*\}\s*setAuthToken\(token\);\s*getAuthInfo\(\{ data: \{ token \} \}\)\.then\(\(result\) => \{[\s\S]*?setAuthState\("unauthenticated"\);\s*\}\s*\}\);/,
    effectNew: `const token = localStorage.getItem("salesdrive_token");
    if (!token) {
      setAuthState("unauthenticated");
      return;
    }
    // Client-side JWT check — instant, no server call
    if (!isTokenValid(token)) {
      setAuthState("unauthenticated");
      return;
    }
    const payload = getTokenPayload(token)!;
    setAuthToken(token);
    setAuthState("authenticated");
    setUserTier(payload.role === "management" ? "premium" : "basic");
    // Background: fetch progress (non-blocking)
    if (course) {
      const fetchProgress = async () => {
        try {
          const { getMyProgress } = await import("~/lib/manager");
          const result = await getMyProgress({ data: { token } });
          if (result.success) {
            const completed = new Set(result.completedLessons.map((cl: { lesson_id: string }) => cl.lesson_id));
            setCompletedLessons(completed);
          }
        } catch {}
      };
      fetchProgress();
    }
    // Background: get tier info (non-blocking)
    getAuthInfo({ data: { token } }).then((result) => {
      if (result.authenticated && result.user) {
        setUserTier(result.user.tier);
      }
    }).catch(() => {});`,
  },
];

for (const page of pages) {
  const fp = path.join(base, page.file);
  let content = fs.readFileSync(fp, 'utf8');
  let changed = false;

  if (content.includes(page.importSearch) && !content.includes('client-auth')) {
    content = content.replace(page.importSearch, page.importReplace);
    changed = true;
  }

  if (page.effectOld.test(content)) {
    content = content.replace(page.effectOld, page.effectNew);
    changed = true;
    console.log('Updated effect in:', page.file);
  } else {
    console.log('Effect pattern not found in:', page.file);
  }

  if (changed) {
    fs.writeFileSync(fp, content, 'utf8');
  }
}
