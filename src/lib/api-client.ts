// Client-side fetch shim for the direct /api handlers (replaces the broken
// TanStack createServerFn transport). Call sites keep their original shape —
// foo({ data: {...} }) — this module forwards the whole body to the API layer
// (api/handlers.mjs, wired into BOTH serve.ts and api/ssr.mjs) which accepts
// `{ data }` or bare args.
async function call(name: string, body: unknown): Promise<any> {
  const res = await fetch(`/api/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}
const shim =
  (name: string) =>
  (args: unknown): Promise<any> =>
    call(name, args);

// Manager dashboard + team
export const getTeamProgress = shim("getTeamProgress");
export const getUserProgress = shim("getUserProgress");
export const sendMessage = shim("sendMessage");
export const markMessageRead = shim("markMessageRead");
export const markLessonComplete = shim("markLessonComplete");
export const removeLessonComplete = shim("removeLessonComplete");
export const addSalesperson = shim("addSalesperson");
export const removeSalesperson = shim("removeSalesperson");
export const changeSalespersonTier = shim("changeSalespersonTier");
export const getTeamCost = shim("getTeamCost");
export const getSalesLog = shim("getSalesLog");
export const addSalesEntry = shim("addSalesEntry");
export const deleteSalesEntry = shim("deleteSalesEntry");
export const createAssignment = shim("createAssignment");
export const assignAllSalespeople = shim("assignAllSalespeople");
export const getAssignments = shim("getAssignments");
export const completeAssignment = shim("completeAssignment");
export const deleteAssignment = shim("deleteAssignment");
export const getTeamMembers = shim("getTeamMembers");
export const checkDailyLimit = shim("checkDailyLimit");
export const getSkillGaps = shim("getSkillGaps");
export const resetUserProgress = shim("resetUserProgress");

// Salesperson-facing
export const getMyAssignments = shim("getMyAssignments");
export const getMyAppointments = shim("getMyAppointments");
export const getMyMessages = shim("getMyMessages");
export const getMyNotificationCounts = shim("getMyNotificationCounts");
export const resetMyProgress = shim("resetMyProgress");
// getMyProgress maps to the dedicated /api/my-progress endpoint (existed before this layer)
export const getMyProgress = shim("my-progress");

// Planner
export const getAppointments = shim("getAppointments");
export const createAppointment = shim("createAppointment");
export const deleteAppointment = shim("deleteAppointment");

// Billing (individual self-service)
export const getUserSubscription = shim("getUserSubscription");
export const cancelSubscription = shim("cancelSubscription");
export const changeTier = shim("changeTier");
export const checkBillingDueSoon = shim("checkBillingDueSoon");
export const getPaymentLink = shim("getPaymentLink");

// Account
export const updateProfile = shim("updateProfile");

// Admin
export const upgradeDemoAccounts = shim("upgradeDemoAccounts");

// Inbox
export const syncInboxEmails = shim("syncInboxEmails");
export const getInboxEmails = shim("getInboxEmails");
export const getInboxEmail = shim("getInboxEmail");
export const markInboxRead = shim("markInboxRead");
// getAuthInfo maps to the dedicated /api/auth-info endpoint (existed before this layer)
export const getAuthInfo = shim("auth-info");
