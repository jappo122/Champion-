import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { g as getMyAssignments, a as getMyAppointments, b as getMyMessages, L as LanguageSwitcher } from "./router-jD0MEXbQ.js";
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
function PlannerPage() {
  const [token, setToken] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("timeline");
  useEffect(() => {
    const t = localStorage.getItem("salesdrive_token");
    if (!t) {
      window.location.href = "/login";
      return;
    }
    setToken(t);
    Promise.all([getMyAssignments({
      data: {
        token: t
      }
    }), getMyAppointments({
      data: {
        token: t
      }
    }), getMyMessages({
      data: {
        token: t
      }
    })]).then(([aRes, apRes, mRes]) => {
      if (aRes.success) setAssignments(aRes.assignments);
      if (apRes.success) setAppointments(apRes.appointments);
      if (mRes.success) setMessages(mRes.messages);
      setLoading(false);
    });
  }, []);
  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course?.title || courseId;
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh items-center justify-center bg-[#0a1628]", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[#1a2d4a] border-t-[#e63946]" }) });
  }
  const upcomingAppts = appointments.filter((a) => new Date(a.appointment_time) > /* @__PURE__ */ new Date());
  const pastAppts = appointments.filter((a) => new Date(a.appointment_time) <= /* @__PURE__ */ new Date());
  const pendingAssignments = assignments.filter((a) => !a.completed_at);
  assignments.filter((a) => a.completed_at);
  const unreadMessages = messages.filter((m) => !m.is_read);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-dvh bg-[#0a1628]", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-[#1a2d4a]/50 bg-[#0a1628]/90", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-5xl items-center justify-between px-6", children: [
      /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
        /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white", children: "Champion Sales Training & Events" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsx("a", { href: "/training", className: "text-sm text-gray-400 hover:text-white", children: "Training" }),
        /* @__PURE__ */ jsx("a", { href: "/profile", className: "text-sm text-gray-400 hover:text-white", children: "Profile" }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          localStorage.removeItem("salesdrive_token");
          window.location.href = "/";
        }, className: "text-sm text-gray-400 hover:text-[#e63946]", children: "Sign Out" }),
        /* @__PURE__ */ jsx(LanguageSwitcher, {})
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-5xl px-6 py-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white", children: "My Planner" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: "Your assigned tasks, appointments, and messages from your manager." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [
          unreadMessages.length > 0 && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 rounded-full bg-[#e63946]/10 px-3 py-1 text-xs text-[#e63946]", children: [
            /* @__PURE__ */ jsx("span", { className: "flex h-2 w-2 rounded-full bg-[#e63946]" }),
            unreadMessages.length,
            " unread"
          ] }),
          pendingAssignments.length > 0 && /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-500", children: [
            pendingAssignments.length,
            " pending"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mb-6 flex gap-1 rounded-lg bg-[#0d1f35] p-1 overflow-x-auto", children: [{
        id: "timeline",
        label: "Timeline"
      }, {
        id: "assignments",
        label: `Assignments (${pendingAssignments.length})`
      }, {
        id: "appointments",
        label: `Appointments (${upcomingAppts.length})`
      }, {
        id: "messages",
        label: `Messages (${unreadMessages.length})`
      }].map((tab) => /* @__PURE__ */ jsx("button", { onClick: () => setActiveTab(tab.id), className: `whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"}`, children: tab.label }, tab.id)) }),
      activeTab === "timeline" && /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white mb-4", children: "Today's Overview" }),
        upcomingAppts.length === 0 && pendingAssignments.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-dashed border-[#1a2d4a] p-8 text-center", children: [
          /* @__PURE__ */ jsx("svg", { className: "mx-auto h-10 w-10 text-gray-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-gray-500", children: "No upcoming tasks or appointments" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600", children: "Your manager hasn't assigned anything yet. Start training while you wait!" }),
          /* @__PURE__ */ jsx("a", { href: "/training", className: "mt-4 inline-block rounded-lg bg-[#e63946] px-4 py-2 text-xs font-medium text-white hover:bg-[#c1121f]", children: "Start Training" })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute left-4 top-0 h-full w-0.5 bg-[#1a2d4a]" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            upcomingAppts.slice(0, 5).map((a) => /* @__PURE__ */ jsxs("div", { className: "relative pl-10", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 border-[#e63946] bg-[#0d1f35]" }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-white", children: a.customer_name }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-gray-500", children: [
                    new Date(a.appointment_time).toLocaleDateString(),
                    " ",
                    new Date(a.appointment_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  ] })
                ] }),
                a.car_description && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mt-1", children: a.car_description }),
                a.task && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [
                  "Task: ",
                  a.task
                ] })
              ] })
            ] }, a.id)),
            pendingAssignments.slice(0, 5).map((a) => /* @__PURE__ */ jsxs("div", { className: "relative pl-10", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 border-yellow-500 bg-[#0d1f35]" }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-white", children: getCourseName(a.course_id) }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-yellow-500", children: "Pending" })
                ] }),
                a.lesson_id && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400 mt-1", children: [
                  "Lesson: ",
                  a.lesson_id
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [
                  "Assigned by ",
                  a.manager_name || a.manager_email
                ] }),
                /* @__PURE__ */ jsx("a", { href: `/training/${a.course_id}`, className: "mt-2 inline-block text-xs text-[#e63946] hover:underline", children: "Start Module →" })
              ] })
            ] }, `ass-${a.id}`))
          ] })
        ] })
      ] }) }),
      activeTab === "assignments" && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white mb-4", children: "My Assigned Modules" }),
        assignments.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-dashed border-[#1a2d4a] p-8 text-center", children: [
          /* @__PURE__ */ jsx("svg", { className: "mx-auto h-10 w-10 text-gray-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-gray-500", children: "No assigned modules" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600", children: "Your manager hasn't assigned any training modules yet." })
        ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: assignments.map((a) => {
          const isCompleted = !!a.completed_at;
          return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: `flex h-5 w-5 shrink-0 items-center justify-center rounded border ${isCompleted ? "border-green-500 bg-green-500" : "border-yellow-500"}`, children: isCompleted && /* @__PURE__ */ jsx("svg", { className: "h-3 w-3 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) }) }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-white", children: getCourseName(a.course_id) })
              ] }),
              a.lesson_id && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 ml-7 mt-1", children: [
                "Lesson: ",
                a.lesson_id
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "ml-7 flex items-center gap-3 mt-1", children: [
                /* @__PURE__ */ jsx("span", { className: `text-[10px] font-medium ${isCompleted ? "text-green-500" : "text-yellow-500"}`, children: isCompleted ? "Completed" : "In Progress" }),
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-gray-600", children: [
                  "Assigned ",
                  new Date(a.assigned_at).toLocaleDateString()
                ] }),
                isCompleted && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-gray-600", children: [
                  "Completed ",
                  new Date(a.completed_at).toLocaleDateString()
                ] })
              ] })
            ] }),
            !isCompleted && /* @__PURE__ */ jsx("a", { href: `/training/${a.course_id}`, className: "text-xs text-[#e63946] hover:underline shrink-0", children: "Start →" })
          ] }, a.id);
        }) })
      ] }),
      activeTab === "appointments" && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white mb-4", children: "My Appointments" }),
        appointments.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-dashed border-[#1a2d4a] p-8 text-center", children: [
          /* @__PURE__ */ jsx("svg", { className: "mx-auto h-10 w-10 text-gray-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-gray-500", children: "No appointments" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600", children: "Your manager hasn't set any appointments for you yet." })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-400", children: "Upcoming" }),
          upcomingAppts.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "No upcoming appointments" }) : upcomingAppts.map((a) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-[#e63946]/20 text-sm font-bold text-[#e63946]", children: a.customer_name?.[0] || "?" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-white", children: a.customer_name }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
                    new Date(a.appointment_time).toLocaleDateString(),
                    " ",
                    new Date(a.appointment_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-green-500", children: "Upcoming" })
            ] }),
            a.car_description && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xs text-gray-400", children: [
              "Vehicle: ",
              a.car_description
            ] }),
            a.task && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
              "Task: ",
              a.task
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600 mt-1", children: [
              "Set by ",
              a.manager_name || a.manager_email
            ] })
          ] }, a.id)),
          pastAppts.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-400 mt-6", children: "Past" }),
            pastAppts.map((a) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-3 opacity-60", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: a.customer_name }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-600", children: "Past" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600", children: new Date(a.appointment_time).toLocaleDateString() })
            ] }, a.id))
          ] })
        ] })
      ] }),
      activeTab === "messages" && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white mb-4", children: "Messages from Manager" }),
        messages.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-dashed border-[#1a2d4a] p-8 text-center", children: [
          /* @__PURE__ */ jsx("svg", { className: "mx-auto h-10 w-10 text-gray-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-gray-500", children: "No messages yet" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600", children: "Your manager hasn't sent you any messages." })
        ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: messages.map((m) => /* @__PURE__ */ jsxs("div", { className: `rounded-lg border p-4 ${m.is_read ? "border-[#1a2d4a] bg-[#0a1628]/50" : "border-[#e63946]/20 bg-[#e63946]/5"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-[#e63946]", children: m.from_name || m.from_email }),
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-gray-600", children: [
              new Date(m.created_at).toLocaleDateString(),
              " ",
              new Date(m.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap", children: m.message }),
          !m.is_read && /* @__PURE__ */ jsx("span", { className: "mt-2 inline-flex items-center rounded-full bg-[#e63946]/10 px-2 py-0.5 text-[10px] font-medium text-[#e63946]", children: "New" })
        ] }, m.id)) })
      ] })
    ] })
  ] });
}
export {
  PlannerPage as component
};
