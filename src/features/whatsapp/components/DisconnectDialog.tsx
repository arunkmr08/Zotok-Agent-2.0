"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { WhatsappState } from "@/features/whatsapp/hooks/useWhatsapp";

type Props = Pick<WhatsappState, "disconnectModal" | "setDisconnectModal" | "handleDisconnect">;

export function DisconnectDialog({ disconnectModal, setDisconnectModal, handleDisconnect }: Props) {
  return (
    <Dialog open={disconnectModal} onOpenChange={setDisconnectModal}>
      <DialogContent className="max-w-xs text-center">
        <DialogTitle>Disconnect WhatsApp?</DialogTitle>
        <p className="text-sm text-[#6d6c6b] mb-4">This will remove your WhatsApp connection and stop syncing all groups.</p>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => setDisconnectModal(false)}>Cancel</Button>
          <Button variant="destructive" className="flex-1" onClick={handleDisconnect}>Disconnect</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
