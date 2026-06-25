export const EVENT_STATUS_LIST = ["UPCOMING", "ONGOING", "ENDED"] as const;

export type EventStatus = typeof EVENT_STATUS_LIST[number];

export function isEventStatus(value: string | null): value is EventStatus {
  return typeof value === "string" && EVENT_STATUS_LIST.includes(value as EventStatus);
}

export function buildActiveEventWhere() {
  return { endDate: { gte: new Date() } };
}

export function buildStatusWhere(status?: EventStatus) {
  const now = new Date();
  if (!status) return buildActiveEventWhere();

  if (status === "UPCOMING") return { startDate: { gt: now } };
  if (status === "ENDED") return { endDate: { lt: now } };
  if (status === "ONGOING") return { startDate: { lte: now }, endDate: { gte: now } };

  return {};
}