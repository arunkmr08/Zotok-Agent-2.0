"use client";

import Image from "next/image";
import { useConnectors } from "@/features/connectors/hooks/useConnectors";
import { ConnectorCard } from "@/features/connectors/components/ConnectorCard";
import { ConnectModal } from "@/features/connectors/components/ConnectModal";
import { DisconnectDialog } from "@/features/connectors/components/DisconnectDialog";

export default function ConnectorsPage() {
  const state = useConnectors();

  return (
    <>
      <div className="h-full overflow-y-auto">
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
          <div className="absolute top-[-10%] left-[20%] w-72 h-72 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute bottom-[10%] right-[10%] w-96 h-96 rounded-full bg-violet-400/10 blur-3xl" />
          <div className="absolute top-[40%] left-[50%] w-64 h-64 rounded-full bg-pink-400/[0.08] blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-10 pt-16 pb-10">
          <h1 className="text-2xl font-semibold text-[#34322d] dark:text-white tracking-tight">Connectors</h1>
          <div className="w-10 h-1 bg-blue-500 rounded-full my-2" />
          <p className="text-base font-medium text-[#6d6c6b] dark:text-[#7f7f7f] mt-2">
            Link external tools so Group Sense can push insights where your team already works.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-12 pb-12">
          {state.connectors.map((connector) => (
            <ConnectorCard
              key={connector.key}
              connector={connector}
              connected={state.getConnected(connector.key)}
              onConnect={() => state.handleConnect(connector.key)}
              onDisconnect={() => state.handleDisconnectRequest(connector.key)}
            />
          ))}
        </div>
      </div>

      <ConnectModal
        open={state.gsheetsModal}
        onClose={() => state.setGsheetsModal(false)}
        onDone={state.handleGsheetsConnected}
        title="Configure Collect New Leads"
        desc="Detect unknown contacts and extract lead information. Configure the columns below."
        ctaLabel="Continue In Google"
        leftIcon={
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
            <Image src="/assets/icons/zotok-logo-36.svg" alt="Zotok" width={22} height={22} />
          </div>
        }
        rightIcon={
          <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
            <Image src="/assets/icons/icon-google-sheets-sm.png" alt="Sheets" width={22} height={28} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
        }
        successTitle="Google Sheets Connected!"
        successDesc="Your Google Sheets account is now connected. Lead data will sync automatically to your configured sheet."
      />

      <ConnectModal
        open={state.zotokModal}
        onClose={() => state.setZotokModal(false)}
        onDone={state.handleZotokConnected}
        title="Connect to Zotok"
        desc="Push leads detected from your WhatsApp groups directly into Zotok campaigns for automated follow-ups."
        ctaLabel="Continue In Zotok"
        leftIcon={
          <div className="w-10 h-10 rounded-lg bg-[#589981] flex items-center justify-center flex-shrink-0">
            <Image src="/assets/icons/zotok-logo-36.svg" alt="Zotok" width={22} height={22} />
          </div>
        }
        rightIcon={
          <div className="w-10 h-10 rounded-lg bg-[#589981] flex items-center justify-center flex-shrink-0">
            <Image src="/assets/icons/zotok-logo-36.svg" alt="Zotok" width={22} height={22} />
          </div>
        }
        successTitle="Zotok Connected!"
        successDesc="Group Sense is now connected to Zotok. Detected leads will be pushed to your campaigns automatically."
      />

      <DisconnectDialog
        disconnectTarget={state.disconnectTarget}
        setDisconnectTarget={state.setDisconnectTarget}
        handleDisconnect={state.handleDisconnect}
      />
    </>
  );
}
