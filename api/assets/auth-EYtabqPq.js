import { c as createSsrRpc } from "./createSsrRpc-l1y8KE69.js";
import { c as createServerFn } from "../server.js";
const signup = createServerFn({
  method: "POST"
}).handler(createSsrRpc("29d53067a15b6c3c749b565474c9e5ba5375eed02a60b4bfd7fc4415c983d284"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("3413f37ce562bd409c6edcfc5ac799a802e8aca98c19a8dbb241f2af801e245b"));
const getSession = createServerFn({
  method: "POST"
}).handler(createSsrRpc("8d7f24c3687ad1408d854b37dc5edf2d3a510b4baf76498b108805ad6fce6f0c"));
const updateProfile = createServerFn({
  method: "POST"
}).handler(createSsrRpc("8b41c00657d15b510a5abe0425ac021bd70d5707576ac4ecbda6382e421a0c7b"));
export {
  getSession as g,
  signup as s,
  updateProfile as u
};
