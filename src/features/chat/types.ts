export interface Message {
  role: "user" | "assistant";
  text: string;
  isStreaming?: boolean;
}

export interface Group {
  name: string;
  members: string;
  avatar: string;
  type: "business" | "personal";
}

export interface PromptPill {
  id: string;
  label: string;
  icon: string;
}
