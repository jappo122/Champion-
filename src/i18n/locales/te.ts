import { translations as en } from "./en";

export const translations: Record<string, string> = Object.keys(en).reduce((acc, key) => {
  acc[key] = en[key];
  return acc;
}, {} as Record<string, string>);

export default translations;
