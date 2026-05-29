import type { WaGroup } from "@/features/whatsapp/types";

export const WA_CODE = ["7", "K", "9", "M", "2", "B", "4", "F"];

export const ALL_GROUPS: WaGroup[] = [
  { name: "Distributor Orders",   members: "19 Members", avatar: "group-avatar-maroon.svg", type: "business" },
  { name: "South Zone Sales",     members: "46 Members", avatar: "group-avatar-green.svg",  type: "business" },
  { name: "Key Customer Orders",  members: "46 Members", avatar: "group-avatar-indigo.svg", type: "business" },
  { name: "Sales Follow-Ups",     members: "47 Members", avatar: "group-avatar-olive.svg",  type: "business" },
  { name: "Pending Payments",     members: "38 Members", avatar: "group-avatar-teal.svg",   type: "business" },
  { name: "Invoice Confirmation", members: "26 Members", avatar: "group-avatar-violet.svg", type: "business" },
  { name: "Dealer Outstanding",   members: "44 Members", avatar: "group-avatar-red.svg",    type: "business" },
  { name: "Vendor Coordination",  members: "18 Members", avatar: "group-avatar-maroon.svg", type: "business" },
  { name: "Marketing Team",       members: "14 Members", avatar: "group-avatar-green.svg",  type: "business" },
  { name: "HR & Hiring",          members: "11 Members", avatar: "group-avatar-indigo.svg", type: "business" },
  { name: "Product Feedback",     members: "24 Members", avatar: "group-avatar-olive.svg",  type: "business" },
  { name: "Client Follow-Ups",    members: "31 Members", avatar: "group-avatar-teal.svg",   type: "business" },
  { name: "Family Group",         members: "8 Members",  avatar: "group-avatar-violet.svg", type: "personal" },
  { name: "School Friends",       members: "22 Members", avatar: "group-avatar-red.svg",    type: "personal" },
  { name: "College Batch 2018",   members: "67 Members", avatar: "group-avatar-maroon.svg", type: "personal" },
  { name: "Apartment Society",    members: "43 Members", avatar: "group-avatar-green.svg",  type: "personal" },
  { name: "Cricket Team",         members: "15 Members", avatar: "group-avatar-indigo.svg", type: "personal" },
  { name: "Movie Nights",         members: "9 Members",  avatar: "group-avatar-olive.svg",  type: "personal" },
  { name: "Weekend Trips",        members: "12 Members", avatar: "group-avatar-teal.svg",   type: "personal" },
];

export const INITIAL_SYNCED = [
  "Distributor Orders", "South Zone Sales", "Key Customer Orders",
  "Sales Follow-Ups", "Pending Payments", "Invoice Confirmation", "Dealer Outstanding",
];

export const HISTORY_OPTIONS = [
  { label: "Last 7 Days", days: 7 },
  { label: "Last 14 Days", days: 14 },
  { label: "Last 30 Days", days: 30 },
  { label: "Custom Range", days: "custom" },
];

export const GROUP_AVATARS = ["wa-group-1.svg", "wa-group-2.svg", "wa-group-3.svg", "wa-group-4.svg"];

export const MAX_FREE = 10;
