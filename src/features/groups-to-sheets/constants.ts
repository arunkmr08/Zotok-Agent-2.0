import type { CategoryBadge, Sheet, SheetRow } from "@/features/groups-to-sheets/types";

export const BADGE_STYLES: Record<CategoryBadge, string> = {
  Order:     "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  Inquiry:   "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  Complaint: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  Payment:   "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  Delivery:  "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
};

export const GROUP_COLORS: Record<string, string> = {
  "Mumbai Traders":  "#537ff1",
  "Delhi Wholesale": "#b879ff",
  "Bangalore Tech":  "#3cc3df",
  "Chennai Buyers":  "#50c796",
  "Pune Factory":    "#ffae4c",
  "Jaipur Market":   "#ff6b6b",
  "Kolkata Dealers": "#328efa",
};

type GroupName = keyof typeof GROUP_COLORS;
function av(name: GroupName) { return name.split(" ").map((w: string) => w[0]).join(""); }

const BASE_ROWS: Omit<SheetRow, "group" | "groupAvatar" | "groupColor">[] = [
  { sender: "Ankit Sharma",  phone: "+91 98765 43210", time: "10:32 AM", category: "Order",     message: "Please confirm order #4521 for 200 units." },
  { sender: "Priya Verma",   phone: "+91 87654 32109", time: "10:45 AM", category: "Inquiry",   message: "What is the price for premium range this season?" },
  { sender: "Ravi Kumar",    phone: "+91 76543 21098", time: "11:02 AM", category: "Order",     message: "New bulk order request — 500 units needed urgently." },
  { sender: "Sneha Patel",   phone: "+91 65432 10987", time: "11:20 AM", category: "Complaint", message: "Received wrong items in last delivery, need replacement." },
  { sender: "Mohit Joshi",   phone: "+91 54321 09876", time: "11:35 AM", category: "Payment",   message: "Invoice #INV-2291 payment cleared from our end." },
  { sender: "Kavita Singh",  phone: "+91 43210 98765", time: "12:00 PM", category: "Delivery",  message: "Shipment #SH-891 ETA? Customer is waiting." },
  { sender: "Deepak Gupta",  phone: "+91 32109 87654", time: "12:15 PM", category: "Inquiry",   message: "Do you have annual subscription plans available?" },
  { sender: "Anjali Mehta",  phone: "+91 21098 76543", time: "01:00 PM", category: "Order",     message: "Repeat order from March — same specs apply." },
  { sender: "Vikas Yadav",   phone: "+91 10987 65432", time: "01:30 PM", category: "Payment",   message: "Advance payment of ₹50K sent for May batch." },
  { sender: "Pooja Agarwal", phone: "+91 99876 54321", time: "02:10 PM", category: "Delivery",  message: "Package arrived damaged, filing complaint now." },
];

function makeRows(groups: GroupName[]): SheetRow[] {
  return groups.flatMap((g) =>
    BASE_ROWS.map((r) => ({
      ...r,
      group: g,
      groupAvatar: av(g),
      groupColor: GROUP_COLORS[g],
    }))
  );
}

export const DEMO_SHEETS: Sheet[] = [
  {
    id: "group-messages",
    name: "Group Messages 2026",
    icon: "📋",
    rows: makeRows(["Mumbai Traders", "Delhi Wholesale", "Bangalore Tech", "Chennai Buyers", "Pune Factory", "Jaipur Market", "Kolkata Dealers"]),
  },
  {
    id: "customer-issues",
    name: "Customer Issues",
    icon: "🐛",
    rows: makeRows(["Mumbai Traders", "Bangalore Tech", "Chennai Buyers", "Kolkata Dealers"]),
  },
  {
    id: "factory-issues",
    name: "Factory Issues",
    icon: "🏭",
    rows: makeRows(["Pune Factory", "Bangalore Tech", "Mumbai Traders"]),
  },
  {
    id: "price-update",
    name: "Product Price Update",
    icon: "💰",
    rows: makeRows(["Delhi Wholesale", "Jaipur Market", "Mumbai Traders", "Chennai Buyers", "Pune Factory"]),
  },
  {
    id: "attendance",
    name: "Late Attendance Marks",
    icon: "📅",
    rows: makeRows(["Bangalore Tech", "Pune Factory"]),
  },
];

export const COL_LABELS: Record<keyof SheetRow, string> = {
  group: "Group",
  groupAvatar: "",
  groupColor: "",
  sender: "Sender",
  phone: "Phone",
  time: "Time",
  category: "Category",
  message: "Message",
};

export const VISIBLE_COLS: (keyof SheetRow)[] = ["group", "sender", "phone", "time", "category", "message"];
