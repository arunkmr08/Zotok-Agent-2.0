export type CategoryBadge = "Order" | "Inquiry" | "Complaint" | "Payment" | "Delivery";

export interface SheetRow {
  group: string;
  groupAvatar: string;
  groupColor: string;
  sender: string;
  phone: string;
  time: string;
  category: CategoryBadge;
  message: string;
}

export interface Sheet {
  id: string;
  name: string;
  icon: string;
  rows: SheetRow[];
}
