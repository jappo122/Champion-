import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTranslation, LanguageSwitcher } from "~/i18n";
import { courses } from "~/content/courses";
import {
  getTeamMembers,
  getTeamCost,
  addSalesperson,
  removeSalesperson,
  getSalesLog,
  addSalesEntry,
  deleteSalesEntry,
  getAssignments,
  createAssignment,
  deleteAssignment,
  getMyAssignments,
  getMyAppointments,
  getMyMessages,
  resetMyProgress,
} from "~/lib/manager";
import { SiteHeader } from "~/components/site-header";

export const Route = createFileRoute("/profile")({
  component: ProfileDashboard,
});

const DEMO_EMAIL = "owner@champion.com";

interface SubscriptionData {
  tier: string;
  tierLabel: string;
  price: number;
  status: string;
  nextBillingDate: string | null;
  billingDay: number | null;
  isIndividual: boolean;
  startedAt: string | null;
  cancelledAt: string | null;
  endsAt: string | null;
  canUpgrade: boolean;
  canDowngrade: boolean;
  availableUpgrades: string[];
  availableDowngrades: string[];
}

// ── Tier features for managers ──

const TIER_FEATURES: Record<string, { label: string; price: number; features: string[] }> = {
  plus: {
    label: "Plus",
    price: 169,
    features: [
      "Track team progress",
      "Assign tasks/modules based on skill gaps",
      "Add salespeople at per-person rates",
      "View team training completion",
      "Send messages to salespeople",
    ],
  },
  premium: {
    label: "Premium",
    price: 189,
    features: [
      "Everything in Plus",
      "Digital sales log",
      "Daily planner with customer appointments",
      "Set appointments with salespeople",
      "Full team calendar access",
      "Goal tracking",
    ],
  },
};

function ProfileDashboard() {
  const { t } = useTranslation();
  const [user, setUser] = useState<{ id: number; email: string; name: string | null; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [tier, setTier] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [changingTier, setChangingTier] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ── Manager-specific state ──
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [teamCost, setTeamCost] = useState<{ breakdown: Record<string, { count: number; price: number; subtotal: number }>; total: number; count: number } | null>(null);
  const [salesLog, setSalesLog] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  
  // ── Salesperson-specific state ──
  const [myAssignments, setMyAssignments] = useState<any[]>([]);
  const [myAppointments, setMyAppointments] = useState<any[]>([]);
  const [myMessages, setMyMessages] = useState<any[]>([]);

  // Add salesperson form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newTier, setNewTier] = useState("plus");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  // Sales log form
  const [showSalesLogForm, setShowSalesLogForm] = useState(false);
  const [slSalesperson, setSlSalesperson] = useState("");
  const [slCustomer, setSlCustomer] = useState("");
  const [slVehicle, setSlVehicle] = useState("");
  const [slAmount, setSlAmount] = useState("");
  const [slStatus, setSlStatus] = useState("won");
  const [slNotes, setSlNotes] = useState("");
  const [slSaving, setSlSaving] = useState(false);

  // Assignment form
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignPerson, setAssignPerson] = useState("");
  const [assignCourse, setAssignCourse] = useState("");
  const [assignLesson, setAssignLesson] = useState("");
  const [assignSaving, setAssignSaving] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<"overview" | "saleslog" | "team" | "assignments" | "settings">("overview");

  const isManagement = user?.role === "management";
  const isDemo = tier === "premium-demo";
  const hasPlus = isDemo || tier === "plus" || tier === "premium";
  const hasPremium = isDemo || tier === "premium";

  useEffect(() => {
    (async () => {
    const token = localStorage.getItem("salesdrive_token");
    if (!token) { window.location.href = "/login"; return; }
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const result = await res.json();
    if (result.user) {
        setUser(result.user);
        const isDemoUser = result.user.email === DEMO_EMAIL || result.user.id === 1;
        if (isDemoUser) setTier("premium-demo");
        // Fetch subscription
        try {
          const { getUserSubscription } = await import("~/lib/billing");
          const subRes = await getUserSubscription({ data: { token } });
          if (subRes.success && subRes.subscription) {
            setSubscription(subRes.subscription);
            setTier(isDemoUser ? "premium-demo" : subRes.subscription.tier);
          }
        } catch {}
        // Fetch progress
        fetchProgress(token).then((count) => setCompletedCount(count));
        if (!isDemoUser && !tier) {
          fetchSubscription(token).then((t) => setTier(t || "basic"));
        }
        // If management, fetch team data
        if (result.user.role === "management") {
          loadTeam(token);
          loadTeamCost(token);
          loadSalesLog(token);
          loadAssignments(token);
        }
        // If individual, fetch their assignments, appointments, messages
        if (result.user.role === "individual" || result.user.role === "user") {
          loadMyData(token);
        }
      } else {
        // Token kept — transient failures should not log you out
        window.location.href = "/login";
      }
      setLoading(false);
    })();
  }, []);

  const fetchProgress = async (token: string): Promise<number> => {
    try {
      const res = await fetch("/api/my-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success && data.completedLessons) {
        return data.completedLessons.length;
      }
    } catch {}
    return 0;
  };

  const fetchSubscription = async (token: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      return data.tier || null;
    } catch { return null; }
  };

  const loadTeam = async (token: string) => {
    const res = await getTeamMembers({ data: { token } });
    if (res.success) setTeamMembers(res.team);
  };

  const loadTeamCost = async (token: string) => {
    try {
      const res = await getTeamCost({ data: { token } });
      if (res.success) setTeamCost(res);
    } catch {}
  };

  const loadSalesLog = async (token: string) => {
    const res = await getSalesLog({ data: { token } });
    if (res.success) setSalesLog(res.entries);
  };

  const loadAssignments = async (token: string) => {
    const res = await getAssignments({ data: { token } });
    if (res.success) setAssignments(res.assignments);
  };

  const loadMyData = async (token: string) => {
    try {
      const [aRes, apRes, mRes] = await Promise.all([
        getMyAssignments({ data: { token } }),
        getMyAppointments({ data: { token } }),
        getMyMessages({ data: { token } }),
      ]);
      if (aRes.success) setMyAssignments(aRes.assignments);
      if (apRes.success) setMyAppointments(apRes.appointments);
      if (mRes.success) setMyMessages(mRes.messages);
    } catch {}
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel? This cannot be undone. Your access continues until the end of the billing period.")) return;
    setCancelling(true);
    setMessage(null);
    try {
      const { cancelSubscription } = await import("~/lib/billing");
      const token = localStorage.getItem("salesdrive_token");
      if (!token) return;
      const result = await cancelSubscription({ data: { token } });
      if (result.success) {
        setMessage({ type: "success", text: `Subscription cancelled. Access continues until ${result.lastDay}.` });
        setSubscription(null);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to cancel" });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    }
    setCancelling(false);
  };

  const handleTierChange = async (newTier: string) => {
    if (!confirm(`Change your tier to ${newTier.charAt(0).toUpperCase() + newTier.slice(1)}?`)) return;
    setChangingTier(true);
    setMessage(null);
    try {
      const { changeTier, getUserSubscription } = await import("~/lib/billing");
      const token = localStorage.getItem("salesdrive_token");
      if (!token) return;
      const result = await changeTier({ data: { token, newTier } });
      if (result.success) {
        setMessage({ type: "success", text: `Tier updated to ${result.newTier.charAt(0).toUpperCase() + result.newTier.slice(1)} ($${result.newPrice}/mo).` });
        const subRes = await getUserSubscription({ data: { token } });
        if (subRes.success && subRes.subscription) {
          setSubscription(subRes.subscription);
          setTier(subRes.subscription.tier);
        }
      } else {
        setMessage({ type: "error", text: result.error || "Failed to change tier" });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    }
    setChangingTier(false);
  };

  const handleAddSalesperson = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("salesdrive_token");
    if (!token || !newEmail.trim()) return;
    setAdding(true);
    setAddError("");
    
    // Create the salesperson account FIRST (generates password, sends welcome email)
    const res = await addSalesperson({ data: { token, email: newEmail.trim(), name: newName.trim(), tier: newTier } });
    if (res.success) {
      setNewEmail("");
      setNewName("");
      loadTeam(token);
      // Then redirect to Stripe for payment
      const STRIPE_LINKS: Record<string, string> = {
        basic: "https://buy.stripe.com/cNibJ1bL02YI8zofMb8Vi0i",
        plus: "https://buy.stripe.com/3cI7sL2aqbve7vkgQf8Vi0j",
        premium: "https://buy.stripe.com/28E00j02ibveaHw43t8Vi0k",
      };
      const stripeLink = STRIPE_LINKS[newTier] || STRIPE_LINKS.plus;
      const returnUrl = encodeURIComponent(`${window.location.origin}/profile`);
      window.location.href = `${stripeLink}?prefilled_email=${encodeURIComponent(newEmail.trim())}&success_url=${returnUrl}`;
    } else {
      setAddError(res.error || "Failed to add salesperson");
    }
    setAdding(false);
  };

  const handleRemoveSalesperson = async (userId: number) => {
    const token = localStorage.getItem("salesdrive_token");
    if (!token) return;
    if (!confirm("Remove this salesperson? Their subscription will be cancelled.")) return;
    await removeSalesperson({ data: { token, userId } });
    loadTeam(token);
  };

  const handleAddSalesEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("salesdrive_token");
    if (!token || !slCustomer.trim() || !slVehicle.trim() || !slAmount.trim()) return;
    setSlSaving(true);
    await addSalesEntry({
      data: {
        token,
        salespersonId: slSalesperson ? parseInt(slSalesperson) : undefined,
        customerName: slCustomer,
        vehicle: slVehicle,
        amount: parseFloat(slAmount),
        status: slStatus,
        notes: slNotes || undefined,
      },
    });
    setShowSalesLogForm(false);
    setSlCustomer("");
    setSlVehicle("");
    setSlAmount("");
    setSlNotes("");
    loadSalesLog(token);
    setSlSaving(false);
  };

  const handleDeleteSalesEntry = async (id: number) => {
    const token = localStorage.getItem("salesdrive_token");
    if (!token) return;
    await deleteSalesEntry({ data: { token, entryId: id } });
    loadSalesLog(token);
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("salesdrive_token");
    if (!token || !assignPerson || !assignCourse) return;
    setAssignSaving(true);
    await createAssignment({
      data: {
        token,
        salespersonId: parseInt(assignPerson),
        courseId: assignCourse,
        lessonId: assignLesson || undefined,
      },
    });
    setShowAssignForm(false);
    setAssignPerson("");
    setAssignCourse("");
    setAssignLesson("");
    loadAssignments(token);
    setAssignSaving(false);
  };

  const handleDeleteAssignment = async (id: number) => {
    const token = localStorage.getItem("salesdrive_token");
    if (!token) return;
    await deleteAssignment({ data: { token, assignmentId: id } });
    loadAssignments(token);
  };

  const totalLessons = courses.reduce((s, c) => s + (c.lessonsList?.length || 0), 0);
  const tierLabel = isDemo ? "Premium (Demo)" : subscription?.tierLabel || tier?.charAt(0).toUpperCase() + tier?.slice(1) || "Basic";

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

  if (!user) return null;

  // ══════════════════════════════════════════════════════════════════════════
  // HEADER
  // ══════════════════════════════════════════════════════════════════════════

  const Header = () => (
    <SiteHeader />
  );

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 1: TIER ABILITIES (management only)
  // ══════════════════════════════════════════════════════════════════════════

  const TierAbilities = () => {
    const currentTier = isDemo ? "premium" : (tier || "plus");
    const tierInfo = TIER_FEATURES[currentTier] || TIER_FEATURES.plus;
    const allFeatures = isDemo ? TIER_FEATURES.premium.features : tierInfo.features;

    return (
      <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
        <h2 className="text-lg font-bold text-white mb-4">Plan Features</h2>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#e63946]/10 px-4 py-1.5 text-sm font-medium text-[#e63946]">
          {isDemo ? "Premium (Demo — All Access)" : `${tierInfo.label} — $${tierInfo.price}/mo`}
        </div>
        <ul className="mt-4 space-y-3">
          {allFeatures.map((feat, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feat}
            </li>
          ))}
        </ul>
        {!isDemo && currentTier === "plus" && (
          <div className="mt-4 rounded-lg border border-[#f77f00]/30 bg-[#f77f00]/5 p-3 text-xs text-[#f77f00]">
            Upgrade to Premium ($189/mo) to unlock sales log, daily planner, goal tracking, and full team calendar.
          </div>
        )}
        {!isDemo && currentTier === "premium" && (
          <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/5 p-3 text-xs text-green-500">
            You have access to all features. Your team is getting the full Champion experience.
          </div>
        )}
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 2: SALES LOG (management only)
  // ══════════════════════════════════════════════════════════════════════════

  const SalesLogSection = () => {
    const canAccess = isDemo || hasPremium;

    if (!canAccess) {
      return (
        <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
          <h2 className="text-lg font-bold text-white mb-2">Sales Log</h2>
          <p className="text-sm text-gray-500">Upgrade to Premium to track your team's sales performance.</p>
        </div>
      );
    }

    return (
      <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Sales Log</h2>
          <button
            onClick={() => setShowSalesLogForm(!showSalesLogForm)}
            className="rounded-lg bg-[#e63946] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#c1121f] transition-colors"
          >
            {showSalesLogForm ? "Cancel" : "+ Add Entry"}
          </button>
        </div>

        {/* Add entry form */}
        {showSalesLogForm && (
          <form onSubmit={handleAddSalesEntry} className="mb-6 rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-400">Customer Name</label>
                <input type="text" required value={slCustomer} onChange={(e) => setSlCustomer(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]" placeholder="John Smith" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400">Vehicle</label>
                <input type="text" required value={slVehicle} onChange={(e) => setSlVehicle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]" placeholder="2024 Toyota Camry" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-gray-400">Amount ($)</label>
                <input type="number" step="0.01" required value={slAmount} onChange={(e) => setSlAmount(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]" placeholder="35000" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400">Status</label>
                <select value={slStatus} onChange={(e) => setSlStatus(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]">
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400">Salesperson (optional)</label>
                <select value={slSalesperson} onChange={(e) => setSlSalesperson(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]">
                  <option value="">None</option>
                  {teamMembers.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.name || m.email}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400">Notes</label>
              <textarea value={slNotes} onChange={(e) => setSlNotes(e.target.value)} rows={2}
                className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]" placeholder="Optional notes..." />
            </div>
            <button type="submit" disabled={slSaving} className="rounded-lg bg-[#e63946] px-4 py-2 text-xs font-medium text-white hover:bg-[#c1121f] disabled:opacity-50">
              {slSaving ? "Saving..." : "Save Entry"}
            </button>
          </form>
        )}

        {/* Sales log entries */}
        {salesLog.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#1a2d4a] p-8 text-center">
            <svg className="mx-auto h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-3 text-sm text-gray-500">No sales entries yet</p>
            <p className="text-xs text-gray-600">Add your first sale to start tracking your team's performance.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {salesLog.slice(0, 10).map((entry: any) => (
              <div key={entry.id} className="flex items-center justify-between rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate">{entry.customer_name}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      entry.status === "won" ? "bg-green-500/10 text-green-500" :
                      entry.status === "lost" ? "bg-red-500/10 text-red-500" :
                      "bg-yellow-500/10 text-yellow-500"
                    }`}>{entry.status}</span>
                  </div>
                  <p className="text-xs text-gray-500">{entry.vehicle} {entry.salesperson_name ? `— ${entry.salesperson_name}` : ""}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold text-white">${Number(entry.amount).toLocaleString()}</span>
                  <button onClick={() => handleDeleteSalesEntry(entry.id)} className="text-xs text-gray-600 hover:text-[#e63946] transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 3: SALESPEOPLE LIST (management only)
  // ══════════════════════════════════════════════════════════════════════════

  const SalespeopleSection = () => {
    return (
      <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Your Sales Team</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="rounded-lg bg-[#e63946] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#c1121f] transition-colors"
          >
            {showAddForm ? "Cancel" : "+ Add Salesperson"}
          </button>
        </div>

        {/* Add salesperson form */}
        {showAddForm && (
          <form onSubmit={handleAddSalesperson} className="mb-6 rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-400">Email *</label>
                <input type="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]" placeholder="salesperson@dealership.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400">Name</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]" placeholder="John Doe" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400">Tier</label>
              <select value={newTier} onChange={(e) => setNewTier(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]">
                <option value="basic">Basic — $149/mo</option>
                <option value="plus">Plus — $169/mo</option>
                <option value="premium">Premium — $189/mo</option>
              </select>
            </div>
            {addError && <div className="rounded-lg bg-[#e63946]/10 p-2 text-xs text-[#e63946]">{addError}</div>}
            <div className="flex gap-3">
              <button type="submit" disabled={adding} className="rounded-lg bg-[#e63946] px-4 py-2 text-xs font-medium text-white hover:bg-[#c1121f] disabled:opacity-50">
                {adding ? "Redirecting..." : "Pay & Add Salesperson"}
              </button>
            </div>
          </form>
        )}

        {/* Team members list */}
        {teamMembers.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#1a2d4a] p-8 text-center">
            <svg className="mx-auto h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <p className="mt-3 text-sm text-gray-500">No team members yet</p>
            <p className="text-xs text-gray-600">Add salespeople to start tracking their progress.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {teamMembers.map((m: any) => (
              <div key={m.id} className="flex items-center gap-3 rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1a2d4a] to-[#0a1628] text-sm font-bold text-[#e63946]">
                  {(m.name?.[0] || m.email[0]).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{m.name || m.email}</p>
                  <p className="text-xs text-gray-500 truncate">{m.email}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] font-medium text-gray-500 capitalize">{m.tier}</span>
                    <span className="text-[10px] text-gray-600">·</span>
                    <span className="text-[10px] text-gray-500">{m.percent}% complete</span>
                  </div>
                  <div className="mt-1 h-1 w-full rounded-full bg-[#1a2d4a]">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#e63946] to-[#f77f00]" style={{ width: `${m.percent}%` }} />
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveSalesperson(m.id)}
                  className="text-xs text-gray-600 hover:text-[#e63946] transition-colors shrink-0"
                  title="Remove"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 4: ASSIGN TASKS & MODULES (management only)
  // ══════════════════════════════════════════════════════════════════════════

  const AssignmentsSection = () => {
    return (
      <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Assign Tasks & Modules</h2>
          <button
            onClick={() => setShowAssignForm(!showAssignForm)}
            className="rounded-lg bg-[#e63946] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#c1121f] transition-colors"
          >
            {showAssignForm ? "Cancel" : "+ New Assignment"}
          </button>
        </div>

        {/* Create assignment form */}
        {showAssignForm && (
          <form onSubmit={handleCreateAssignment} className="mb-6 rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-400">Salesperson *</label>
                <select required value={assignPerson} onChange={(e) => setAssignPerson(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]">
                  <option value="">Select a salesperson...</option>
                  {teamMembers.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.name || m.email}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400">Course *</label>
                <select required value={assignCourse} onChange={(e) => setAssignCourse(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]">
                  <option value="">Select a course...</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400">Specific Lesson (optional)</label>
              <select value={assignLesson} onChange={(e) => setAssignLesson(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white outline-none focus:border-[#e63946]">
                <option value="">Entire course</option>
                {courses.find((c) => c.id === assignCourse)?.lessonsList.map((l) => (
                  <option key={l.id} value={l.id}>{l.title}</option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={assignSaving} className="rounded-lg bg-[#e63946] px-4 py-2 text-xs font-medium text-white hover:bg-[#c1121f] disabled:opacity-50">
              {assignSaving ? "Assigning..." : "Create Assignment"}
            </button>
          </form>
        )}

        {/* Pending assignments */}
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Recent Assignments</h3>
        {assignments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#1a2d4a] p-8 text-center">
            <svg className="mx-auto h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="mt-3 text-sm text-gray-500">No assignments yet</p>
            <p className="text-xs text-gray-600">Assign training modules to your team members.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {assignments.slice(0, 10).map((a: any) => {
              const course = courses.find((c) => c.id === a.course_id);
              const isCompleted = !!a.completed_at;
              return (
                <div key={a.id} className="flex items-center justify-between rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{course?.title || a.course_id}</p>
                    <p className="text-xs text-gray-500">Assigned to {a.salesperson_name || a.salesperson_email}</p>
                    {a.lesson_id && <p className="text-xs text-gray-600">Lesson: {a.lesson_id}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-medium ${isCompleted ? "text-green-500" : "text-yellow-500"}`}>
                        {isCompleted ? "✓ Completed" : "○ Pending"}
                      </span>
                      <span className="text-[10px] text-gray-600">{new Date(a.assigned_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAssignment(a.id)}
                    className="text-xs text-gray-600 hover:text-[#e63946] transition-colors shrink-0"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ══════════════════════════════════════════════════════════════════════════

  // ── Individual user view ──
  if (!isManagement) {
    return (
      <div className="min-h-dvh bg-[#0a1628]">
        <Header />
        <main className="mx-auto max-w-5xl px-6 pt-10 pb-12">
          {message && (
            <div className={`mb-6 rounded-lg p-4 text-sm ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-[#e63946]/10 text-[#e63946]"}`}>
              {message.text}
            </div>
          )}

          {/* User info + tier badge */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1a2d4a] to-[#0a1628] text-2xl font-bold text-[#e63946]">
                {(user.name?.[0] || user.email[0]).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user.name || "Welcome"}</h1>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="/training" className="rounded-lg border border-[#1a2d4a] px-4 py-2 text-xs font-medium text-gray-300 hover:bg-[#1a2d4a]/50 transition-colors">
                ← Back to Training
              </a>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e63946]/10 px-4 py-2 text-sm font-medium text-[#e63946]">
                <span className="flex h-2 w-2 rounded-full bg-[#e63946]" />{tierLabel}
              </span>
              {isDemo && <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-500">Demo Account — All Access</span>}
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white">Training Progress</h2>
              <span className="text-sm text-gray-400">{completedCount}/{totalLessons} lessons</span>
            </div>
            <div className="h-3 w-full rounded-full bg-[#1a2d4a]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#e63946] to-[#f77f00] transition-all duration-500"
                style={{ width: `${totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0}%` }} />
            </div>
            {completedCount > 0 && (
              <button
                onClick={async () => {
                  if (!confirm("Reset all training progress? This cannot be undone.")) return;
                  const token = localStorage.getItem("salesdrive_token");
                  if (!token) return;
                  try {
                    await resetMyProgress({ data: { token } });
                    window.location.reload();
                  } catch {}
                }}
                className="mt-3 text-xs text-gray-500 hover:text-[#e63946] transition-colors"
              >
                Reset All Progress
              </button>
            )}
          </div>

          {/* Subscription Info */}
          {subscription && !isDemo && (
            <div className="mb-8 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
              <h2 className="text-lg font-bold text-white mb-4">Subscription Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Current Plan</p>
                  <p className="text-lg font-bold text-white">{subscription.tierLabel} <span className="text-sm font-normal text-gray-400">(${subscription.price}/mo)</span></p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Next Billing Date</p>
                  <p className="text-lg font-bold text-white">{subscription.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString() : "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Billing Day</p>
                  <p className="text-lg font-bold text-white">{subscription.billingDay ? `${subscription.billingDay}th of each month` : "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                  <p className="text-lg font-bold text-green-500 capitalize">{subscription.status}</p>
                </div>
              </div>
              {subscription.isIndividual && (
                <div className="mt-6 border-t border-[#1a2d4a] pt-6">
                  <h3 className="text-sm font-bold text-white mb-4">Change Plan</h3>
                  <div className="flex flex-wrap gap-3">
                    {subscription.availableDowngrades.map((downgrade) => (
                      <button key={downgrade} onClick={() => handleTierChange(downgrade)} disabled={changingTier}
                        className="rounded-lg border border-[#1a2d4a] px-4 py-2 text-sm text-white transition-colors hover:border-[#f77f00] hover:bg-[#f77f00]/10 disabled:opacity-50">
                        Downgrade to {downgrade.charAt(0).toUpperCase() + downgrade.slice(1)}
                      </button>
                    ))}
                    {subscription.availableUpgrades.map((upgrade) => (
                      <button key={upgrade} onClick={() => handleTierChange(upgrade)} disabled={changingTier}
                        className="rounded-lg border border-[#e63946] bg-[#e63946]/10 px-4 py-2 text-sm font-medium text-[#e63946] transition-colors hover:bg-[#e63946] hover:text-white disabled:opacity-50">
                        Upgrade to {upgrade.charAt(0).toUpperCase() + upgrade.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick links */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a href="/training" className="flex items-center gap-4 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-5 transition-all duration-200 hover:border-[#e63946]/50 hover:shadow-lg hover:shadow-[#e63946]/5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a2d4a] group-hover:bg-[#e63946]/20">
                <svg className="h-5 w-5 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="font-medium text-white group-hover:text-[#e63946] transition-colors">Training Modules</span>
            </a>
            <a href="/steps" className="flex items-center gap-4 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-5 transition-all duration-200 hover:border-[#e63946]/50 hover:shadow-lg hover:shadow-[#e63946]/5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a2d4a] group-hover:bg-[#e63946]/20">
                <svg className="h-5 w-5 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="font-medium text-white group-hover:text-[#e63946] transition-colors">Steps of the Sale</span>
            </a>
            <a href="/account" className="flex items-center gap-4 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-5 transition-all duration-200 hover:border-[#e63946]/50 hover:shadow-lg hover:shadow-[#e63946]/5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a2d4a] group-hover:bg-[#e63946]/20">
                <svg className="h-5 w-5 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-medium text-white group-hover:text-[#e63946] transition-colors">Settings</span>
            </a>
          </div>

          {/* Salesperson's Assigned Modules & Messages */}
          {(myAssignments.length > 0 || myMessages.length > 0 || myAppointments.length > 0) && (
            <div className="mt-8 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">From Your Manager</h2>
                <a href="/planner" className="text-xs text-[#e63946] hover:underline">View Full Planner →</a>
              </div>
              
              {/* Assigned modules */}
              {myAssignments.filter((a: any) => !a.completed_at).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Assigned Modules ({myAssignments.filter((a: any) => !a.completed_at).length})</h3>
                  <div className="space-y-2">
                    {myAssignments.filter((a: any) => !a.completed_at).slice(0, 3).map((a: any) => {
                      const course = courses.find((c) => c.id === a.course_id);
                      return (
                        <div key={a.id} className="flex items-center justify-between rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">{course?.title || a.course_id}</p>
                            <p className="text-xs text-gray-500">{a.lesson_id ? `Lesson: ${a.lesson_id}` : "Full course"}</p>
                          </div>
                          <a href={`/training/${a.course_id}`} className="text-xs text-[#e63946] hover:underline shrink-0 ml-3">Start</a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upcoming appointments */}
              {myAppointments.filter((a: any) => new Date(a.appointment_time) > new Date()).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Upcoming Appointments</h3>
                  <div className="space-y-2">
                    {myAppointments.filter((a: any) => new Date(a.appointment_time) > new Date()).slice(0, 3).map((a: any) => (
                      <div key={a.id} className="flex items-center justify-between rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-3">
                        <div>
                          <p className="text-sm font-medium text-white">{a.customer_name}</p>
                          <p className="text-xs text-gray-500">{new Date(a.appointment_time).toLocaleDateString()} {new Date(a.appointment_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent messages */}
              {myMessages.filter((m: any) => !m.is_read).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Unread Messages ({myMessages.filter((m: any) => !m.is_read).length})</h3>
                  <div className="space-y-2">
                    {myMessages.filter((m: any) => !m.is_read).slice(0, 3).map((m: any) => (
                      <div key={m.id} className="rounded-lg border border-[#e63946]/20 bg-[#e63946]/5 p-3">
                        <p className="text-xs font-medium text-[#e63946]">{m.from_name || "Manager"}</p>
                        <p className="mt-1 text-sm text-gray-300 line-clamp-2">{m.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cancel Subscription */}
          {!isDemo && subscription && subscription.isIndividual && (
            <div className="mt-8 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
              <h2 className="text-lg font-bold text-white mb-4">Cancel Subscription</h2>
              <p className="text-sm text-gray-400 mb-4">Cancelling will stop future charges. You'll retain access until the end of your billing period.</p>
              <button onClick={handleCancel} disabled={cancelling}
                className="rounded-lg border border-[#e63946] px-6 py-2.5 text-sm font-medium text-[#e63946] transition-colors hover:bg-[#e63946] hover:text-white disabled:opacity-50">
                {cancelling ? "Cancelling..." : "Cancel Subscription"}
              </button>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ── Management account view ──
  return (
    <div className="min-h-dvh bg-[#0a1628]">
      <Header />
      <main className="mx-auto max-w-5xl px-6 pt-10 pb-12">
        {message && (
          <div className={`mb-6 rounded-lg p-4 text-sm ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-[#e63946]/10 text-[#e63946]"}`}>
            {message.text}
          </div>
        )}

        {/* User info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1a2d4a] to-[#0a1628] text-2xl font-bold text-[#e63946]">
              {(user.name?.[0] || user.email[0]).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user.name || "Manager Dashboard"}</h1>
              <p className="text-sm text-gray-400">{user.email}</p>
              <span className="inline-flex items-center gap-1.5 mt-1 rounded-full bg-[#e63946]/10 px-3 py-1 text-xs font-medium text-[#e63946]">
                <span className="flex h-2 w-2 rounded-full bg-[#e63946]" />Management Account
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isDemo && <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-500">Demo Account — All Access</span>}
            <a href="/training" className="rounded-lg border border-[#1a2d4a] px-4 py-2 text-xs font-medium text-gray-300 hover:bg-[#1a2d4a]/50 transition-colors">
              ← Back to Training
            </a>
            <a href="/manager" className="rounded-lg bg-[#e63946] px-4 py-2 text-xs font-medium text-white hover:bg-[#c1121f] transition-colors">
              Manager Dashboard →
            </a>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="mb-6 flex gap-1 rounded-lg bg-[#0d1f35] p-1 overflow-x-auto">
          {[
            { id: "overview" as const, label: "Overview" },
            { id: "team" as const, label: "Sales Team" },
            { id: "saleslog" as const, label: "Sales Log" },
            { id: "assignments" as const, label: "Assignments" },
            { id: "settings" as const, label: "Settings" },
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

        {/* Tab content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <>
              <TierAbilities />
              {/* Monthly Team Cost */}
              {teamCost && (
                <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
                  <h2 className="text-lg font-bold text-white mb-4">Monthly Team Cost</h2>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4">
                      <p className="text-sm font-medium text-white">Base Plan</p>
                      <p className="text-xs text-gray-500 mt-1">${tier === "premium" ? "189" : "169"}/mo — {tier === "premium" ? "Premium" : "Plus"} Management Account</p>
                    </div>
                    {Object.entries(teamCost.breakdown).map(([tierKey, info]) => (
                      <div key={tierKey} className="rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white capitalize">{info.count} Salesperson{info.count > 1 ? "s" : ""} — {tierKey.charAt(0).toUpperCase() + tierKey.slice(1)} Tier</p>
                            <p className="text-xs text-gray-500 mt-1">${info.price}/mo each</p>
                          </div>
                          <p className="text-sm font-bold text-white">${info.subtotal}/mo</p>
                        </div>
                      </div>
                    ))}
                    <div className="rounded-lg border border-[#e63946]/30 bg-[#e63946]/5 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-white">Total Monthly Cost</p>
                        <p className="text-lg font-bold text-[#e63946]">${(teamCost.total + (tier === "premium" ? 189 : 169))}/mo</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{teamCost.count} salesperson{teamCost.count !== 1 ? "s" : ""} + base plan</p>
                    </div>
                  </div>
                </div>
              )}
              {/* Training Progress */}
              <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
                <h2 className="text-lg font-bold text-white mb-4">Training Progress</h2>
                <p className="text-sm text-gray-400">Your team has completed {teamMembers.reduce((s: number, m: any) => s + m.completedLessons, 0)} of {teamMembers.reduce((s: number, m: any) => s + m.totalLessons, 0)} lessons overall.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {teamMembers.length === 0 ? (
                    <p className="text-sm text-gray-500 col-span-2">Add salespeople to see their progress.</p>
                  ) : (
                    teamMembers.slice(0, 4).map((m: any) => (
                      <div key={m.id} className="rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-white truncate">{m.name || m.email}</span>
                          <span className="text-xs text-gray-500">{m.percent}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[#1a2d4a]">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#e63946] to-[#f77f00]" style={{ width: `${m.percent}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === "team" && <SalespeopleSection />}
          {activeTab === "saleslog" && <SalesLogSection />}
          {activeTab === "assignments" && <AssignmentsSection />}

          {activeTab === "settings" && (
            <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
              <h2 className="text-lg font-bold text-white mb-4">Account Settings</h2>
              <p className="text-sm text-gray-400 mb-4">Manage your account preferences.</p>
              <div className="space-y-4">
                {!isDemo && subscription && (
                  <div className="rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4">
                    <p className="text-sm font-medium text-white">Current Plan: {subscription.tierLabel} (${subscription.price}/mo)</p>
                    <p className="text-xs text-gray-500 mt-1">Next billing: {subscription.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString() : "N/A"}</p>
                  </div>
                )}
                <WebinarUrlSetting />
                <a href="/account" className="inline-flex items-center gap-2 text-sm text-[#e63946] hover:underline">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Full Account Settings
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ── Webinar URL Setting Component ─────────────────────────────────────────
function WebinarUrlSetting() {
  const [webinarUrl, setWebinarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/webinar-url")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.url) setWebinarUrl(data.url);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("salesdrive_token");
    if (!token) return;
    setSaving(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/webinar-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, url: webinarUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: "success", text: "Webinar URL saved successfully." });
      } else {
        setStatusMsg({ type: "error", text: data.error || "Failed to save." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Something went wrong." });
    }
    setSaving(false);
  };

  return (
    <div className="rounded-lg border border-[#1a2d4a] bg-[#0a1628] p-4">
      <h3 className="text-sm font-bold text-white mb-2">Webinar Configuration</h3>
      <p className="text-xs text-gray-500 mb-3">Set the URL for your live webinar. This will appear on the /webinars page for all attendees.</p>
      <div className="flex gap-3">
        <input
          type="url"
          value={webinarUrl}
          onChange={(e) => setWebinarUrl(e.target.value)}
          placeholder="https://zoom.us/j/your-webinar-link"
          className="flex-1 rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#e63946]"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="shrink-0 rounded-lg bg-[#e63946] px-4 py-2 text-sm font-medium text-white hover:bg-[#c1121f] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
      {statusMsg && (
        <p className={`mt-2 text-xs ${statusMsg.type === "success" ? "text-green-500" : "text-[#e63946]"}`}>
          {statusMsg.text}
        </p>
      )}
    </div>
  );
}