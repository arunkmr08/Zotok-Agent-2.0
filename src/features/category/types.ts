export type CategoryKey = "orders" | "payments" | "inventory" | "logistics" | "priority" | "sales" | "support";

export interface CategoryMeta {
  key: CategoryKey;
  label: string;
  count: number;
  color: string;
  bg: string;
}

export interface Message {
  id: number;
  time: string;
  group: string;
  groupAvatar: string;
  groupColor: string;
  thread?: string;
  sender: string;
  text: string;
  category: CategoryKey;
}
