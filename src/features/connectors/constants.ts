import type { Connector } from "@/features/connectors/types";

export const CONNECTORS: Connector[] = [
  {
    key: "gsheets",
    title: "Google Sheets",
    desc: "Send structured data — orders, leads, decisions — directly into a spreadsheet you own.",
    icon: "connector-google-sheets.png",
    storageKey: "zotok_gsheets_connected",
  },
  {
    key: "zotok",
    title: "Zotok",
    desc: "Add leads directly into Zotok campaigns for automated follow-ups and lead nurturing workflows.",
    icon: "connector-zotok.png",
    iconBg: "bg-[#589981]",
    storageKey: "zotok_atc_connected",
  },
  {
    key: "tally",
    title: "Tally",
    desc: "Sync orders, invoices and purchase decisions captured from your groups into Tally ERP.",
    icon: "connector-tally.png",
  },
  {
    key: "sap",
    title: "SAP Business One (B1)",
    desc: "Sync masters data from SAP B1 directly into Group Sense for streamlined ERP workflows.",
    icon: "connector-sap-b1.png",
  },
  {
    key: "erpnext",
    title: "ERPNext",
    desc: "Push leads, contacts and sales data directly into your ERPNext CRM and sales pipeline.",
    icon: "connector-erpnext.png",
    iconBg: "bg-[#0089ff]",
  },
  {
    key: "zoho",
    title: "Zoho CRM",
    desc: "Automatically add new leads and contacts detected from your WhatsApp groups into Zoho CRM.",
    icon: "connector-zoho-crm.png",
  },
];
