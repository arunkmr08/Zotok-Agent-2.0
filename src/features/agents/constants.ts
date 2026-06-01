import type { Agent, AgentKey, Category } from "@/features/agents/types";

export const AGENTS: Agent[] = [
  {
    key: "category",
    title: "Categorise Messages",
    desc: "Create custom categories to organize WhatsApp conversations across orders, payments, dispatch, support, inventory, and internal operations.",
    schedule: "Every 20 mins",
    capabilities: ["Intent detection", "Smart Routing", "Auto Tagging", "Priority Detection"],
    previewImage: "/assets/images/preview-categorise.png",
  },
  {
    key: "leads",
    title: "Collect New Leads",
    desc: "Capture and organize potential customer enquiries from WhatsApp groups automatically. Identify interested buyers, track follow-ups, and streamline lead conversion workflows.",
    schedule: "Realtime",
    capabilities: ["Intent detection", "Auto Capture Details", "Lead Sourcing", "Follow-up Reminders"],
    previewImage: "/assets/images/preview-leads.png",
  },
  {
    key: "sheets",
    title: "Groups To Sheets",
    desc: "Sync WhatsApp group conversations into structured spreadsheets for reporting, tracking, analytics, and operational management across sales, inventory, payments, and support.",
    schedule: "Per message",
    capabilities: ["Data Extraction", "Auto Structuring", "Sheet Sync", "Real-time Update"],
    previewImage: "/assets/images/preview-sheets.png",
  },
];

export const AGENT_COLORS: Record<AgentKey, string> = {
  category: "from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30",
  leads:    "from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30",
  sheets:   "from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30",
};

export const AGENT_ICONS: Record<AgentKey, string> = {
  category: "nav-category.svg",
  leads:    "nav-leads.svg",
  sheets:   "nav-sheets.svg",
};

export const DEFAULT_CATEGORIES: Category[] = [
  { name: "Orders & Dispatch",        checked: true,  desc: "", prompt: "Messages about placing orders, order confirmations, dispatch status, delivery updates, and shipment tracking." },
  { name: "Payments & Outstanding",   checked: true,  desc: "", prompt: "Messages related to payment receipts, pending dues, invoices, credit notes, and outstanding balance reminders." },
  { name: "Inventory & Production",   checked: true,  desc: "", prompt: "Messages about stock levels, material availability, production schedules, replenishment requests, and warehouse updates." },
  { name: "Logistics & Transport",    checked: false, desc: "", prompt: "Messages concerning vehicle assignments, route planning, driver coordination, freight details, and delivery scheduling." },
  { name: "Priority & Escalations",   checked: false, desc: "", prompt: "Urgent messages requiring immediate attention, escalations, complaints, or time-sensitive issues flagged by customers or teams." },
  { name: "Sales & Customer Follow-Ups", checked: true, desc: "", prompt: "Messages about new inquiries, quotations, follow-up conversations, deal closures, and prospective customer engagement." },
];

export const MOCK_GROUPS = [
  { name: "Distributor Orders",  members: "19 Members", avatar: "group-avatar-maroon.svg" },
  { name: "South Zone Sales",    members: "46 Members", avatar: "group-avatar-green.svg" },
  { name: "Key Customer Orders", members: "46 Members", avatar: "group-avatar-indigo.svg" },
  { name: "Sales Follow-Ups",    members: "47 Members", avatar: "group-avatar-olive.svg" },
  { name: "Pending Payments",    members: "38 Members", avatar: "group-avatar-teal.svg" },
];

export const DEFAULT_COLUMNS = ["Name", "Phone", "Message", "Group", "Date"];

export const SHEET_OPTIONS_LEADS = [
  { id: "blank", label: "Start from blank sheet" },
  { id: "feb",   label: "New leads February 2026" },
  { id: "mar",   label: "New leads March 2026" },
];

export const SHEET_OPTIONS_SHEETS = [
  { id: "blank", label: "Start from blank sheet" },
  { id: "feb",   label: "Groups data February 2026" },
  { id: "mar",   label: "Groups data March 2026" },
];
