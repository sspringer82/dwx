import { nowIso } from "./time-provider.js";

export function buildReportLabel() {
  return `generated at ${nowIso()}`;
}
