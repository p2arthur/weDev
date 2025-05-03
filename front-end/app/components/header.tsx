import ClientOnly from "./clientOnly";
import { useWallet } from "@txnlab/use-wallet-react";
import { useContext } from "react";

import AnimButton from "./animButton";
import { WalletContext } from "../context/wallet";
import { DisconnectButton } from "./disconnectButton";
import WalletBadge from "./walletBadge";
import { useNavigate } from "@remix-run/react";
import NavigateToLaunchpadButton from "./launchpad/NavigateToLaunchpadButton";
import NavigateToRepo from "./we-repo/NavigateToWerepoButton";
import { motion } from "framer-motion";

interface HeaderProps {
  projectName?: string;
}

export function Header({ projectName }: HeaderProps) {
  const { activeAccount } = useWallet();
  const { setDisplayWalletConnectModal } = useContext(WalletContext);

  const navigate = useNavigate();

  return (
    <ClientOnly>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 w-full justify-between items-center z-30 bg-heading/50"
      >
        <div className="flex flex-col items-center justify-between">
          <div className="flex items-center justify-between w-full px-4 py-2">
            <img
              onClick={() => navigate("/")}
              src={
                import.meta.env.VITE_DAO_TOKEN_IMAGE_URL || "/weDAO logo.png"
              }
              alt="logo"
              className="h-32 cursor-pointer w-32 md:h-56 md:w-56 rounded-full bg-surface -mb-12 md:-mb-36 border-4 ring-4 ring-background border-background"
            />
            {activeAccount ? (
              <div className="flex items-center gap-2">
                <NavigateToLaunchpadButton />
                <NavigateToRepo />
                <WalletBadge />
                <DisconnectButton />
              </div>
            ) : (
              <AnimButton onClick={() => setDisplayWalletConnectModal(true)}>
                Connect
              </AnimButton>
            )}
          </div>{" "}
        </div>
        {projectName && (
          <div className="bg-[linear-gradient(270deg,#f9a826,#00f5c0,#ff92e5)] bg-[length:600%_600%] animate-gradient">
            <div className="w-full py-1  bg-[var(--background)]  text-center">
              <h2 className="text-lg font-semibold text-black">
                You're using <span className="underline">{projectName}</span>{" "}
                weDAO on mainnet
              </h2>
            </div>
          </div>
        )}
      </motion.div>
    </ClientOnly>
  );
}
