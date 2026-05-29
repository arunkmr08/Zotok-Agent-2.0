"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { ConnectorsState } from "@/features/connectors/hooks/useConnectors";

type Props = Pick<ConnectorsState, "disconnectTarget" | "setDisconnectTarget" | "handleDisconnect">;

export function DisconnectDialog({ disconnectTarget, setDisconnectTarget, handleDisconnect }: Props) {
  return (
    <Dialog open={!!disconnectTarget} onOpenChange={() => setDisconnectTarget(null)}>
      <DialogContent className="max-w-xs text-center">
        <DialogTitle>Disconnect?</DialogTitle>
        <p className="text-sm text-[#6d6c6b] mb-4">
          This will remove the connection and stop syncing data to this service.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => setDisconnectTarget(null)}>Cancel</Button>
          <Button variant="destructive" className="flex-1" onClick={handleDisconnect}>Disconnect</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
