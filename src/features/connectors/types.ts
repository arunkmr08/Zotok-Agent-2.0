export type ConnectorKey = "gsheets" | "zotok" | "tally" | "sap" | "erpnext" | "zoho";
export type ModalView = "connect" | "loading" | "success";

export interface Connector {
  key: ConnectorKey;
  title: string;
  desc: string;
  icon: string;
  iconBg?: string;
  storageKey?: string;
}
