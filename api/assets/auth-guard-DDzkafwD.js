import { c as createSsrRpc } from "./createSsrRpc-l1y8KE69.js";
import { c as createServerFn } from "../server.js";
const getAuthInfo = createServerFn({
  method: "POST"
}).handler(createSsrRpc("3f684d671b507ac1ca775d259a4f5582e2f837c3da8d3c1d6311c2b2a59906c7"));
export {
  getAuthInfo as g
};
