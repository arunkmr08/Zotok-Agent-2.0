"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WA_CODE } from "@/features/chat/constants";
import type { ChatState } from "@/features/chat/hooks/useChat";

type Props = Pick<ChatState, "connectModal" | "setConnectModal" | "handleSimulateConnect">;

export function ConnectWaModal({ connectModal, setConnectModal, handleSimulateConnect }: Props) {
  return (
    <Dialog open={connectModal} onOpenChange={setConnectModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Connect WhatsApp</DialogTitle>
          <p className="text-sm text-[#6d6c6b]">Link your number so Zotok can read the groups you choose.</p>
        </DialogHeader>
        <Tabs defaultValue="qr">
          <TabsList className="w-full">
            <TabsTrigger value="qr" className="flex-1">QR scan</TabsTrigger>
            <TabsTrigger value="code" className="flex-1">Pairing code</TabsTrigger>
          </TabsList>
          <TabsContent value="qr" className="pt-4">
            <div className="flex items-center justify-center w-40 h-40 mx-auto bg-[#ecebea] dark:bg-[#242424] rounded-lg border border-black/[0.08] dark:border-white/[0.08] mb-4">
              <span className="text-xs text-[#858481]">QR Code</span>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm text-[#6d6c6b] dark:text-[#adadad]">
              <li>Open WhatsApp on your phone, then tap <strong>Settings → Linked devices</strong>.</li>
              <li>Tap <strong>Link a device</strong> and point your camera at this code.</li>
            </ol>
          </TabsContent>
          <TabsContent value="code" className="pt-4">
            <div className="flex gap-2 justify-center mb-4">
              {WA_CODE.map((c, i) => (
                <div key={i} className="w-9 h-9 flex items-center justify-center bg-[#ecebea] dark:bg-[#242424] rounded font-bold text-sm border border-black/[0.08] dark:border-white/[0.08]">
                  {c}
                </div>
              ))}
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm text-[#6d6c6b] dark:text-[#adadad]">
              <li>On your phone, open WhatsApp and go to <strong>Linked devices → Link with phone number</strong>.</li>
              <li>Enter the 8-character code shown above. The code refreshes every minute.</li>
            </ol>
          </TabsContent>
        </Tabs>
        <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 mt-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
          Waiting for WhatsApp…
        </div>
        <Button className="w-full mt-2" onClick={handleSimulateConnect}>
          Simulate Connection
        </Button>
      </DialogContent>
    </Dialog>
  );
}
