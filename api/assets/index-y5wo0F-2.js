import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as useTranslation, o as getTeamProgress, h as addSalesperson, s as sendMessage, d as getTeamCost, L as LanguageSwitcher, p as resetUserProgress, q as getUserProgress, t as getSkillGaps, v as checkDailyLimit, w as removeLessonComplete, x as markLessonComplete, y as changeSalespersonTier, i as removeSalesperson } from "./router-jD0MEXbQ.js";
import { c as createSsrRpc } from "./createSsrRpc-l1y8KE69.js";
import { c as createServerFn } from "../server.js";
import { c as courses } from "./courses-CY9yjTRv.js";
import { g as getAuthInfo } from "./auth-guard-DDzkafwD.js";
import "@tanstack/react-router";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
const getAppointments = createServerFn({
  method: "POST"
}).handler(createSsrRpc("dd6d5646c2bba3013dd52cc0639dc053cdc52d1b3d1f9675e96d105cc280b650"));
const createAppointment = createServerFn({
  method: "POST"
}).handler(createSsrRpc("1a92e942e42dbac7c8b685d2ce8da8c0d4d440199c7fa0a94b9cb929bc4aef19"));
const deleteAppointment = createServerFn({
  method: "POST"
}).handler(createSsrRpc("66fffc30499861b55ad6476c19d18e4fbf7aeeb82929401d0f7bf686fd1c76b8"));
function ManagerDashboard() {
  const {
    t
  } = useTranslation();
  const [token, setToken] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [detailTab, setDetailTab] = useState("progress");
  const [mainTab, setMainTab] = useState("completion");
  const [appointments, setAppointments] = useState([]);
  const [showNewAppt, setShowNewAppt] = useState(false);
  const [apptSalesperson, setApptSalesperson] = useState("");
  const [apptCustomer, setApptCustomer] = useState("");
  const [apptTime, setApptTime] = useState("");
  const [apptCar, setApptCar] = useState("");
  const [apptTask, setApptTask] = useState("");
  const [apptSaving, setApptSaving] = useState(false);
  const [skillGaps, setSkillGaps] = useState(null);
  const [dailyCount, setDailyCount] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newTier, setNewTier] = useState("plus");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [showStripeConfirm, setShowStripeConfirm] = useState(false);
  const [stripeConfirmData, setStripeConfirmData] = useState(null);
  const [addedSuccess, setAddedSuccess] = useState(null);
  const [costSummary, setCostSummary] = useState(null);
  const [authCheck, setAuthCheck] = useState("loading");
  const TIER_PRICES = {
    basic: 149,
    plus: 169,
    premium: 189
  };
  const STRIPE_SP_LINKS = {
    basic: "https://buy.stripe.com/cNibJ1bL02YI8zofMb8Vi0i",
    plus: "https://buy.stripe.com/3cI7sL2aqbve7vkgQf8Vi0j",
    premium: "https://buy.stripe.com/28E00j02ibveaHw43t8Vi0k"
  };
  useEffect(() => {
    const t2 = localStorage.getItem("salesdrive_token");
    if (!t2) {
      window.location.href = "/login";
      return;
    }
    setToken(t2);
    getAuthInfo({
      data: {
        token: t2
      }
    }).then((result) => {
      if (result.authenticated && result.user) {
        if (result.user.role === "management") {
          setAuthCheck("management");
          getTeamProgress({
            data: {
              token: t2
            }
          }).then((r) => {
            if (r.success) setTeam(r.team);
            else setError(r.error || "Failed to load team");
            setLoading(false);
          });
        } else {
          setAuthCheck("redirect");
          setTimeout(() => {
            window.location.href = "/profile";
          }, 2e3);
          setLoading(false);
        }
      } else {
        window.location.href = "/login";
      }
    });
  }, []);
  const selectUser = async (userId) => {
    if (!token) return;
    const result = await getUserProgress({
      data: {
        token,
        userId
      }
    });
    if (result.success) {
      setSelectedUser({
        user: result.user,
        completedLessons: result.completedLessons,
        completedMap: result.completedMap,
        messages: result.messages
      });
      setDetailTab("progress");
      const gaps = await getSkillGaps({
        data: {
          token,
          userId
        }
      });
      if (gaps.success) setSkillGaps(gaps.gaps);
      const limit = await checkDailyLimit({
        data: {
          token,
          userId
        }
      });
      if (limit.success) setDailyCount(limit);
    }
  };
  const fetchCost = async (t2) => {
    const result = await getTeamCost({
      data: {
        token: t2
      }
    });
    if (result.success) {
      setCostSummary(result);
    }
  };
  const fetchAppointments = async (t2) => {
    const result = await getAppointments({
      data: {
        token: t2
      }
    });
    if (result.success) setAppointments(result.appointments);
  };
  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    if (!token || !apptSalesperson || !apptCustomer || !apptTime) return;
    setApptSaving(true);
    await createAppointment({
      data: {
        token,
        salespersonId: parseInt(apptSalesperson),
        customerName: apptCustomer,
        appointmentTime: apptTime,
        carDescription: apptCar || void 0,
        task: apptTask || void 0
      }
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
    const t2 = localStorage.getItem("salesdrive_token");
    if (!t2) {
      window.location.href = "/login";
      return;
    }
    setToken(t2);
    getTeamProgress({
      data: {
        token: t2
      }
    }).then((result) => {
      if (result.success) {
        setTeam(result.team);
      } else {
        setError(result.error || "Failed to load team");
      }
      setLoading(false);
    });
    fetchCost(t2);
    fetchAppointments(t2);
    const params = new URLSearchParams(window.location.search);
    if (params.get("added") === "1") {
      const email = params.get("email");
      const name = params.get("name");
      const tier = params.get("tier");
      if (email && tier) {
        addSalesperson({
          data: {
            token: t2,
            email,
            name: name || "",
            tier
          }
        }).then((res) => {
          if (res.success) {
            setAddedSuccess({
              email,
              name: name || email
            });
            getTeamProgress({
              data: {
                token: t2
              }
            }).then((r) => {
              if (r.success) setTeam(r.team);
            });
            fetchCost(t2);
          }
          window.history.replaceState({}, "", "/manager");
        });
      }
    }
  }, []);
  const handleAddSalesperson = async (e) => {
    e.preventDefault();
    if (!token || !newEmail.trim()) return;
    const price = TIER_PRICES[newTier] || 169;
    setStripeConfirmData({
      email: newEmail.trim(),
      name: newName.trim(),
      tier: newTier,
      price
    });
    setShowStripeConfirm(true);
    setShowAddForm(false);
    setAddError("");
  };
  const handleOpenStripePayment = async () => {
    if (!stripeConfirmData || !token) return;
    const {
      email,
      name,
      tier
    } = stripeConfirmData;
    setAdding(true);
    const res = await addSalesperson({
      data: {
        token,
        email,
        name,
        tier
      }
    });
    if (res.success) {
      setAddedSuccess({
        email,
        name: name || email
      });
      getTeamProgress({
        data: {
          token
        }
      }).then((r) => {
        if (r.success) setTeam(r.team);
      });
      fetchCost(token);
    }
    setAdding(false);
    setShowStripeConfirm(false);
    const stripeLink = STRIPE_SP_LINKS[tier] || STRIPE_SP_LINKS.plus;
    const returnUrl = encodeURIComponent(`${window.location.origin}/manager`);
    window.location.href = `${stripeLink}?prefilled_email=${encodeURIComponent(email)}&success_url=${returnUrl}`;
  };
  const handleRemoveSalesperson = async (userId) => {
    if (!token) return;
    await removeSalesperson({
      data: {
        token,
        userId
      }
    });
    const teamResult = await getTeamProgress({
      data: {
        token
      }
    });
    if (teamResult.success) setTeam(teamResult.team);
    fetchCost(token);
  };
  const handleChangeTier = async (userId, tier) => {
    if (!token) return;
    await changeSalespersonTier({
      data: {
        token,
        userId,
        tier
      }
    });
    fetchCost(token);
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!token || !selectedUser || !messageText.trim()) return;
    setSending(true);
    const result = await sendMessage({
      data: {
        token,
        toUserId: selectedUser.user.id,
        message: messageText
      }
    });
    if (result.success) {
      setMessageText("");
      selectUser(selectedUser.user.id);
    }
    setSending(false);
  };
  const toggleLesson = async (courseId, lessonId, isCompleted) => {
    if (!token || !selectedUser) return;
    if (isCompleted) {
      await removeLessonComplete({
        data: {
          token,
          userId: selectedUser.user.id,
          lessonId
        }
      });
    } else {
      await markLessonComplete({
        data: {
          token,
          userId: selectedUser.user.id,
          courseId,
          lessonId
        }
      });
    }
    selectUser(selectedUser.user.id);
    const result = await getTeamProgress({
      data: {
        token
      }
    });
    if (result.success) setTeam(result.team);
  };
  const handleLogout = () => {
    localStorage.removeItem("salesdrive_token");
    window.location.href = "/";
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh items-center justify-center bg-[#0a1628]", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[#1a2d4a] border-t-[#e63946]" }) });
  }
  const Header = () => /* @__PURE__ */ jsx("header", { className: "border-b border-[#1a2d4a]/50 bg-[#0a1628]/90", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-6", children: [
    /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
      /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white", children: "Champion Sales Training & Events" })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 rounded-full bg-[#e63946]/10 px-3 py-1 text-xs font-medium text-[#e63946]", children: [
        /* @__PURE__ */ jsx("svg", { className: "h-3.5 w-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }),
        "Manager Dashboard"
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: handleLogout, className: "text-sm text-gray-400 transition-colors hover:text-[#e63946]", children: t("account.signOut") }),
      /* @__PURE__ */ jsx(LanguageSwitcher, {})
    ] })
  ] }) });
  const ProgressBar = ({
    percent,
    size = "md"
  }) => /* @__PURE__ */ jsx("div", { className: `w-full rounded-full bg-[#1a2d4a] ${size === "sm" ? "h-1.5" : "h-2.5"}`, children: /* @__PURE__ */ jsx("div", { className: "h-full rounded-full bg-gradient-to-r from-[#e63946] to-[#f77f00] transition-all duration-500", style: {
    width: `${Math.min(percent, 100)}%`
  } }) });
  const TeamOverview = () => /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: team.map((sp) => /* @__PURE__ */ jsxs("button", { onClick: () => selectUser(sp.id), className: "group relative overflow-hidden rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-5 text-left transition-all duration-200 hover:border-[#e63946]/50 hover:shadow-lg hover:shadow-[#e63946]/5", children: [
    sp.unreadCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute right-3 top-3 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#e63946] px-1.5 text-[10px] font-bold text-white", children: sp.unreadCount }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1a2d4a] to-[#0a1628] text-sm font-bold text-[#e63946]", children: (sp.name?.[0] || sp.email[0]).toUpperCase() }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-white truncate", children: sp.name || sp.email }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: sp.email })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: t("manager.progress") }),
        /* @__PURE__ */ jsxs("span", { className: "font-medium text-white", children: [
          sp.percent,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsx(ProgressBar, { percent: sp.percent, size: "sm" }),
      /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-gray-500", children: [
        sp.totalCompleted,
        " of ",
        sp.totalLessons,
        " lessons"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between border-t border-[#1a2d4a]/50 pt-3", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 capitalize", children: "Plus" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("select", { onClick: (e) => e.stopPropagation(), onChange: (e) => handleChangeTier(sp.id, e.target.value), className: "bg-transparent text-[10px] text-gray-400 border border-[#1a2d4a] rounded px-1 py-0.5", children: [
          /* @__PURE__ */ jsx("option", { value: "basic", children: "Basic" }),
          /* @__PURE__ */ jsx("option", { value: "plus", children: "Plus" }),
          /* @__PURE__ */ jsx("option", { value: "premium", children: "Premium" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: (e) => {
          e.stopPropagation();
          handleRemoveSalesperson(sp.id);
        }, className: "text-[10px] text-[#e63946] hover:text-white transition-colors", children: t("manager.remove") }),
        /* @__PURE__ */ jsx("button", { onClick: async (e) => {
          e.stopPropagation();
          if (!confirm(`Reset ALL progress for ${sp.name || sp.email}?`)) return;
          await resetUserProgress({
            data: {
              token,
              userId: sp.id
            }
          });
          const r = await getTeamProgress({
            data: {
              token
            }
          });
          if (r.success) setTeam(r.team);
        }, className: "text-[10px] text-yellow-500 hover:text-white transition-colors ml-1", children: "Reset" })
      ] })
    ] })
  ] }, sp.id)) });
  const ProgressDetail = () => {
    if (!selectedUser) return null;
    const allCourseData = courses.map((course) => {
      const courseCompleted = selectedUser.completedLessons.filter((cl) => cl.course_id === course.id).length;
      return {
        ...course,
        completed: courseCompleted,
        total: course.lessonsList.length,
        percent: Math.round(courseCompleted / course.lessonsList.length * 100)
      };
    });
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white", children: t("manager.trainingProgress") }),
        /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500", children: [
          selectedUser.completedLessons.length,
          " total completed"
        ] })
      ] }),
      allCourseData.map((course) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold text-white", children: course.title }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
            course.completed,
            "/",
            course.total
          ] })
        ] }),
        /* @__PURE__ */ jsx(ProgressBar, { percent: course.percent, size: "sm" }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2", children: course.lessonsList.map((lesson) => {
          const isCompleted = !!selectedUser.completedMap[lesson.id];
          return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => toggleLesson(course.id, lesson.id, isCompleted), className: `flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${isCompleted ? "border-[#e63946] bg-[#e63946]" : "border-[#1a2d4a] hover:border-[#e63946]/50"}`, children: isCompleted && /* @__PURE__ */ jsx("svg", { className: "h-3 w-3 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) }) }),
            /* @__PURE__ */ jsx("span", { className: `text-sm ${isCompleted ? "text-gray-400 line-through" : "text-gray-300"}`, children: lesson.title })
          ] }, lesson.id);
        }) })
      ] }, course.id))
    ] });
  };
  const SkillGapsSection = () => {
    if (!selectedUser || !skillGaps) return null;
    const handleAssignModule = async (courseId, courseName) => {
      if (!token) return;
      await sendMessage({
        data: {
          token,
          toUserId: selectedUser.user.id,
          message: `I've assigned you the "${courseName}" course to work on. This is one of your skill gaps — focus on completing these lessons.`
        }
      });
      selectUser(selectedUser.user.id);
    };
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white", children: "Skill Gaps" }),
        dailyCount && /* @__PURE__ */ jsx("span", { className: `text-xs ${dailyCount.limitReached ? "text-[#e63946]" : "text-gray-500"}`, children: dailyCount.limitReached ? "Daily limit reached" : `${dailyCount.completedToday}/${dailyCount.maxDaily} today` })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: "Courses ranked by completion percentage — lowest first. Assign modules to address skill gaps." }),
      skillGaps.map((gap) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold text-white", children: gap.courseName }),
          /* @__PURE__ */ jsxs("span", { className: `text-xs font-medium ${gap.weakest ? "text-[#e63946]" : "text-green-500"}`, children: [
            gap.percent,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-2 w-full rounded-full bg-[#1a2d4a]", children: /* @__PURE__ */ jsx("div", { className: `h-full rounded-full transition-all duration-500 ${gap.weakest ? "bg-[#e63946]" : "bg-gradient-to-r from-[#e63946] to-[#f77f00]"}`, style: {
          width: `${gap.percent}%`
        } }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
            gap.completed,
            "/",
            gap.total,
            " lessons"
          ] }),
          gap.weakest && /* @__PURE__ */ jsx("button", { onClick: () => handleAssignModule(gap.courseId, gap.courseName), className: "text-xs text-[#e63946] hover:text-white transition-colors", children: "Assign Module" })
        ] })
      ] }, gap.courseId))
    ] });
  };
  const MessagesSection = () => {
    if (!selectedUser) return null;
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white", children: t("manager.messages") }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSendMessage, className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-5", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-gray-300", children: t("manager.sendMessage") }),
        /* @__PURE__ */ jsx("textarea", { value: messageText, onChange: (e) => setMessageText(e.target.value), placeholder: t("manager.messagePlaceholder"), rows: 3, className: "mt-3 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "They'll see this message when they log in." }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: sending || !messageText.trim(), className: "btn-primary text-sm !px-4 !py-2 disabled:opacity-50", children: sending ? "Sending..." : t("manager.sendMessage") })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: selectedUser.messages.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-sm text-gray-500", children: t("manager.noMessages") }) : selectedUser.messages.map((msg) => /* @__PURE__ */ jsxs("div", { className: `rounded-xl border p-4 ${msg.is_read ? "border-[#1a2d4a] bg-[#0d1f35]/50" : "border-[#e63946]/20 bg-[#e63946]/5"}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-[#e63946]", children: msg.from_name || "Manager" }),
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-gray-600", children: [
            new Date(msg.created_at).toLocaleDateString(),
            " ",
            new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap", children: msg.message }),
        !msg.is_read && /* @__PURE__ */ jsx("span", { className: "mt-2 inline-flex items-center rounded-full bg-[#e63946]/10 px-2 py-0.5 text-[10px] font-medium text-[#e63946]", children: "Unread" })
      ] }, msg.id)) })
    ] });
  };
  if (authCheck === "redirect") {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh items-center justify-center bg-[#0a1628] px-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 text-yellow-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }),
      /* @__PURE__ */ jsx("h1", { className: "mt-6 text-2xl font-bold text-white", children: "Manager Dashboard Only" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-gray-400", children: "This dashboard is for management accounts only. Redirecting you to your profile..." }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 h-2 w-full rounded-full bg-[#1a2d4a] overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full w-full animate-pulse rounded-full bg-[#e63946]" }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-dvh bg-[#0a1628]", children: [
    /* @__PURE__ */ jsx(Header, {}),
    error && /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-6 pt-8", children: /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-[#e63946]/20 bg-[#e63946]/5 p-4 text-sm text-[#e63946]", children: error }) }),
    /* @__PURE__ */ jsx("main", { className: "mx-auto max-w-7xl px-6 py-8", children: selectedUser ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => {
          setSelectedUser(null);
          setMessageText("");
        }, className: "mb-4 flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white", children: [
          /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }),
          t("manager.backToTeam")
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#1a2d4a] to-[#0a1628] text-xl font-bold text-[#e63946]", children: (selectedUser.user.name?.[0] || selectedUser.user.email[0]).toUpperCase() }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white", children: selectedUser.user.name || "Unnamed" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: selectedUser.user.email })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex gap-1 rounded-lg bg-[#0d1f35] p-1", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setDetailTab("progress"), className: `flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${detailTab === "progress" ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"}`, children: t("manager.trainingProgress") }),
          /* @__PURE__ */ jsx("button", { onClick: () => setDetailTab("skillgaps"), className: `flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${detailTab === "skillgaps" ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"}`, children: "Skill Gaps" }),
          /* @__PURE__ */ jsxs("button", { onClick: () => setDetailTab("messages"), className: `flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${detailTab === "messages" ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"}`, children: [
            t("manager.messages"),
            selectedUser.messages.filter((m) => !m.is_read).length > 0 && /* @__PURE__ */ jsx("span", { className: "ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#e63946] px-1 text-[10px] font-bold text-white", children: selectedUser.messages.filter((m) => !m.is_read).length })
          ] })
        ] })
      ] }),
      detailTab === "progress" ? /* @__PURE__ */ jsx(ProgressDetail, {}) : detailTab === "skillgaps" ? /* @__PURE__ */ jsx(SkillGapsSection, {}) : /* @__PURE__ */ jsx(MessagesSection, {})
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-white", children: t("manager.title") }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-400", children: t("manager.subtitle") })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowAddForm(!showAddForm), className: "btn-primary text-sm", children: t("manager.addSalesperson") })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex gap-1 rounded-lg bg-[#0d1f35] p-1", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setMainTab("completion"), className: `flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${mainTab === "completion" ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"}`, children: "Training Completion" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setMainTab("saleslog"), className: `flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${mainTab === "saleslog" ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"}`, children: "Digital Sales Log" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setMainTab("tasks"), className: `flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${mainTab === "tasks" ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"}`, children: "Assign Tasks" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setMainTab("process"), className: `flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${mainTab === "process" ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"}`, children: "Steps of the Sale" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setMainTab("planner"), className: `flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${mainTab === "planner" ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"}`, children: "Daily Planner" })
      ] }),
      showAddForm && /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white mb-4", children: t("manager.addSalesperson") }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleAddSalesperson, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300", children: t("auth.email") }),
              /* @__PURE__ */ jsx("input", { type: "email", required: true, value: newEmail, onChange: (e) => setNewEmail(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-[#e63946]", placeholder: "salesperson@dealership.com" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300", children: t("auth.name") }),
              /* @__PURE__ */ jsx("input", { type: "text", value: newName, onChange: (e) => setNewName(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-[#e63946]", placeholder: "John Doe" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300", children: t("manager.selectTier") }),
            /* @__PURE__ */ jsxs("select", { value: newTier, onChange: (e) => setNewTier(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white outline-none focus:border-[#e63946]", children: [
              /* @__PURE__ */ jsx("option", { value: "basic", children: "Basic - $149/mo" }),
              /* @__PURE__ */ jsx("option", { value: "plus", children: "Plus - $169/mo" }),
              /* @__PURE__ */ jsx("option", { value: "premium", children: "Premium - $189/mo" })
            ] })
          ] }),
          addError && /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-[#e63946]/10 p-3 text-sm text-[#e63946]", children: addError }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx("button", { type: "submit", disabled: adding, className: "btn-primary text-sm disabled:opacity-50", children: adding ? "Loading..." : "Review & Pay →" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowAddForm(false), className: "text-sm text-gray-400 hover:text-white", children: "Cancel" })
          ] })
        ] })
      ] }),
      showStripeConfirm && stripeConfirmData && /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-xl border border-[#e63946] bg-[#0d1f35] p-6 shadow-lg shadow-[#e63946]/10", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white mb-2", children: "Complete Payment" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 mb-4", children: "You'll be redirected to Stripe, our secure payment processor, to complete the subscription." }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-[#0a1628] p-4 mb-4 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "Salesperson" }),
            /* @__PURE__ */ jsx("span", { className: "text-white", children: stripeConfirmData.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "Tier" }),
            /* @__PURE__ */ jsx("span", { className: "text-white capitalize", children: stripeConfirmData.tier })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border-t border-[#1a2d4a] pt-3 flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-white font-semibold", children: "Monthly Cost" }),
            /* @__PURE__ */ jsxs("span", { className: "text-[#e63946] text-xl font-extrabold", children: [
              "$",
              stripeConfirmData.price,
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: "/mo" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600 mb-4", children: [
          "You'll be charged $",
          stripeConfirmData.price,
          "/mo for this salesperson. They'll get full access to the ",
          stripeConfirmData.tier,
          " tier training. This is added to your existing monthly total."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxs("button", { onClick: handleOpenStripePayment, className: "flex-1 rounded-lg bg-[#e63946] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c1121f] transition shadow-lg shadow-[#e63946]/20", children: [
            "Complete Payment — $",
            stripeConfirmData.price,
            "/mo"
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            setShowStripeConfirm(false);
            setStripeConfirmData(null);
            setShowAddForm(true);
          }, className: "text-sm text-gray-400 hover:text-white", children: "Cancel" })
        ] })
      ] }),
      addedSuccess && /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-xl border border-green-500/30 bg-green-500/5 p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white", children: "Salesperson Added" }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-400", children: [
              addedSuccess.email,
              " has been added to your team."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setAddedSuccess(null), className: "text-sm text-gray-400 hover:text-white", children: "Dismiss" })
      ] }),
      costSummary && costSummary.count > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3", children: t("manager.costSummary") }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          Object.entries(costSummary.breakdown).map(([tier, info]) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-gray-400 capitalize", children: [
              tier,
              ": ",
              info.count,
              " ",
              t("manager.people"),
              " × $",
              info.price
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-white font-medium", children: [
              "$",
              info.subtotal,
              t("manager.perMonth")
            ] })
          ] }, tier)),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-[#1a2d4a] pt-2 text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-300 font-medium", children: t("manager.total") }),
            /* @__PURE__ */ jsxs("span", { className: "text-white font-bold", children: [
              costSummary.count,
              " ",
              t("manager.people"),
              " × $",
              Math.round(costSummary.total / costSummary.count),
              " = $",
              costSummary.total,
              t("manager.perMonth")
            ] })
          ] })
        ] })
      ] }),
      mainTab === "completion" && (team.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-12 text-center", children: [
        /* @__PURE__ */ jsx("svg", { className: "mx-auto h-12 w-12 text-gray-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" }) }),
        /* @__PURE__ */ jsx("h3", { className: "mt-4 text-lg font-semibold text-white", children: t("manager.noMembers") }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-500", children: t("manager.noMembers.desc") })
      ] }) : /* @__PURE__ */ jsx(TeamOverview, {})),
      mainTab === "saleslog" && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Digital Sales Log" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 mb-6", children: "Track monthly sales performance for each salesperson. Click a name to view their sales log." }),
        team.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: t("manager.noMembers") }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: team.map((sp) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-white", children: sp.name || sp.email }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: sp.email })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => selectUser(sp.id), className: "text-xs text-[#e63946] hover:text-white transition-colors", children: "View Log" })
        ] }, sp.id)) })
      ] }),
      mainTab === "tasks" && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Assign Tasks" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 mb-6", children: "Assign any part of the training program to individual salespeople or your entire team." }),
        team.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: t("manager.noMembers") }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2", children: ["Greeting & Approach", "Needs Assessment", "Presentation", "Objection Handling", "Closing Techniques", "Follow-up"].map((step) => /* @__PURE__ */ jsx("button", { onClick: () => {
            team.forEach((sp) => {
              if (token) {
                sendMessage({
                  data: {
                    token,
                    toUserId: sp.id,
                    message: `Assigned task: ${step}. Please complete this module.`
                  }
                });
              }
            });
          }, className: "rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-3 text-sm text-gray-300 hover:border-[#e63946] hover:text-white transition-colors text-left", children: step }, step)) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Click a step to assign it to all salespeople. They'll receive a notification in their messages." })
        ] })
      ] }),
      mainTab === "process" && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Steps of the Sales Process" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 mb-6", children: "The complete automotive sales process. Available on all tiers — refer to it throughout training." }),
        /* @__PURE__ */ jsx("ol", { className: "space-y-4", children: [{
          step: "1",
          title: "Greeting & Building Rapport",
          desc: "Create a positive first impression and establish trust with the customer."
        }, {
          step: "2",
          title: "Needs Assessment",
          desc: "Ask the right questions to understand what the customer is looking for."
        }, {
          step: "3",
          title: "Vehicle Presentation",
          desc: "Present the vehicle features that match the customer's needs."
        }, {
          step: "4",
          title: "Test Drive",
          desc: "Guide the customer through an effective test drive experience."
        }, {
          step: "5",
          title: "Objection Handling",
          desc: "Address concerns and objections confidently and professionally."
        }, {
          step: "6",
          title: "Price Negotiation",
          desc: "Navigate pricing discussions while maintaining value."
        }, {
          step: "7",
          title: "Closing the Sale",
          desc: "Use proven closing techniques to finalize the deal."
        }, {
          step: "8",
          title: "F&I Presentation",
          desc: "Present finance and insurance options to maximize value."
        }, {
          step: "9",
          title: "Delivery & Handover",
          desc: "Ensure a smooth vehicle delivery that delights the customer."
        }, {
          step: "10",
          title: "Follow-up & Referrals",
          desc: "Maintain the relationship and generate repeat business."
        }].map((s) => /* @__PURE__ */ jsxs("li", { className: "flex gap-4 rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4", children: [
          /* @__PURE__ */ jsx("span", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e63946] text-sm font-bold text-white", children: s.step }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-white", children: s.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-400", children: s.desc })
          ] })
        ] }, s.step)) })
      ] }),
      mainTab === "planner" && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white", children: t("planner.title") }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: t("planner.subtitle") })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setShowNewAppt(!showNewAppt), className: "btn-primary text-sm", children: t("planner.newAppointment") })
        ] }),
        showNewAppt && /* @__PURE__ */ jsxs("form", { onSubmit: handleCreateAppointment, className: "mb-6 rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-5 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300", children: t("planner.selectSalesperson") }),
              /* @__PURE__ */ jsxs("select", { value: apptSalesperson, onChange: (e) => setApptSalesperson(e.target.value), required: true, className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white outline-none focus:border-[#e63946]", children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select..." }),
                team.map((sp) => /* @__PURE__ */ jsx("option", { value: sp.id, children: sp.name || sp.email }, sp.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300", children: t("planner.appointmentTime") }),
              /* @__PURE__ */ jsx("input", { type: "datetime-local", required: true, value: apptTime, onChange: (e) => setApptTime(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white outline-none focus:border-[#e63946]" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300", children: t("planner.customerName") }),
            /* @__PURE__ */ jsx("input", { type: "text", required: true, value: apptCustomer, onChange: (e) => setApptCustomer(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white outline-none focus:border-[#e63946]", placeholder: "John Smith" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300", children: t("planner.carDescription") }),
            /* @__PURE__ */ jsx("input", { type: "text", value: apptCar, onChange: (e) => setApptCar(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white outline-none focus:border-[#e63946]", placeholder: "2024 Silver Toyota Camry" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-300", children: t("planner.task") }),
            /* @__PURE__ */ jsx("input", { type: "text", value: apptTask, onChange: (e) => setApptTask(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white outline-none focus:border-[#e63946]", placeholder: "Prepare test drive route" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx("button", { type: "submit", disabled: apptSaving, className: "btn-primary text-sm disabled:opacity-50", children: apptSaving ? t("planner.saving") : t("planner.save") }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowNewAppt(false), className: "text-sm text-gray-400 hover:text-white", children: "Cancel" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: appointments.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-sm text-gray-500", children: t("planner.noAppointments") }) : appointments.map((apt) => /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-[#e63946]/20 text-sm font-bold text-[#e63946]", children: apt.customer_name?.[0] || "?" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-white", children: apt.customer_name }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
                  new Date(apt.appointment_time).toLocaleDateString(),
                  " ",
                  new Date(apt.appointment_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                ] })
              ] })
            ] }),
            apt.car_description && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xs text-gray-400", children: [
              "Car: ",
              apt.car_description
            ] }),
            apt.task && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400", children: [
              "Task: ",
              apt.task
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-gray-500", children: [
              "Salesperson: ",
              apt.salesperson_name || apt.salesperson_email
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: async () => {
            if (!token) return;
            await deleteAppointment({
              data: {
                token,
                appointmentId: apt.id
              }
            });
            fetchAppointments(token);
          }, className: "text-xs text-[#e63946] hover:text-white transition-colors", children: "Cancel" })
        ] }, apt.id)) })
      ] })
    ] }) })
  ] });
}
export {
  ManagerDashboard as component
};
