"use client";

import { createContext, useContext, useState } from "react";
import type React from "react";

function loadSaved() {
  try { return JSON.parse(localStorage.getItem("zotok_account") ?? "{}"); }
  catch { return {}; }
}

interface UserProfileContextValue {
  avatarSrc: string | null;
  setAvatarSrc: (src: string | null) => void;
  userName: string;
  setUserName: (name: string) => void;
  bizName: string;
  setBizName: (name: string) => void;
  whatsappPhone: string;
}

const UserAvatarContext = createContext<UserProfileContextValue>({
  avatarSrc: null,
  setAvatarSrc: () => {},
  userName: "Prakash Yadav",
  setUserName: () => {},
  bizName: "JK Traders",
  setBizName: () => {},
  whatsappPhone: "+91 9876543210",
});

export function UserAvatarProvider({ children }: { children: React.ReactNode }) {
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [userName, setUserName]   = useState(() => loadSaved().name    ?? "Prakash Yadav");
  const [bizName, setBizName]     = useState(() => loadSaved().bizName ?? "JK Traders");

  return (
    <UserAvatarContext.Provider value={{
      avatarSrc, setAvatarSrc,
      userName, setUserName,
      bizName, setBizName,
      whatsappPhone: "+91 9876543210",
    }}>
      {children}
    </UserAvatarContext.Provider>
  );
}

export function useUserAvatar() {
  return useContext(UserAvatarContext);
}
