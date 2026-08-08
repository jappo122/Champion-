import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LanguageSwitcher } from "~/i18n";
import { getMyAssignments, getMyAppointments, getMyMessages } from "~/lib/manager";
import { courses } from "~/content/courses";
import { SiteHeader } from "~/components/site-header";

export const Route = createFileRoute("/planner")({
  component: PlannerPage,
});

function PlannerPage() {
  const [token, setToken] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"timeline" | "assignments" | "appointments" | "messages">("timeline");

  useEffect(() => {
    const t = localStorage.getItem("salesdrive_token");
    if (!t) { window.location.href = "/login"; return; }
    setToken(t);
    Promise.all([
      getMyAssignments({ data: { token: t } }),
      getMyAppointments({ data: { token: t } }),
      getMyMessages({ data: { token: t } }),
    ]).then(([aRes, apRes, mRes]) => {
      if (aRes.success) setAssignments(aRes.assignments);
      if (apRes.success) setAppointments(apRes.appointments);
      if (mRes.success) setMessages(mRes.messages);
      setLoading(false);
    }).catch(() => {
      // Never let the page sit on a spinner forever if an API call fails.
      setLoading(false);
    });
  }, []);

  const getCourseName = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    return course?.title || courseId;
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-[#0a1628]">
        <SiteHeader />
        <div className="flex items-center justify-center pt-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a2d4a] border-t-[#e63946]" />
        </div>
      </div>
    );
  }

  const upcomingAppts = appointments.filter((a: any) => new Date(a.appointment_time) > new Date());
  const pastAppts = appointments.filter((a: any) => new Date(a.appointment_time) <= new Date());
  const pendingAssignments = assignments.filter((a: any) => !a.completed_at);
  const completedAssignments = assignments.filter((a: any) => a.completed_at);
  const unreadMessages = messages.filter((m: any) => !m.is_read);

  return (
    <div className="min-h-dvh bg-[#0a1628]">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-6 pt-10 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">My Planner</h1>
            <p className="text-sm text-gray-400">Your assigned tasks, appointments, and messages from your manager.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {unreadMessages.length > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-[#e63946]/10 px-3 py-1 text-xs text-[#e63946]">
                <span className="flex h-2 w-2 rounded-full bg-[#e63946]" />
                {unreadMessages.length} unread
              </span>
            )}
            {pendingAssignments.length > 0 && (
              <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-500">
                {pendingAssignments.length} pending
              </span>
            )}
          </div>
        </div>

        {/* Tab navigation */}
        <div className="mb-6 flex gap-1 rounded-lg bg-[#0d1f35] p-1 overflow-x-auto">
          {[
            { id: "timeline" as const, label: "Timeline" },
            { id: "assignments" as const, label: `Assignments (${pendingAssignments.length})` },
            { id: "appointments" as const, label: `Appointments (${upcomingAppts.length})` },
            { id: "messages" as const, label: `Messages (${unreadMessages.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-[#e63946] text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Timeline View */}
        {activeTab === "timeline" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
              <h2 className="text-lg font-bold text-white mb-4">Today's Overview</h2>
              {upcomingAppts.length === 0 && pendingAssignments.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#1a2d4a] p-8 text-center">
                  <svg className="mx-auto h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-3 text-sm text-gray-500">No upcoming tasks or appointments</p>
                  <p className="text-xs text-gray-600">Your manager hasn't assigned anything yet. Start training while you wait!</p>
                  <a href="/training" className="mt-4 inline-block rounded-lg bg-[#e63946] px-4 py-2 text-xs font-medium text-white hover:bg-[#c1121f]">Start Training</a>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-[#1a2d4a]" />
                  <div className="space-y-6">
                    {/* Upcoming appointments */}
                    {upcomingAppts.slice(0, 5).map((a: any) => (
                      <div key={a.id} className="relative pl-10">
                        <div className="absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 border-[#e63946] bg-[#0d1f35]" />
                        <div className="rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">{a.customer_name}</span>
                            <span className="text-[10px] text-gray-500">
                              {new Date(a.appointment_time).toLocaleDateString()} {new Date(a.appointment_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          {a.car_description && <p className="text-xs text-gray-400 mt-1">{a.car_description}</p>}
                          {a.task && <p className="text-xs text-gray-500 mt-1">Task: {a.task}</p>}
                        </div>
                      </div>
                    ))}
                    {/* Pending assignments */}
                    {pendingAssignments.slice(0, 5).map((a: any) => (
                      <div key={`ass-${a.id}`} className="relative pl-10">
                        <div className="absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 border-yellow-500 bg-[#0d1f35]" />
                        <div className="rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">{getCourseName(a.course_id)}</span>
                            <span className="text-[10px] text-yellow-500">Pending</span>
                          </div>
                          {a.lesson_id && <p className="text-xs text-gray-400 mt-1">Lesson: {a.lesson_id}</p>}
                          <p className="text-xs text-gray-500 mt-1">Assigned by {a.manager_name || a.manager_email}</p>
                          <a href={`/training/${a.course_id}`} className="mt-2 inline-block text-xs text-[#e63946] hover:underline">Start Module →</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Assignments tab */}
        {activeTab === "assignments" && (
          <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
            <h2 className="text-lg font-bold text-white mb-4">My Assigned Modules</h2>
            {assignments.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#1a2d4a] p-8 text-center">
                <svg className="mx-auto h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="mt-3 text-sm text-gray-500">No assigned modules</p>
                <p className="text-xs text-gray-600">Your manager hasn't assigned any training modules yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignments.map((a: any) => {
                  const isCompleted = !!a.completed_at;
                  return (
                    <div key={a.id} className="flex items-center justify-between rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                            isCompleted ? "border-green-500 bg-green-500" : "border-yellow-500"
                          }`}>
                            {isCompleted && (
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </span>
                          <p className="text-sm font-medium text-white">{getCourseName(a.course_id)}</p>
                        </div>
                        {a.lesson_id && <p className="text-xs text-gray-500 ml-7 mt-1">Lesson: {a.lesson_id}</p>}
                        <div className="ml-7 flex items-center gap-3 mt-1">
                          <span className={`text-[10px] font-medium ${isCompleted ? "text-green-500" : "text-yellow-500"}`}>
                            {isCompleted ? "Completed" : "In Progress"}
                          </span>
                          <span className="text-[10px] text-gray-600">Assigned {new Date(a.assigned_at).toLocaleDateString()}</span>
                          {isCompleted && <span className="text-[10px] text-gray-600">Completed {new Date(a.completed_at).toLocaleDateString()}</span>}
                        </div>
                      </div>
                      {!isCompleted && (
                        <a href={`/training/${a.course_id}`} className="text-xs text-[#e63946] hover:underline shrink-0">
                          Start →
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Appointments tab */}
        {activeTab === "appointments" && (
          <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
            <h2 className="text-lg font-bold text-white mb-4">My Appointments</h2>
            {appointments.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#1a2d4a] p-8 text-center">
                <svg className="mx-auto h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-3 text-sm text-gray-500">No appointments</p>
                <p className="text-xs text-gray-600">Your manager hasn't set any appointments for you yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400">Upcoming</h3>
                {upcomingAppts.length === 0 ? (
                  <p className="text-xs text-gray-500">No upcoming appointments</p>
                ) : (
                  upcomingAppts.map((a: any) => (
                    <div key={a.id} className="rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e63946]/20 text-sm font-bold text-[#e63946]">
                            {a.customer_name?.[0] || "?"}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-white">{a.customer_name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(a.appointment_time).toLocaleDateString()} {new Date(a.appointment_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium text-green-500">Upcoming</span>
                      </div>
                      {a.car_description && <p className="mt-2 text-xs text-gray-400">Vehicle: {a.car_description}</p>}
                      {a.task && <p className="text-xs text-gray-500">Task: {a.task}</p>}
                      <p className="text-xs text-gray-600 mt-1">Set by {a.manager_name || a.manager_email}</p>
                    </div>
                  ))
                )}
                {pastAppts.length > 0 && (
                  <>
                    <h3 className="text-sm font-semibold text-gray-400 mt-6">Past</h3>
                    {pastAppts.map((a: any) => (
                      <div key={a.id} className="rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-3 opacity-60">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-400">{a.customer_name}</p>
                          <span className="text-[10px] text-gray-600">Past</span>
                        </div>
                        <p className="text-xs text-gray-600">{new Date(a.appointment_time).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Messages tab */}
        {activeTab === "messages" && (
          <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
            <h2 className="text-lg font-bold text-white mb-4">Messages from Manager</h2>
            {messages.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#1a2d4a] p-8 text-center">
                <svg className="mx-auto h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="mt-3 text-sm text-gray-500">No messages yet</p>
                <p className="text-xs text-gray-600">Your manager hasn't sent you any messages.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((m: any) => (
                  <div
                    key={m.id}
                    className={`rounded-lg border p-4 ${
                      m.is_read ? "border-[#1a2d4a] bg-[#0a1628]/50" : "border-[#e63946]/20 bg-[#e63946]/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#e63946]">{m.from_name || m.from_email}</span>
                      <span className="text-[10px] text-gray-600">
                        {new Date(m.created_at).toLocaleDateString()} {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{m.message}</p>
                    {!m.is_read && (
                      <span className="mt-2 inline-flex items-center rounded-full bg-[#e63946]/10 px-2 py-0.5 text-[10px] font-medium text-[#e63946]">
                        New
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}