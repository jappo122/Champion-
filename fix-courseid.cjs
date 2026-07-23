const fs = require('fs');
const file = 'src/routes/training/$courseId.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find the useEffect that handles auth and replace it
const oldStart = content.indexOf('useEffect(() => {');
const oldAuth = content.indexOf('getAuthInfo({ data: { token } })', oldStart);
const oldEnd = content.indexOf('}, [course]);', oldAuth) + '}, [course]);'.length;

const replacement = `useEffect(() => {
    const token = localStorage.getItem("salesdrive_token");
    if (!token) {
      setAuthState("unauthenticated");
      return;
    }
    // Client-side JWT check — instant, no server call
    if (!isTokenValid(token)) {
      setAuthState("unauthenticated");
      return;
    }
    const payload = getTokenPayload(token);
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
            const completed = new Set(result.completedLessons.map((cl) => cl.lesson_id));
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
    }).catch(() => {});
  }, [course]);`;

if (oldStart >= 0 && oldAuth >= 0 && oldEnd > oldStart) {
  content = content.slice(0, oldStart) + replacement + content.slice(oldEnd);
  fs.writeFileSync(file, content);
  console.log('Updated $courseId.tsx');
} else {
  console.log('Could not find auth useEffect in $courseId.tsx');
}
