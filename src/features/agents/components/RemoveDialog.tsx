"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { AgentsState } from "@/features/agents/hooks/useAgents";

type Props = Pick<AgentsState, "removeKey" | "setRemoveKey" | "removeTargetTitle" | "remove">;

export function RemoveDialog({ removeKey, setRemoveKey, removeTargetTitle, remove }: Props) {
  return (
    <Dialog open={!!removeKey} onOpenChange={() => setRemoveKey(null)}>
      <DialogContent className="max-w-xs text-center">
        <DialogTitle>Remove?</DialogTitle>
        <p className="text-sm text-[#6d6c6b] mb-4">
          &ldquo;{removeTargetTitle}&rdquo; will be deactivated and removed from your workspace.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => setRemoveKey(null)}>Cancel</Button>
          <Button variant="destructive" className="flex-1" onClick={() => removeKey && remove(removeKey)}>Remove</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
