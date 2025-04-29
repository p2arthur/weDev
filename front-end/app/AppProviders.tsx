// AppProviders.tsx

import { ReactNode } from "react";
import { ToastProvider } from "./components/toast";
import { AsaMetadataProvider } from "./context/asametadata";
import { VoteProvider } from "./context/vote";
import { WalletContextProvider } from "./context/wallet";
import { Providers } from "./services/providers";
import { LaunchpadProvider } from "./context/launchpad";
import { WeRepoProvider } from "./context/we-repo";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <WalletContextProvider>
        <WeRepoProvider>
          <LaunchpadProvider>
            <VoteProvider>
              <ToastProvider>
                <AsaMetadataProvider>{children}</AsaMetadataProvider>
              </ToastProvider>
            </VoteProvider>
          </LaunchpadProvider>
        </WeRepoProvider>
      </WalletContextProvider>
    </Providers>
  );
}
