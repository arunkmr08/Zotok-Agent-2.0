"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { ConnectorsState } from "@/features/connectors/hooks/useConnectors";
import { motion, AnimatePresence } from "motion/react";

type Props = Pick<ConnectorsState, "disconnectTarget" | "setDisconnectTarget" | "handleDisconnect"> & {
  open: boolean;
  triggerRect?: DOMRect | null;
};

export function DisconnectDialog({ open, triggerRect, disconnectTarget, setDisconnectTarget, handleDisconnect }: Props) {
  const [windowSize, setWindowSize] = useState({ w: 1024, h: 768 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    }
  }, [open]);

  const centerX = triggerRect ? triggerRect.left + triggerRect.width / 2 : windowSize.w / 2;
  const centerY = triggerRect ? triggerRect.top + triggerRect.height / 2 : windowSize.h / 2;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="bg-[#f8f8f7] dark:bg-[#1a1a1a] border border-black/[0.12] dark:border-white/[0.08] rounded-[18px] drop-shadow-[0px_8px_16px_rgba(0,0,0,0.06)] w-full max-w-xs flex flex-col gap-[20px] p-[21px] text-center"
          >
            <h2 className="font-semibold text-[20px] text-[#34322d] dark:text-white tracking-[-0.33px] leading-normal">Disconnect?</h2>
            <p className="text-sm text-[#6d6c6b] dark:text-[#adadad] mb-2">
              This will remove the connection and stop syncing data to this service.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setDisconnectTarget(null)}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDisconnect}>Disconnect</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
