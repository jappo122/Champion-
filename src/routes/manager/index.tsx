import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getTeamProgress, getUserProgress, sendMessage, markLessonComplete, removeLessonComplete, addSalesperson, removeSalesperson, changeSalespersonTier, getTeamCost, checkDailyLimit, getSkillGaps, resetUserProgress } from "~/lib/manager";
import { getAppointments, createAppointment, deleteAppointment } from "~/lib/planner";
import { courses } from "~/content/courses";
import { LanguageSwitcher } from '../../i18n';
import { useTranslation } from '../../i18n';
import { getAuthInfo } from "~/lib/auth-guard";

export const Route = createFileRoute("/manager/")({
  component: ManagerDashboard,
});

// ── Types ───────────────────────────────────────────────────────────────────

interface Salesperson {
  id: number;
  email: string;
  name: string | null;
  memberSince: string;
  totalCompleted: number;
  totalLessons: number;
  percent: number;
  courseProgress: { id: string; total: number; completed: number }[];
  unreadCount: number;
}

interface UserDetail {
  id: number;
  email: string;
  name: string | null;
}

interface CompletedLesson {
  course_id: string;
  lesson_id: string;
  completed_at: string;
}

interface Message {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  from_name: string | null;
}

// ── Component ───────────────────────────────────────────────────────────────

function ManagerDashboard() {
  const { t } = useTranslation();
  const [token, setToken] = useState<string | null>(null);
  const [team, setTeam] = useState<Salesperson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Detail view states
  const [selectedUser, setSelectedUser] = useState<{
    user: UserDetail;
    completedLessons: CompletedLesson[];
    completedMap: Record<string, string>;
    messages: Message[];
  } | null>(null);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [detailTab, setDetailTab] = useState<"progress" | "messages" | "skillgaps">("progress");

  // Main view tabs
  const [mainTab, setMainTab] = useState<"completion" | "saleslog" | "tasks" | "process" | "planner">("completion");

  // Planner state
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showNewAppt, setShowNewAppt] = useState(false);
  const [apptSalesperson, setApptSalesperson] = useState("");
  const [apptCustomer, setApptCustomer] = useState("");
  const [apptTime, setApptTime] = useState("");
  const [apptCar, setApptCar] = useState("");
  const [apptTask, setApptTask] = useState("");
  const [apptSaving, setApptSaving] = useState(false);

  // Skill gaps + daily limit
  const [skillGaps, setSkillGaps] = useState<{ courseId: string; courseName: string; total: number; completed: number; percent: number; weakest: boolean }[] | null>(null);
  const [dailyCount, setDailyCount] = useState<{ completedToday: number; maxDaily: number; limitReached: boolean } | null>(null);

  // Add salesperson
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newTier, setNewTier] = useState("plus");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  // Stripe payment flow: show cost summary instead of directly adding
  const [showStripeConfirm, setShowStripeConfirm] = useState(false);
  const [stripeConfirmData, setStripeConfirmData] = useState<{ email: string; name: string; tier: string; price: number } | null>(null);
  const [addedSuccess, setAddedSuccess] = useState<{ email: string; name: string } | null>(null);
  const [costSummary, setCostSummary] = useState<{ breakdown: Record<string, { count: number; price: number; subtotal: number }>; total: number; count: number } | null>(null);
  const [authCheck, setAuthCheck] = useState<"loading" | "management" | "redirect">("loading");

  // Per-tier pricing (matching business plan and Stripe links)
  const TIER_PRICES: Record<string, number> = { basic: 149, plus: 169, premium: 189 };
  const STRIPE_SP_LINKS: Record<string, string> = {
    basic: "https://buy.stripe.com/cNibJ1bL02YI8zofMb8Vi0i",
    plus: "https://buy.stripe.com/3cI7sL2aqbve7vkgQf8Vi0j",
    premium: "https://buy.stripe.com/28E00j02ibveaHw43t8Vi0k",
  };

  useEffect(() => {
    const t = localStorage.getItem("salesdrive_token");
    if (!t) {
      window.location.href = "/login";
      return;
    }
    setToken(t);
    // First check the user's role
    getAuthInfo({ data: { token: t } }).then((result) => {
      if (result.authenticated && result.user) {
        if (result.user.role === "management") {
          setAuthCheck("management");
          // Load team data
          getTeamProgress({ data: { token: t } }).then((r) => {
            if (r.success) setTeam(r.team);
            else setError(r.error || "Failed to load team");
            setLoading(false);
          });
        } else {
          setAuthCheck("redirect");
          // Redirect non-management users after a brief delay to show message
          setTimeout(() => { window.location.href = "/profile"; }, 2000);
          setLoading(false);
        }
      } else {
        // Token kept — transient failures should not log you out
        window.location.href = "/login";
      }
    });
  }, []);

  const selectUser = async (userId: number) => {
    if (!token) return;
    const result = await getUserProgress({ data: { token, userId } });
    if (result.success) {
      setSelectedUser({
        user: result.user,
        completedLessons: result.completedLessons,
        completedMap: result.completedMap,
        messages: result.messages,
      });
      setDetailTab("progress");
      // Fetch skill gaps and daily limit
      const gaps = await getSkillGaps({ data: { token, userId } });
      if (gaps.success) setSkillGaps(gaps.gaps);
      const limit = await checkDailyLimit({ data: { token, userId } });
      if (limit.success) setDailyCount(limit);
    }
  };

  // Fetch cost summary
  const fetchCost = async (t: string) => {
    const result = await getTeamCost({ data: { token: t } });
    if (result.success) {
      setCostSummary(result);
    }
  };

  const fetchAppointments = async (t: string) => {
    const result = await getAppointments({ data: { token: t } });
    if (result.success) setAppointments(result.appointments);
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !apptSalesperson || !apptCustomer || !apptTime) return;
    setApptSaving(true);
    await createAppointment({
      data: {
        token,
        salespersonId: parseInt(apptSalesperson),
        customerName: apptCustomer,
        appointmentTime: apptTime,
        carDescription: apptCar || undefined,
        task: apptTask || undefined,
      },
    });
    setShowNewAppt(false);
    setApptCustomer("");
    setApptTime("");
    setApptCar("");
    setApptTask("");
    setApptSaving(false);
    fetchAppointments(token);
  };

  useEffect(() => {
    const t = localStorage.getItem("salesdrive_token");
    if (!t) {
      window.location.href = "/login";
      return;
    }
    setToken(t);
    getTeamProgress({ data: { token: t } }).then((result) => {
      if (result.success) {
        setTeam(result.team);
      } else {
        setError(result.error || "Failed to load team");
      }
      setLoading(false);
    });
    fetchCost(t);
    fetchAppointments(t);

    // Handle return from Stripe payment: /manager?added=1&email=X&name=Y&tier=Z
    const params = new URLSearchParams(window.location.search);
    if (params.get("added") === "1") {
      const email = params.get("email");
      const name = params.get("name");
      const tier = params.get("tier");
      if (email && tier) {
        addSalesperson({ data: { token: t, email, name: name || "", tier } }).then((res) => {
          if (res.success) {
            setAddedSuccess({ email, name: name || email });
            getTeamProgress({ data: { token: t } }).then((r) => {
              if (r.success) setTeam(r.team);
            });
            fetchCost(t);
          }
          // Clean URL params without page reload
          window.history.replaceState({}, "", "/manager");
        });
      }
    }
  }, []);

  const handleAddSalesperson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newEmail.trim()) return;
    const price = TIER_PRICES[newTier] || 169;
    // Show Stripe payment confirmation instead of directly creating account
    setStripeConfirmData({ email: newEmail.trim(), name: newName.trim(), tier: newTier, price });
    setShowStripeConfirm(true);
    setShowAddForm(false);
    setAddError("");
  };

  const handleOpenStripePayment = async () => {
    if (!stripeConfirmData || !token) return;
    const { email, name, tier } = stripeConfirmData;
    
    // Create the salesperson account FIRST (generates password, sends welcome email)
    setAdding(true);
    const res = await addSalesperson({ data: { token, email, name, tier } });
    if (res.success) {
      setAddedSuccess({ email, name: name || email });
      getTeamProgress({ data: { token } }).then((r) => {
        if (r.success) setTeam(r.team);
      });
      fetchCost(token);
    }
    setAdding(false);
    setShowStripeConfirm(false);
    
    // Then redirect to Stripe for payment
    const stripeLink = STRIPE_SP_LINKS[tier] || STRIPE_SP_LINKS.plus;
    const returnUrl = encodeURIComponent(`${window.location.origin}/manager`);
    window.location.href = `${stripeLink}?prefilled_email=${encodeURIComponent(email)}&success_url=${returnUrl}`;
  };

  const handleRemoveSalesperson = async (userId: number) => {
    if (!token) return;
    await removeSalesperson({ data: { token, userId } });
    const teamResult = await getTeamProgress({ data: { token } });
    if (teamResult.success) setTeam(teamResult.team);
    fetchCost(token);
  };

  const handleChangeTier = async (userId: number, tier: string) => {
    if (!token) return;
    await changeSalespersonTier({ data: { token, userId, tier } });
    fetchCost(token);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedUser || !messageText.trim()) return;
    setSending(true);
    const result = await sendMessage({
      data: { token, toUserId: selectedUser.user.id, message: messageText },
    });
    if (result.success) {
      setMessageText("");
      // Refresh to show the new message
      selectUser(selectedUser.user.id);
    }
    setSending(false);
  };

  const toggleLesson = async (courseId: string, lessonId: string, isCompleted: boolean) => {
    if (!token || !selectedUser) return;
    if (isCompleted) {
      await removeLessonComplete({ data: { token, userId: selectedUser.user.id, lessonId } });
    } else {
      await markLessonComplete({ data: { token, userId: selectedUser.user.id, courseId, lessonId } });
    }
    // Refresh progress
    selectUser(selectedUser.user.id);
    // Also refresh team overview
    const result = await getTeamProgress({ data: { token } });
    if (result.success) setTeam(result.team);
  };

  const handleLogout = () => {
    localStorage.removeItem("salesdrive_token");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0a1628]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a2d4a] border-t-[#e63946]" />
      </div>
    );
  }

  // ── Header ───────────────────────────────────────────────────────────────

  const Header = () => (
    <header className="border-b border-[#1a2d4a]/50 bg-[#0a1628]/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white">Champion Sales Training & Events</span>
        </a>
        <nav className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 rounded-full bg-[#e63946]/10 px-3 py-1 text-xs font-medium text-[#e63946]">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Manager Dashboard
          </div>
          <button onClick={handleLogout} className="text-sm text-gray-400 transition-colors hover:text-[#e63946]">
                        {t('account.signOut')}
                      </button>
                      <LanguageSwitcher /></nav>
      </div>
    </header>
  );

  // ── Progress Bar ─────────────────────────────────────────────────────────

  const ProgressBar = ({ percent, size = "md" }: { percent: number; size?: "sm" | "md" }) => (
    <div className={`w-full rounded-full bg-[#1a2d4a] ${size === "sm" ? "h-1.5" : "h-2.5"}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#e63946] to-[#f77f00] transition-all duration-500"
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );

  // ── Team Overview (Main View) ────────────────────────────────────────────

  const TeamOverview = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {team.map((sp) => (
        <button
          key={sp.id}
          onClick={() => selectUser(sp.id)}
          className="group relative overflow-hidden rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-5 text-left transition-all duration-200 hover:border-[#e63946]/50 hover:shadow-lg hover:shadow-[#e63946]/5"
        >
          {/* Unread badge */}
          {sp.unreadCount > 0 && (
            <span className="absolute right-3 top-3 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#e63946] px-1.5 text-[10px] font-bold text-white">
              {sp.unreadCount}
            </span>
          )}

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1a2d4a] to-[#0a1628] text-sm font-bold text-[#e63946]">
              {(sp.name?.[0] || sp.email[0]).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white truncate">{sp.name || sp.email}</h3>
              <p className="text-xs text-gray-500">{sp.email}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">{t('manager.progress')}</span>
                                <span className="font-medium text-white">{sp.percent}%</span>
                              </div>
                              <ProgressBar percent={sp.percent} size="sm" />
                              <p className="mt-1 text-xs text-gray-500">
                                {sp.totalCompleted} of {sp.totalLessons} lessons
            </p>
          </div>

          {/* Tier & actions */}
          <div className="mt-3 flex items-center justify-between border-t border-[#1a2d4a]/50 pt-3">
            <span className="text-xs text-gray-500 capitalize">Plus</span>
            <div className="flex gap-2">
              <select
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleChangeTier(sp.id, e.target.value)}
                className="bg-transparent text-[10px] text-gray-400 border border-[#1a2d4a] rounded px-1 py-0.5"
              >
                <option value="basic">Basic</option>
                <option value="plus">Plus</option>
                <option value="premium">Premium</option>
              </select>
              <button
                onClick={(e) => { e.stopPropagation(); handleRemoveSalesperson(sp.id); }}
                className="text-[10px] text-[#e63946] hover:text-white transition-colors"
              >
                {t('manager.remove')}
              </button>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!confirm(`Reset ALL progress for ${sp.name || sp.email}?`)) return;
                  await resetUserProgress({ data: { token, userId: sp.id } });
                  const r = await getTeamProgress({ data: { token } });
                  if (r.success) setTeam(r.team);
                }}
                className="text-[10px] text-yellow-500 hover:text-white transition-colors ml-1"
              >
                Reset
              </button>
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  // ── Progress Detail ──────────────────────────────────────────────────────

  const ProgressDetail = () => {
    if (!selectedUser) return null;

    // Find all courses with their lesson completion status
    const allCourseData = courses.map((course) => {
      const courseCompleted = selectedUser.completedLessons.filter(
        (cl) => cl.course_id === course.id
      ).length;
      return {
        ...course,
        completed: courseCompleted,
        total: course.lessonsList.length,
        percent: Math.round((courseCompleted / course.lessonsList.length) * 100),
      };
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{t('manager.trainingProgress')}</h3>
          <span className="text-sm text-gray-500">
            {selectedUser.completedLessons.length} total completed
          </span>
        </div>

        {allCourseData.map((course) => (
          <div key={course.id} className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-5">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-semibold text-white">{course.title}</h4>
              <span className="text-xs text-gray-500">
                {course.completed}/{course.total}
              </span>
            </div>
            <ProgressBar percent={course.percent} size="sm" />
            <div className="mt-4 space-y-2">
              {course.lessonsList.map((lesson) => {
                const isCompleted = !!selectedUser.completedMap[lesson.id];
                return (
                  <div key={lesson.id} className="flex items-center gap-3">
                    <button
                      onClick={() => toggleLesson(course.id, lesson.id, isCompleted)}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                        isCompleted
                          ? "border-[#e63946] bg-[#e63946]"
                          : "border-[#1a2d4a] hover:border-[#e63946]/50"
                      }`}
                    >
                      {isCompleted && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className={`text-sm ${isCompleted ? "text-gray-400 line-through" : "text-gray-300"}`}>
                      {lesson.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ── Skill Gaps Section ──────────────────────────────────────────────────

  const SkillGapsSection = () => {
    if (!selectedUser || !skillGaps) return null;

    const handleAssignModule = async (courseId: string, courseName: string) => {
      if (!token) return;
      await sendMessage({
        data: {
          token,
          toUserId: selectedUser.user.id,
          message: `I've assigned you the "${courseName}" course to work on. This is one of your skill gaps — focus on completing these lessons.`,
        },
      });
      // Refresh messages
      selectUser(selectedUser.user.id);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Skill Gaps</h3>
          {dailyCount && (
            <span className={`text-xs ${dailyCount.limitReached ? 'text-[#e63946]' : 'text-gray-500'}`}>
              {dailyCount.limitReached ? 'Daily limit reached' : `${dailyCount.completedToday}/${dailyCount.maxDaily} today`}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-400">
          Courses ranked by completion percentage — lowest first. Assign modules to address skill gaps.
        </p>

        {skillGaps.map((gap) => (
          <div key={gap.courseId} className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-5">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-white">{gap.courseName}</h4>
              <span className={`text-xs font-medium ${gap.weakest ? 'text-[#e63946]' : 'text-green-500'}`}>
                {gap.percent}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#1a2d4a]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  gap.weakest ? 'bg-[#e63946]' : 'bg-gradient-to-r from-[#e63946] to-[#f77f00]'
                }`}
                style={{ width: `${gap.percent}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">{gap.completed}/{gap.total} lessons</span>
              {gap.weakest && (
                <button
                  onClick={() => handleAssignModule(gap.courseId, gap.courseName)}
                  className="text-xs text-[#e63946] hover:text-white transition-colors"
                >
                  Assign Module
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ── Messages Section ─────────────────────────────────────────────────────

  const MessagesSection = () => {
    if (!selectedUser) return null;

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white">{t('manager.messages')}</h3>

        {/* Send message */}
        <form onSubmit={handleSendMessage} className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-5">
          <h4 className="text-sm font-semibold text-gray-300">{t('manager.sendMessage')}</h4>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={t('manager.messagePlaceholder')}
            rows={3}
            className="mt-3 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]"
          />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">They'll see this message when they log in.</p>
            <button type="submit" disabled={sending || !messageText.trim()} className="btn-primary text-sm !px-4 !py-2 disabled:opacity-50">
              {sending ? "Sending..." : t('manager.sendMessage')}
            </button>
          </div>
        </form>

        {/* Message history */}
        <div className="space-y-3">
          {selectedUser.messages.length === 0 ? (
            <p className="text-center text-sm text-gray-500">{t('manager.noMessages')}</p>
          ) : (
            selectedUser.messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-xl border p-4 ${
                  msg.is_read
                    ? "border-[#1a2d4a] bg-[#0d1f35]/50"
                    : "border-[#e63946]/20 bg-[#e63946]/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#e63946]">{msg.from_name || "Manager"}</span>
                  <span className="text-[10px] text-gray-600">
                    {new Date(msg.created_at).toLocaleDateString()}{" "}
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{msg.message}</p>
                {!msg.is_read && (
                  <span className="mt-2 inline-flex items-center rounded-full bg-[#e63946]/10 px-2 py-0.5 text-[10px] font-medium text-[#e63946]">
                    Unread
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Auth check: redirect non-management users
  if (authCheck === "redirect") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0a1628] px-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20">
            <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-white">Manager Dashboard Only</h1>
          <p className="mt-3 text-gray-400">This dashboard is for management accounts only. Redirecting you to your profile...</p>
          <div className="mt-6 h-2 w-full rounded-full bg-[#1a2d4a] overflow-hidden">
            <div className="h-full w-full animate-pulse rounded-full bg-[#e63946]" />
          </div>
        </div>
      </div>
    );
  }
  // ── Main Layout ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-dvh bg-[#0a1628]">
      <Header />

      {error && (
        <div className="mx-auto max-w-7xl px-6 pt-8">
          <div className="rounded-xl border border-[#e63946]/20 bg-[#e63946]/5 p-4 text-sm text-[#e63946]">
            {error}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-6 py-8">
        {selectedUser ? (
          <>
            {/* Detail header */}
            <div className="mb-6">
              <button
                onClick={() => { setSelectedUser(null); setMessageText(""); }}
                className="mb-4 flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('manager.backToTeam')}
              </button>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#1a2d4a] to-[#0a1628] text-xl font-bold text-[#e63946]">
                  {(selectedUser.user.name?.[0] || selectedUser.user.email[0]).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedUser.user.name || "Unnamed"}</h2>
                  <p className="text-sm text-gray-500">{selectedUser.user.email}</p>
                </div>
              </div>

              {/* Tab switcher */}
              <div className="mt-6 flex gap-1 rounded-lg bg-[#0d1f35] p-1">
                <button
                  onClick={() => setDetailTab("progress")}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    detailTab === "progress" ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {t('manager.trainingProgress')}
                </button>
                <button
                  onClick={() => setDetailTab("skillgaps")}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    detailTab === "skillgaps" ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Skill Gaps
                </button>
                <button
                  onClick={() => setDetailTab("messages")}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    detailTab === "messages" ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {t('manager.messages')}
                  {selectedUser.messages.filter((m) => !m.is_read).length > 0 && (
                    <span className="ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#e63946] px-1 text-[10px] font-bold text-white">
                      {selectedUser.messages.filter((m) => !m.is_read).length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Detail content */}
            {detailTab === "progress" ? <ProgressDetail /> : detailTab === "skillgaps" ? <SkillGapsSection /> : <MessagesSection />}
          </>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">{t('manager.title')}</h1>
                  <p className="mt-2 text-gray-400">
                    {t('manager.subtitle')}
                  </p>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="btn-primary text-sm"
                >
                  {t('manager.addSalesperson')}
                </button>
              </div>
            </div>

            {/* Main tab navigation */}
            <div className="mb-6 flex gap-1 rounded-lg bg-[#0d1f35] p-1">
              <button
                onClick={() => setMainTab("completion")}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  mainTab === "completion" ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Training Completion
              </button>
              <button
                onClick={() => setMainTab("saleslog")}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  mainTab === "saleslog" ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Digital Sales Log
              </button>
              <button
                onClick={() => setMainTab("tasks")}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  mainTab === "tasks" ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Assign Tasks
              </button>
              <button
                onClick={() => setMainTab("process")}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  mainTab === "process" ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Steps of the Sale
              </button>
              <button
                onClick={() => setMainTab("planner")}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  mainTab === "planner" ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Daily Planner
              </button>
            </div>

            {/* Add Salesperson Form */}
            {showAddForm && (
              <div className="mb-6 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
                <h3 className="text-lg font-bold text-white mb-4">{t('manager.addSalesperson')}</h3>
                <form onSubmit={handleAddSalesperson} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">{t('auth.email')}</label>
                      <input
                        type="email" required value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-[#e63946]"
                        placeholder="salesperson@dealership.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">{t('auth.name')}</label>
                      <input
                        type="text" value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-[#e63946]"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">{t('manager.selectTier')}</label>
                    <select
                      value={newTier}
                      onChange={(e) => setNewTier(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white outline-none focus:border-[#e63946]"
                    >
                      <option value="basic">Basic - $149/mo</option>
                      <option value="plus">Plus - $169/mo</option>
                      <option value="premium">Premium - $189/mo</option>
                    </select>
                  </div>
                  {addError && (
                    <div className="rounded-lg bg-[#e63946]/10 p-3 text-sm text-[#e63946]">{addError}</div>
                  )}
                  <div className="flex gap-3">
                    <button type="submit" disabled={adding} className="btn-primary text-sm disabled:opacity-50">
                      {adding ? "Loading..." : "Review & Pay →"}
                    </button>
                    <button type="button" onClick={() => setShowAddForm(false)} className="text-sm text-gray-400 hover:text-white">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Stripe Payment Confirmation */}
            {showStripeConfirm && stripeConfirmData && (
              <div className="mb-6 rounded-xl border border-[#e63946] bg-[#0d1f35] p-6 shadow-lg shadow-[#e63946]/10">
                <h3 className="text-lg font-bold text-white mb-2">Complete Payment</h3>
                <p className="text-sm text-gray-400 mb-4">
                  You'll be redirected to Stripe, our secure payment processor, to complete the subscription.
                </p>
                <div className="rounded-lg bg-[#0a1628] p-4 mb-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Salesperson</span>
                    <span className="text-white">{stripeConfirmData.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tier</span>
                    <span className="text-white capitalize">{stripeConfirmData.tier}</span>
                  </div>
                  <div className="border-t border-[#1a2d4a] pt-3 flex justify-between">
                    <span className="text-white font-semibold">Monthly Cost</span>
                    <span className="text-[#e63946] text-xl font-extrabold">${stripeConfirmData.price}<span className="text-sm">/mo</span></span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  You'll be charged ${stripeConfirmData.price}/mo for this salesperson. They'll get full access to the {stripeConfirmData.tier} tier training. This is added to your existing monthly total.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleOpenStripePayment}
                    className="flex-1 rounded-lg bg-[#e63946] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c1121f] transition shadow-lg shadow-[#e63946]/20"
                  >
                    Complete Payment — ${stripeConfirmData.price}/mo
                  </button>
                  <button
                    onClick={() => { setShowStripeConfirm(false); setStripeConfirmData(null); setShowAddForm(true); }}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Success message after Stripe payment */}
            {addedSuccess && (
              <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/5 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Salesperson Added</h3>
                    <p className="text-sm text-gray-400">{addedSuccess.email} has been added to your team.</p>
                  </div>
                </div>
                <button
                  onClick={() => setAddedSuccess(null)}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Cost Summary */}
            {costSummary && costSummary.count > 0 && (
              <div className="mb-6 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('manager.costSummary')}</h3>
                <div className="space-y-2">
                  {Object.entries(costSummary.breakdown).map(([tier, info]) => (
                    <div key={tier} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 capitalize">{tier}: {info.count} {t('manager.people')} × ${info.price}</span>
                      <span className="text-white font-medium">${info.subtotal}{t('manager.perMonth')}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-t border-[#1a2d4a] pt-2 text-sm">
                    <span className="text-gray-300 font-medium">{t('manager.total')}</span>
                    <span className="text-white font-bold">{costSummary.count} {t('manager.people')} × ${Math.round(costSummary.total / costSummary.count)} = ${costSummary.total}{t('manager.perMonth')}</span>
                  </div>
                </div>
              </div>
            )}

            {mainTab === "completion" && (
              team.length === 0 ? (
                <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-semibold text-white">{t('manager.noMembers')}</h3>
                  <p className="mt-2 text-sm text-gray-500">{t('manager.noMembers.desc')}</p>
                </div>
              ) : (
                <TeamOverview />
              )
            )}

            {mainTab === "saleslog" && (
              <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8">
                <h3 className="text-lg font-bold text-white mb-4">Digital Sales Log</h3>
                <p className="text-sm text-gray-400 mb-6">Track monthly sales performance for each salesperson. Click a name to view their sales log.</p>
                {team.length === 0 ? (
                  <p className="text-sm text-gray-500">{t('manager.noMembers')}</p>
                ) : (
                  <div className="space-y-3">
                    {team.map((sp) => (
                      <div key={sp.id} className="flex items-center justify-between rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4">
                        <div>
                          <p className="text-sm font-medium text-white">{sp.name || sp.email}</p>
                          <p className="text-xs text-gray-500">{sp.email}</p>
                        </div>
                        <button
                          onClick={() => selectUser(sp.id)}
                          className="text-xs text-[#e63946] hover:text-white transition-colors"
                        >
                          View Log
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {mainTab === "tasks" && (
              <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8">
                <h3 className="text-lg font-bold text-white mb-4">Assign Tasks</h3>
                <p className="text-sm text-gray-400 mb-6">Assign any part of the training program to individual salespeople or your entire team.</p>
                {team.length === 0 ? (
                  <p className="text-sm text-gray-500">{t('manager.noMembers')}</p>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {["Greeting & Approach", "Needs Assessment", "Presentation", "Objection Handling", "Closing Techniques", "Follow-up"].map((step) => (
                        <button
                          key={step}
                          onClick={() => {
                            team.forEach((sp) => {
                              if (token) {
                                sendMessage({ data: { token, toUserId: sp.id, message: `Assigned task: ${step}. Please complete this module.` } });
                              }
                            });
                          }}
                          className="rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-3 text-sm text-gray-300 hover:border-[#e63946] hover:text-white transition-colors text-left"
                        >
                          {step}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Click a step to assign it to all salespeople. They'll receive a notification in their messages.</p>
                  </div>
                )}
              </div>
            )}

            {mainTab === "process" && (
              <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8">
                <h3 className="text-lg font-bold text-white mb-4">Steps of the Sales Process</h3>
                <p className="text-sm text-gray-400 mb-6">The complete automotive sales process. Available on all tiers — refer to it throughout training.</p>
                <ol className="space-y-4">
                  {[
                    { step: "1", title: "Greeting & Building Rapport", desc: "Create a positive first impression and establish trust with the customer." },
                    { step: "2", title: "Needs Assessment", desc: "Ask the right questions to understand what the customer is looking for." },
                    { step: "3", title: "Vehicle Presentation", desc: "Present the vehicle features that match the customer's needs." },
                    { step: "4", title: "Test Drive", desc: "Guide the customer through an effective test drive experience." },
                    { step: "5", title: "Objection Handling", desc: "Address concerns and objections confidently and professionally." },
                    { step: "6", title: "Price Negotiation", desc: "Navigate pricing discussions while maintaining value." },
                    { step: "7", title: "Closing the Sale", desc: "Use proven closing techniques to finalize the deal." },
                    { step: "8", title: "F&I Presentation", desc: "Present finance and insurance options to maximize value." },
                    { step: "9", title: "Delivery & Handover", desc: "Ensure a smooth vehicle delivery that delights the customer." },
                    { step: "10", title: "Follow-up & Referrals", desc: "Maintain the relationship and generate repeat business." },
                  ].map((s) => (
                    <li key={s.step} className="flex gap-4 rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e63946] text-sm font-bold text-white">{s.step}</span>
                      <div>
                        <h4 className="font-semibold text-white">{s.title}</h4>
                        <p className="mt-1 text-sm text-gray-400">{s.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {mainTab === "planner" && (
              <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">{t('planner.title')}</h3>
                    <p className="text-sm text-gray-400">{t('planner.subtitle')}</p>
                  </div>
                  <button
                    onClick={() => setShowNewAppt(!showNewAppt)}
                    className="btn-primary text-sm"
                  >
                    {t('planner.newAppointment')}
                  </button>
                </div>

                {/* New Appointment Form */}
                {showNewAppt && (
                  <form onSubmit={handleCreateAppointment} className="mb-6 rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-300">{t('planner.selectSalesperson')}</label>
                        <select
                          value={apptSalesperson}
                          onChange={(e) => setApptSalesperson(e.target.value)}
                          required
                          className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white outline-none focus:border-[#e63946]"
                        >
                          <option value="">Select...</option>
                          {team.map((sp) => (
                            <option key={sp.id} value={sp.id}>{sp.name || sp.email}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300">{t('planner.appointmentTime')}</label>
                        <input
                          type="datetime-local"
                          required
                          value={apptTime}
                          onChange={(e) => setApptTime(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white outline-none focus:border-[#e63946]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">{t('planner.customerName')}</label>
                      <input
                        type="text" required value={apptCustomer}
                        onChange={(e) => setApptCustomer(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white outline-none focus:border-[#e63946]"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">{t('planner.carDescription')}</label>
                      <input
                        type="text" value={apptCar}
                        onChange={(e) => setApptCar(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white outline-none focus:border-[#e63946]"
                        placeholder="2024 Silver Toyota Camry"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">{t('planner.task')}</label>
                      <input
                        type="text" value={apptTask}
                        onChange={(e) => setApptTask(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white outline-none focus:border-[#e63946]"
                        placeholder="Prepare test drive route"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" disabled={apptSaving} className="btn-primary text-sm disabled:opacity-50">
                        {apptSaving ? t('planner.saving') : t('planner.save')}
                      </button>
                      <button type="button" onClick={() => setShowNewAppt(false)} className="text-sm text-gray-400 hover:text-white">Cancel</button>
                    </div>
                  </form>
                )}

                {/* Appointments List */}
                <div className="space-y-3">
                  {appointments.length === 0 ? (
                    <p className="text-center text-sm text-gray-500">{t('planner.noAppointments')}</p>
                  ) : (
                    appointments.map((apt: any) => (
                      <div key={apt.id} className="flex items-start justify-between rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e63946]/20 text-sm font-bold text-[#e63946]">
                              {apt.customer_name?.[0] || "?"}
                            </span>
                            <div>
                              <p className="text-sm font-medium text-white">{apt.customer_name}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(apt.appointment_time).toLocaleDateString()} {new Date(apt.appointment_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                          {apt.car_description && <p className="mt-2 text-xs text-gray-400">Car: {apt.car_description}</p>}
                          {apt.task && <p className="text-xs text-gray-400">Task: {apt.task}</p>}
                          <p className="mt-1 text-xs text-gray-500">Salesperson: {apt.salesperson_name || apt.salesperson_email}</p>
                        </div>
                        <button
                          onClick={async () => {
                            if (!token) return;
                            await deleteAppointment({ data: { token, appointmentId: apt.id } });
                            fetchAppointments(token);
                          }}
                          className="text-xs text-[#e63946] hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}