export type AgentKey = "category" | "leads" | "sheets";
export type AgentState = "active" | "inactive";

export interface Agent {
  key: AgentKey;
  title: string;
  desc: string;
  schedule: string;
}

export interface Category {
  name: string;
  desc: string;
  prompt: string;
  checked?: boolean;
}

export type CatView = "list" | "create" | "success";
export type LeadsView = "connect" | "loading" | "picker" | "columns" | "groups" | "success";
export type SheetsView = "connect" | "loading" | "picker" | "columns" | "success";
