export interface Lead {
  id: number;
  name: string;
  mobile: string;
  location: string;
  summary: string;
  avatar: string;
  color: string;
}

export interface DateGroup {
  label: string;
  leads: Lead[];
}

export type CampaignView = "connect" | "select" | "done";
