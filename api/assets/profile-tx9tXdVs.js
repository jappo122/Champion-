import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as useTranslation, c as getTeamMembers, d as getTeamCost, e as getSalesLog, f as getAssignments, g as getMyAssignments, a as getMyAppointments, b as getMyMessages, r as resetMyProgress, L as LanguageSwitcher, h as addSalesperson, i as removeSalesperson, j as addSalesEntry, k as deleteSalesEntry, l as createAssignment, m as deleteAssignment } from "./router-jD0MEXbQ.js";
import { c as courses } from "./courses-CY9yjTRv.js";
import "@tanstack/react-router";
import "./createSsrRpc-l1y8KE69.js";
import "../server.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
const DEMO_EMAIL = "owner@champion.com";
const TIER_FEATURES = {
  plus: {
    label: "Plus",
    price: 169,
    features: ["Track team progress", "Assign tasks/modules based on skill gaps", "Add salespeople at per-person rates", "View team training completion", "Send messages to salespeople"]
  },
  premium: {
    label: "Premium",
    price: 189,
    features: ["Everything in Plus", "Digital sales log", "Daily planner with customer appointments", "Set appointments with salespeople", "Full team calendar access", "Goal tracking"]
  }
};
function ProfileDashboard() {
  const {
    t
  } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [tier, setTier] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [changingTier, setChangingTier] = useState(false);
  const [message, setMessage] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamCost, setTeamCost] = useState(null);
  const [salesLog, setSalesLog] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [myAssignments, setMyAssignments] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [myMessages, setMyMessages] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newTier, setNewTier] = useState("plus");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [showSalesLogForm, setShowSalesLogForm] = useState(false);
  const [slSalesperson, setSlSalesperson] = useState("");
  const [slCustomer, setSlCustomer] = useState("");
  const [slVehicle, setSlVehicle] = useState("");
  const [slAmount, setSlAmount] = useState("");
  const [slStatus, setSlStatus] = useState("won");
  const [slNotes, setSlNotes] = useState("");
  const [slSaving, setSlSaving] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignPerson, setAssignPerson] = useState("");
  const [assignCourse, setAssignCourse] = useState("");
  const [assignLesson, setAssignLesson] = useState("");
  const [assignSaving, setAssignSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const isManagement = user?.role === "management";
  const isDemo = tier === "premium-demo";
  const hasPremium = isDemo || tier === "premium";
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("salesdrive_token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      const res = await fetch("/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token
        })
      });
      const result = await res.json();
      if (result.user) {
        setUser(result.user);
        const isDemoUser = result.user.email === DEMO_EMAIL || result.user.id === 1;
        if (isDemoUser) setTier("premium-demo");
        try {
          const {
            getUserSubscription
          } = await import("./billing-BNqBtHkD.js");
          const subRes = await getUserSubscription({
            data: {
              token
            }
          });
          if (subRes.success && subRes.subscription) {
            setSubscription(subRes.subscription);
            setTier(isDemoUser ? "premium-demo" : subRes.subscription.tier);
          }
        } catch {
        }
        fetchProgress(token).then((count) => setCompletedCount(count));
        if (!isDemoUser && !tier) {
          fetchSubscription(token).then((t2) => setTier(t2 || "basic"));
        }
        if (result.user.role === "management") {
          loadTeam(token);
          loadTeamCost(token);
          loadSalesLog(token);
          loadAssignments(token);
        }
        if (result.user.role === "individual" || result.user.role === "user") {
          loadMyData(token);
        }
      } else {
        window.location.href = "/login";
      }
      setLoading(false);
    })();
  }, []);
  const fetchProgress = async (token) => {
    try {
      const res = await fetch("/api/my-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token
        })
      });
      const data = await res.json();
      if (data.success && data.completedLessons) {
        return data.completedLessons.length;
      }
    } catch {
    }
    return 0;
  };
  const fetchSubscription = async (token) => {
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token
        })
      });
      const data = await res.json();
      return data.tier || null;
    } catch {
      return null;
    }
  };
  const loadTeam = async (token) => {
    const res = await getTeamMembers({
      data: {
        token
      }
    });
    if (res.success) setTeamMembers(res.team);
  };
  const loadTeamCost = async (token) => {
    try {
      const res = await getTeamCost({
        data: {
          token
        }
      });
      if (res.success) setTeamCost(res);
    } catch {
    }
  };
  const loadSalesLog = async (token) => {
    const res = await getSalesLog({
      data: {
        token
      }
    });
    if (res.success) setSalesLog(res.entries);
  };
  const loadAssignments = async (token) => {
    const res = await getAssignments({
      data: {
        token
      }
    });
    if (res.success) setAssignments(res.assignments);
  };
  const loadMyData = async (token) => {
    try {
      const [aRes, apRes, mRes] = await Promise.all([getMyAssignments({
        data: {
          token
        }
      }), getMyAppointments({
        data: {
          token
        }
      }), getMyMessages({
        data: {
          token
        }
      })]);
      if (aRes.success) setMyAssignments(aRes.assignments);
      if (apRes.success) setMyAppointments(apRes.appointments);
      if (mRes.success) setMyMessages(mRes.messages);
    } catch {
    }
  };
  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel? This cannot be undone. Your access continues until the end of the billing period.")) return;
    setCancelling(true);
    setMessage(null);
    try {
      const {
        cancelSubscription
      } = await import("./billing-BNqBtHkD.js");
      const token = localStorage.getItem("salesdrive_token");
      if (!token) return;
      const result = await cancelSubscription({
        data: {
          token
        }
      });
      if (result.success) {
        setMessage({
          type: "success",
          text: `Subscription cancelled. Access continues until ${result.lastDay}.`
        });
        setSubscription(null);
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to cancel"
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Something went wrong"
      });
    }
    setCancelling(false);
  };
  const handleTierChange = async (newTier2) => {
    if (!confirm(`Change your tier to ${newTier2.charAt(0).toUpperCase() + newTier2.slice(1)}?`)) return;
    setChangingTier(true);
    setMessage(null);
    try {
      const {
        changeTier,
        getUserSubscription
      } = await import("./billing-BNqBtHkD.js");
      const token = localStorage.getItem("salesdrive_token");
      if (!token) return;
      const result = await changeTier({
        data: {
          token,
          newTier: newTier2
        }
      });
      if (result.success) {
        setMessage({
          type: "success",
          text: `Tier updated to ${result.newTier.charAt(0).toUpperCase() + result.newTier.slice(1)} ($${result.newPrice}/mo).`
        });
        const subRes = await getUserSubscription({
          data: {
            token
          }
        });
        if (subRes.success && subRes.subscription) {
          setSubscription(subRes.subscription);
          setTier(subRes.subscription.tier);
        }
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to change tier"
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Something went wrong"
      });
    }
    setChangingTier(false);
  };
  const handleAddSalesperson = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("salesdrive_token");
    if (!token || !newEmail.trim()) return;
    setAdding(true);
    setAddError("");
    const res = await addSalesperson({
      data: {
        token,
        email: newEmail.trim(),
        name: newName.trim(),
        tier: newTier
      }
    });
    if (res.success) {
      setNewEmail("");
      setNewName("");
      loadTeam(token);
      const STRIPE_LINKS = {
        basic: "https://buy.stripe.com/cNibJ1bL02YI8zofMb8Vi0i",
        plus: "https://buy.stripe.com/3cI7sL2aqbve7vkgQf8Vi0j",
        premium: "https://buy.stripe.com/28E00j02ibveaHw43t8Vi0k"
      };
      const stripeLink = STRIPE_LINKS[newTier] || STRIPE_LINKS.plus;
      const returnUrl = encodeURIComponent(`${window.location.origin}/profile`);
      window.location.href = `${stripeLink}?prefilled_email=${encodeURIComponent(newEmail.trim())}&success_url=${returnUrl}`;
    } else {
      setAddError(res.error || "Failed to add salesperson");
    }
    setAdding(false);
  };
  const handleRemoveSalesperson = async (userId) => {
    const token = localStorage.getItem("salesdrive_token");
    if (!token) return;
    if (!confirm("Remove this salesperson? Their subscription will be cancelled.")) return;
    await removeSalesperson({
      data: {
        token,
        userId
      }
    });
    loadTeam(token);
  };
  const handleAddSalesEntry = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("salesdrive_token");
    if (!token || !slCustomer.trim() || !slVehicle.trim() || !slAmount.trim()) return;
    setSlSaving(true);
    await addSalesEntry({
      data: {
        token,
        salespersonId: slSalesperson ? parseInt(slSalesperson) : void 0,
        customerName: slCustomer,
        vehicle: slVehicle,
        amount: parseFloat(slAmount),
        status: slStatus,
        notes: slNotes || void 0
      }
    });
    setShowSalesLogForm(false);
    setSlCustomer("");
    setSlVehicle("");
    setSlAmount("");
    setSlNotes("");
    loadSalesLog(token);
    setSlSaving(false);
  };
  const handleDeleteSalesEntry = async (id) => {
    const token = localStorage.getItem("salesdrive_token");
    if (!token) return;
    await deleteSalesEntry({
      data: {
        token,
        entryId: id
      }
    });
    loadSalesLog(token);
  };
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("salesdrive_token");
    if (!token || !assignPerson || !assignCourse) return;
    setAssignSaving(true);
    await createAssignment({
      data: {
        token,
        salespersonId: parseInt(assignPerson),
        courseId: assignCourse,
        lessonId: assignLesson || void 0
      }
    });
    setShowAssignForm(false);
    setAssignPerson("");
    setAssignCourse("");
    setAssignLesson("");
    loadAssignments(token);
    setAssignSaving(false);
  };
  const handleDeleteAssignment = async (id) => {
    const token = localStorage.getItem("salesdrive_token");
    if (!token) return;
    await deleteAssignment({
      data: {
        token,
        assignmentId: id
      }
    });
    loadAssignments(token);
  };
  const totalLessons = courses.reduce((s, c) => s + (c.lessonsList?.length || 0), 0);
  const tierLabel = isDemo ? "Premium (Demo)" : subscription?.tierLabel || tier?.charAt(0).toUpperCase() + tier?.slice(1) || "Basic";
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh items-center justify-center bg-[#0a1628]", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[#1a2d4a] border-t-[#e63946]" }) });
  }
  if (!user) return null;
  const Header = () => /* @__PURE__ */ jsx("header", { className: "border-b border-[#1a2d4a]/50 bg-[#0a1628]/90", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-5xl items-center justify-between px-6", children: [
    /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
      /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white", children: "Champion Sales Training & Events" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("a", { href: "/training", className: "text-sm text-gray-400 hover:text-white", children: "Training" }),
      isManagement && /* @__PURE__ */ jsx("a", { href: "/manager", className: "text-sm text-gray-400 hover:text-white", children: "Dashboard" }),
      /* @__PURE__ */ jsx("button", { onClick: () => {
        localStorage.removeItem("salesdrive_token");
        window.location.href = "/";
      }, className: "text-sm text-gray-400 hover:text-[#e63946]", children: "Sign Out" }),
      /* @__PURE__ */ jsx(LanguageSwitcher, {})
    ] })
  ] }) });
  const TierAbilities = () => {
    const currentTier = isDemo ? "premium" : tier || "plus";
    const tierInfo = TIER_FEATURES[currentTier] || TIER_FEATURES.plus;
    const allFeatures = isDemo ? TIER_FEATURES.premium.features : tierInfo.features;
    return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white mb-4", children: "Plan Features" }),
      /* @__PURE__ */ jsx("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-[#e63946]/10 px-4 py-1.5 text-sm font-medium text-[#e63946]", children: isDemo ? "Premium (Demo — All Access)" : `${tierInfo.label} — $${tierInfo.price}/mo` }),
      /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-3", children: allFeatures.map((feat, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 text-sm text-gray-300", children: [
        /* @__PURE__ */ jsx("svg", { className: "mt-0.5 h-4 w-4 shrink-0 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
        feat
      ] }, i)) }),
      !isDemo && currentTier === "plus" && /* @__PURE__ */ jsx("div", { className: "mt-4 rounded-lg border border-[#f77f00]/30 bg-[#f77f00]/5 p-3 text-xs text-[#f77f00]", children: "Upgrade to Premium ($189/mo) to unlock sales log, daily planner, goal tracking, and full team calendar." }),
      !isDemo && currentTier === "premium" && /* @__PURE__ */ jsx("div", { className: "mt-4 rounded-lg border border-green-500/30 bg-green-500/5 p-3 text-xs text-green-500", children: "You have access to all features. Your team is getting the full Champion experience." })
    ] });
  };
  const SalesLogSection = () => {
    const canAccess = isDemo || hasPremium;
    if (!canAccess) {
      return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white mb-2", children: "Sales Log" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Upgrade to Premium to track your team's sales performance." })
      ] });
    }
    return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white", children: "Sales Log" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowSalesLogForm(!showSalesLogForm), className: "rounded-lg bg-[#e63946] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#c1121f] transition-colors", children: showSalesLogForm ? "Cancel" : "+ Add Entry" })
      ] }),
      showSalesLogForm && /* @__PURE__ */ jsxs("form", { onSubmit: handleAddSalesEntry, className: "mb-6 rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4 space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-400", children: "Customer Name" }),
            /* @__PURE__ */ jsx("input", { type: "text", required: true, value: slCustomer, onChange: (e) => setSlCustomer(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]", placeholder: "John Smith" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-400", children: "Vehicle" }),
            /* @__PURE__ */ jsx("input", { type: "text", required: true, value: slVehicle, onChange: (e) => setSlVehicle(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]", placeholder: "2024 Toyota Camry" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-400", children: "Amount ($)" }),
            /* @__PURE__ */ jsx("input", { type: "number", step: "0.01", required: true, value: slAmount, onChange: (e) => setSlAmount(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]", placeholder: "35000" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-400", children: "Status" }),
            /* @__PURE__ */ jsxs("select", { value: slStatus, onChange: (e) => setSlStatus(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]", children: [
              /* @__PURE__ */ jsx("option", { value: "won", children: "Won" }),
              /* @__PURE__ */ jsx("option", { value: "lost", children: "Lost" }),
              /* @__PURE__ */ jsx("option", { value: "pending", children: "Pending" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-400", children: "Salesperson (optional)" }),
            /* @__PURE__ */ jsxs("select", { value: slSalesperson, onChange: (e) => setSlSalesperson(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]", children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "None" }),
              teamMembers.map((m) => /* @__PURE__ */ jsx("option", { value: m.id, children: m.name || m.email }, m.id))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-400", children: "Notes" }),
          /* @__PURE__ */ jsx("textarea", { value: slNotes, onChange: (e) => setSlNotes(e.target.value), rows: 2, className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]", placeholder: "Optional notes..." })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: slSaving, className: "rounded-lg bg-[#e63946] px-4 py-2 text-xs font-medium text-white hover:bg-[#c1121f] disabled:opacity-50", children: slSaving ? "Saving..." : "Save Entry" })
      ] }),
      salesLog.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-dashed border-[#1a2d4a] p-8 text-center", children: [
        /* @__PURE__ */ jsx("svg", { className: "mx-auto h-8 w-8 text-gray-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-gray-500", children: "No sales entries yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600", children: "Add your first sale to start tracking your team's performance." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: salesLog.slice(0, 10).map((entry) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-white truncate", children: entry.customer_name }),
            /* @__PURE__ */ jsx("span", { className: `text-[10px] font-medium px-1.5 py-0.5 rounded ${entry.status === "won" ? "bg-green-500/10 text-green-500" : entry.status === "lost" ? "bg-red-500/10 text-red-500" : "bg-yellow-500/10 text-yellow-500"}`, children: entry.status })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
            entry.vehicle,
            " ",
            entry.salesperson_name ? `— ${entry.salesperson_name}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-white", children: [
            "$",
            Number(entry.amount).toLocaleString()
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => handleDeleteSalesEntry(entry.id), className: "text-xs text-gray-600 hover:text-[#e63946] transition-colors", children: /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) })
        ] })
      ] }, entry.id)) })
    ] });
  };
  const SalespeopleSection = () => {
    return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white", children: "Your Sales Team" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowAddForm(!showAddForm), className: "rounded-lg bg-[#e63946] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#c1121f] transition-colors", children: showAddForm ? "Cancel" : "+ Add Salesperson" })
      ] }),
      showAddForm && /* @__PURE__ */ jsxs("form", { onSubmit: handleAddSalesperson, className: "mb-6 rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4 space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-400", children: "Email *" }),
            /* @__PURE__ */ jsx("input", { type: "email", required: true, value: newEmail, onChange: (e) => setNewEmail(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]", placeholder: "salesperson@dealership.com" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-400", children: "Name" }),
            /* @__PURE__ */ jsx("input", { type: "text", value: newName, onChange: (e) => setNewName(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]", placeholder: "John Doe" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-400", children: "Tier" }),
          /* @__PURE__ */ jsxs("select", { value: newTier, onChange: (e) => setNewTier(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]", children: [
            /* @__PURE__ */ jsx("option", { value: "basic", children: "Basic — $149/mo" }),
            /* @__PURE__ */ jsx("option", { value: "plus", children: "Plus — $169/mo" }),
            /* @__PURE__ */ jsx("option", { value: "premium", children: "Premium — $189/mo" })
          ] })
        ] }),
        addError && /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-[#e63946]/10 p-2 text-xs text-[#e63946]", children: addError }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: adding, className: "rounded-lg bg-[#e63946] px-4 py-2 text-xs font-medium text-white hover:bg-[#c1121f] disabled:opacity-50", children: adding ? "Redirecting..." : "Pay & Add Salesperson" }) })
      ] }),
      teamMembers.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-dashed border-[#1a2d4a] p-8 text-center", children: [
        /* @__PURE__ */ jsx("svg", { className: "mx-auto h-8 w-8 text-gray-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" }) }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-gray-500", children: "No team members yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600", children: "Add salespeople to start tracking their progress." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: teamMembers.map((m) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1a2d4a] to-[#0a1628] text-sm font-bold text-[#e63946]", children: (m.name?.[0] || m.email[0]).toUpperCase() }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-white truncate", children: m.name || m.email }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 truncate", children: m.email }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-gray-500 capitalize", children: m.tier }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-600", children: "·" }),
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-gray-500", children: [
              m.percent,
              "% complete"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 h-1 w-full rounded-full bg-[#1a2d4a]", children: /* @__PURE__ */ jsx("div", { className: "h-full rounded-full bg-gradient-to-r from-[#e63946] to-[#f77f00]", style: {
            width: `${m.percent}%`
          } }) })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => handleRemoveSalesperson(m.id), className: "text-xs text-gray-600 hover:text-[#e63946] transition-colors shrink-0", title: "Remove", children: /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) })
      ] }, m.id)) })
    ] });
  };
  const AssignmentsSection = () => {
    return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white", children: "Assign Tasks & Modules" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowAssignForm(!showAssignForm), className: "rounded-lg bg-[#e63946] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#c1121f] transition-colors", children: showAssignForm ? "Cancel" : "+ New Assignment" })
      ] }),
      showAssignForm && /* @__PURE__ */ jsxs("form", { onSubmit: handleCreateAssignment, className: "mb-6 rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4 space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-400", children: "Salesperson *" }),
            /* @__PURE__ */ jsxs("select", { required: true, value: assignPerson, onChange: (e) => setAssignPerson(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]", children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Select a salesperson..." }),
              teamMembers.map((m) => /* @__PURE__ */ jsx("option", { value: m.id, children: m.name || m.email }, m.id))
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-400", children: "Course *" }),
            /* @__PURE__ */ jsxs("select", { required: true, value: assignCourse, onChange: (e) => setAssignCourse(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]", children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Select a course..." }),
              courses.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.title }, c.id))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-gray-400", children: "Specific Lesson (optional)" }),
          /* @__PURE__ */ jsxs("select", { value: assignLesson, onChange: (e) => setAssignLesson(e.target.value), className: "mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]", children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Entire course" }),
            courses.find((c) => c.id === assignCourse)?.lessonsList.map((l) => /* @__PURE__ */ jsx("option", { value: l.id, children: l.title }, l.id))
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: assignSaving, className: "rounded-lg bg-[#e63946] px-4 py-2 text-xs font-medium text-white hover:bg-[#c1121f] disabled:opacity-50", children: assignSaving ? "Assigning..." : "Create Assignment" })
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-400 mb-3", children: "Recent Assignments" }),
      assignments.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-dashed border-[#1a2d4a] p-8 text-center", children: [
        /* @__PURE__ */ jsx("svg", { className: "mx-auto h-8 w-8 text-gray-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-gray-500", children: "No assignments yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600", children: "Assign training modules to your team members." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: assignments.slice(0, 10).map((a) => {
        const course = courses.find((c) => c.id === a.course_id);
        const isCompleted = !!a.completed_at;
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-white truncate", children: course?.title || a.course_id }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
              "Assigned to ",
              a.salesperson_name || a.salesperson_email
            ] }),
            a.lesson_id && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600", children: [
              "Lesson: ",
              a.lesson_id
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
              /* @__PURE__ */ jsx("span", { className: `text-[10px] font-medium ${isCompleted ? "text-green-500" : "text-yellow-500"}`, children: isCompleted ? "✓ Completed" : "○ Pending" }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-600", children: new Date(a.assigned_at).toLocaleDateString() })
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => handleDeleteAssignment(a.id), className: "text-xs text-gray-600 hover:text-[#e63946] transition-colors shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })
        ] }, a.id);
      }) })
    ] });
  };
  if (!isManagement) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-dvh bg-[#0a1628]", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-5xl px-6 py-12", children: [
        message && /* @__PURE__ */ jsx("div", { className: `mb-6 rounded-lg p-4 text-sm ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-[#e63946]/10 text-[#e63946]"}`, children: message.text }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1a2d4a] to-[#0a1628] text-2xl font-bold text-[#e63946]", children: (user.name?.[0] || user.email[0]).toUpperCase() }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white", children: user.name || "Welcome" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: user.email })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("a", { href: "/training", className: "rounded-lg border border-[#1a2d4a] px-4 py-2 text-xs font-medium text-gray-300 hover:bg-[#1a2d4a]/50 transition-colors", children: "← Back to Training" }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-[#e63946]/10 px-4 py-2 text-sm font-medium text-[#e63946]", children: [
              /* @__PURE__ */ jsx("span", { className: "flex h-2 w-2 rounded-full bg-[#e63946]" }),
              tierLabel
            ] }),
            isDemo && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-500", children: "Demo Account — All Access" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-8 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white", children: "Training Progress" }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-400", children: [
              completedCount,
              "/",
              totalLessons,
              " lessons"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-3 w-full rounded-full bg-[#1a2d4a]", children: /* @__PURE__ */ jsx("div", { className: "h-full rounded-full bg-gradient-to-r from-[#e63946] to-[#f77f00] transition-all duration-500", style: {
            width: `${totalLessons > 0 ? Math.round(completedCount / totalLessons * 100) : 0}%`
          } }) }),
          completedCount > 0 && /* @__PURE__ */ jsx("button", { onClick: async () => {
            if (!confirm("Reset all training progress? This cannot be undone.")) return;
            const token = localStorage.getItem("salesdrive_token");
            if (!token) return;
            try {
              await resetMyProgress({
                data: {
                  token
                }
              });
              window.location.reload();
            } catch {
            }
          }, className: "mt-3 text-xs text-gray-500 hover:text-[#e63946] transition-colors", children: "Reset All Progress" })
        ] }),
        subscription && !isDemo && /* @__PURE__ */ jsxs("div", { className: "mb-8 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white mb-4", children: "Subscription Details" }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 uppercase tracking-wider", children: "Current Plan" }),
              /* @__PURE__ */ jsxs("p", { className: "text-lg font-bold text-white", children: [
                subscription.tierLabel,
                " ",
                /* @__PURE__ */ jsxs("span", { className: "text-sm font-normal text-gray-400", children: [
                  "($",
                  subscription.price,
                  "/mo)"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 uppercase tracking-wider", children: "Next Billing Date" }),
              /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-white", children: subscription.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString() : "N/A" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 uppercase tracking-wider", children: "Billing Day" }),
              /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-white", children: subscription.billingDay ? `${subscription.billingDay}th of each month` : "N/A" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 uppercase tracking-wider", children: "Status" }),
              /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-green-500 capitalize", children: subscription.status })
            ] })
          ] }),
          subscription.isIndividual && /* @__PURE__ */ jsxs("div", { className: "mt-6 border-t border-[#1a2d4a] pt-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-white mb-4", children: "Change Plan" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
              subscription.availableDowngrades.map((downgrade) => /* @__PURE__ */ jsxs("button", { onClick: () => handleTierChange(downgrade), disabled: changingTier, className: "rounded-lg border border-[#1a2d4a] px-4 py-2 text-sm text-white transition-colors hover:border-[#f77f00] hover:bg-[#f77f00]/10 disabled:opacity-50", children: [
                "Downgrade to ",
                downgrade.charAt(0).toUpperCase() + downgrade.slice(1)
              ] }, downgrade)),
              subscription.availableUpgrades.map((upgrade) => /* @__PURE__ */ jsxs("button", { onClick: () => handleTierChange(upgrade), disabled: changingTier, className: "rounded-lg border border-[#e63946] bg-[#e63946]/10 px-4 py-2 text-sm font-medium text-[#e63946] transition-colors hover:bg-[#e63946] hover:text-white disabled:opacity-50", children: [
                "Upgrade to ",
                upgrade.charAt(0).toUpperCase() + upgrade.slice(1)
              ] }, upgrade))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("a", { href: "/training", className: "flex items-center gap-4 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-5 transition-all duration-200 hover:border-[#e63946]/50 hover:shadow-lg hover:shadow-[#e63946]/5 group", children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a2d4a] group-hover:bg-[#e63946]/20", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }) }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-white group-hover:text-[#e63946] transition-colors", children: "Training Modules" })
          ] }),
          /* @__PURE__ */ jsxs("a", { href: "/steps", className: "flex items-center gap-4 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-5 transition-all duration-200 hover:border-[#e63946]/50 hover:shadow-lg hover:shadow-[#e63946]/5 group", children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a2d4a] group-hover:bg-[#e63946]/20", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" }) }) }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-white group-hover:text-[#e63946] transition-colors", children: "Steps of the Sale" })
          ] }),
          /* @__PURE__ */ jsxs("a", { href: "/account", className: "flex items-center gap-4 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-5 transition-all duration-200 hover:border-[#e63946]/50 hover:shadow-lg hover:shadow-[#e63946]/5 group", children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a2d4a] group-hover:bg-[#e63946]/20", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" }) }) }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-white group-hover:text-[#e63946] transition-colors", children: "Settings" })
          ] })
        ] }),
        (myAssignments.length > 0 || myMessages.length > 0 || myAppointments.length > 0) && /* @__PURE__ */ jsxs("div", { className: "mt-8 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white", children: "From Your Manager" }),
            /* @__PURE__ */ jsx("a", { href: "/planner", className: "text-xs text-[#e63946] hover:underline", children: "View Full Planner →" })
          ] }),
          myAssignments.filter((a) => !a.completed_at).length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-sm font-semibold text-gray-400 mb-2", children: [
              "Assigned Modules (",
              myAssignments.filter((a) => !a.completed_at).length,
              ")"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2", children: myAssignments.filter((a) => !a.completed_at).slice(0, 3).map((a) => {
              const course = courses.find((c) => c.id === a.course_id);
              return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-white truncate", children: course?.title || a.course_id }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: a.lesson_id ? `Lesson: ${a.lesson_id}` : "Full course" })
                ] }),
                /* @__PURE__ */ jsx("a", { href: `/training/${a.course_id}`, className: "text-xs text-[#e63946] hover:underline shrink-0 ml-3", children: "Start" })
              ] }, a.id);
            }) })
          ] }),
          myAppointments.filter((a) => new Date(a.appointment_time) > /* @__PURE__ */ new Date()).length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-400 mb-2", children: "Upcoming Appointments" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2", children: myAppointments.filter((a) => new Date(a.appointment_time) > /* @__PURE__ */ new Date()).slice(0, 3).map((a) => /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-3", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-white", children: a.customer_name }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
                new Date(a.appointment_time).toLocaleDateString(),
                " ",
                new Date(a.appointment_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })
              ] })
            ] }) }, a.id)) })
          ] }),
          myMessages.filter((m) => !m.is_read).length > 0 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-sm font-semibold text-gray-400 mb-2", children: [
              "Unread Messages (",
              myMessages.filter((m) => !m.is_read).length,
              ")"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2", children: myMessages.filter((m) => !m.is_read).slice(0, 3).map((m) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#e63946]/20 bg-[#e63946]/5 p-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-[#e63946]", children: m.from_name || "Manager" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-300 line-clamp-2", children: m.message })
            ] }, m.id)) })
          ] })
        ] }),
        !isDemo && subscription && subscription.isIndividual && /* @__PURE__ */ jsxs("div", { className: "mt-8 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white mb-4", children: "Cancel Subscription" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 mb-4", children: "Cancelling will stop future charges. You'll retain access until the end of your billing period." }),
          /* @__PURE__ */ jsx("button", { onClick: handleCancel, disabled: cancelling, className: "rounded-lg border border-[#e63946] px-6 py-2.5 text-sm font-medium text-[#e63946] transition-colors hover:bg-[#e63946] hover:text-white disabled:opacity-50", children: cancelling ? "Cancelling..." : "Cancel Subscription" })
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-dvh bg-[#0a1628]", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-5xl px-6 py-12", children: [
      message && /* @__PURE__ */ jsx("div", { className: `mb-6 rounded-lg p-4 text-sm ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-[#e63946]/10 text-[#e63946]"}`, children: message.text }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1a2d4a] to-[#0a1628] text-2xl font-bold text-[#e63946]", children: (user.name?.[0] || user.email[0]).toUpperCase() }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white", children: user.name || "Manager Dashboard" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: user.email }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 mt-1 rounded-full bg-[#e63946]/10 px-3 py-1 text-xs font-medium text-[#e63946]", children: [
              /* @__PURE__ */ jsx("span", { className: "flex h-2 w-2 rounded-full bg-[#e63946]" }),
              "Management Account"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          isDemo && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-500", children: "Demo Account — All Access" }),
          /* @__PURE__ */ jsx("a", { href: "/training", className: "rounded-lg border border-[#1a2d4a] px-4 py-2 text-xs font-medium text-gray-300 hover:bg-[#1a2d4a]/50 transition-colors", children: "← Back to Training" }),
          /* @__PURE__ */ jsx("a", { href: "/manager", className: "rounded-lg bg-[#e63946] px-4 py-2 text-xs font-medium text-white hover:bg-[#c1121f] transition-colors", children: "Manager Dashboard →" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mb-6 flex gap-1 rounded-lg bg-[#0d1f35] p-1 overflow-x-auto", children: [{
        id: "overview",
        label: "Overview"
      }, {
        id: "team",
        label: "Sales Team"
      }, {
        id: "saleslog",
        label: "Sales Log"
      }, {
        id: "assignments",
        label: "Assignments"
      }, {
        id: "settings",
        label: "Settings"
      }].map((tab) => /* @__PURE__ */ jsx("button", { onClick: () => setActiveTab(tab.id), className: `whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"}`, children: tab.label }, tab.id)) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        activeTab === "overview" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(TierAbilities, {}),
          teamCost && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white mb-4", children: "Monthly Team Cost" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-white", children: "Base Plan" }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [
                  "$",
                  tier === "premium" ? "189" : "169",
                  "/mo — ",
                  tier === "premium" ? "Premium" : "Plus",
                  " Management Account"
                ] })
              ] }),
              Object.entries(teamCost.breakdown).map(([tierKey, info]) => /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-white capitalize", children: [
                    info.count,
                    " Salesperson",
                    info.count > 1 ? "s" : "",
                    " — ",
                    tierKey.charAt(0).toUpperCase() + tierKey.slice(1),
                    " Tier"
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [
                    "$",
                    info.price,
                    "/mo each"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm font-bold text-white", children: [
                  "$",
                  info.subtotal,
                  "/mo"
                ] })
              ] }) }, tierKey)),
              /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#e63946]/30 bg-[#e63946]/5 p-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-white", children: "Total Monthly Cost" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-lg font-bold text-[#e63946]", children: [
                    "$",
                    teamCost.total + (tier === "premium" ? 189 : 169),
                    "/mo"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [
                  teamCost.count,
                  " salesperson",
                  teamCost.count !== 1 ? "s" : "",
                  " + base plan"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white mb-4", children: "Training Progress" }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-400", children: [
              "Your team has completed ",
              teamMembers.reduce((s, m) => s + m.completedLessons, 0),
              " of ",
              teamMembers.reduce((s, m) => s + m.totalLessons, 0),
              " lessons overall."
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-3 sm:grid-cols-2", children: teamMembers.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 col-span-2", children: "Add salespeople to see their progress." }) : teamMembers.slice(0, 4).map((m) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-white truncate", children: m.name || m.email }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
                  m.percent,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "h-1.5 w-full rounded-full bg-[#1a2d4a]", children: /* @__PURE__ */ jsx("div", { className: "h-full rounded-full bg-gradient-to-r from-[#e63946] to-[#f77f00]", style: {
                width: `${m.percent}%`
              } }) })
            ] }, m.id)) })
          ] })
        ] }),
        activeTab === "team" && /* @__PURE__ */ jsx(SalespeopleSection, {}),
        activeTab === "saleslog" && /* @__PURE__ */ jsx(SalesLogSection, {}),
        activeTab === "assignments" && /* @__PURE__ */ jsx(AssignmentsSection, {}),
        activeTab === "settings" && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white mb-4", children: "Account Settings" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 mb-4", children: "Manage your account preferences." }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            !isDemo && subscription && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-white", children: [
                "Current Plan: ",
                subscription.tierLabel,
                " ($",
                subscription.price,
                "/mo)"
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [
                "Next billing: ",
                subscription.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString() : "N/A"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("a", { href: "/account", className: "inline-flex items-center gap-2 text-sm text-[#e63946] hover:underline", children: [
              /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" }) }),
              "Full Account Settings"
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  ProfileDashboard as component
};
