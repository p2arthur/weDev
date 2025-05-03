import { useNavigate, useParams } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import MicroDappCard from "~/components/we-repo/MicroDappCard";
import { useWeRepo } from "~/context/we-repo";
import roundWalletAddress from "~/utils/roundWalletAddress";

export default function WalletPage() {
  const { walletAddress } = useParams();
  const { appendUserProjectData, userProject } = useWeRepo();

  const navigate = useNavigate();

  useEffect(() => {
    if (walletAddress) {
      appendUserProjectData(walletAddress);
    }
  }, [walletAddress]);

  const color = (c: number) => `#${c.toString(16).padStart(6, "0")}`;

  const backgroundColor = userProject?.background_color
    ? color(userProject.background_color)
    : "#0b1e59"; // fallback dark blue

  const primaryColor = userProject?.primary_color
    ? color(userProject.primary_color)
    : "#00c2ff";

  const secondaryColor = userProject?.secondary_color
    ? color(userProject.secondary_color)
    : "#7fa4ff";

  const accentColor = userProject?.accent_color
    ? color(userProject.accent_color)
    : "#3db2ff";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, "--background": primaryColor } as any}
      animate={{ opacity: 1, y: 0, "--background": primaryColor }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pb-10 bg-[var(--background)] text-white flex flex-col"
      style={
        {
          "--background": primaryColor,
          "--primary": backgroundColor,
          "--secondary": secondaryColor,
          "--accent": accentColor,
        } as React.CSSProperties
      }
    >
      <Header />

      <main className="container mx-auto flex-1 px-4 py-8 mt-24 md:mt-32">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="w-full max-w-5xl text-center">
              <h1
                className="text-4xl font-bold"
                style={{ color: "var(--primary)" }}
              >
                {userProject?.project_name || "Unnamed Project"}
              </h1>
              <h2
                className="text-sm text-text/70 mt-2"
                style={{ color: "var(--secondary)" }}
              >
                Created by {roundWalletAddress(userProject?.creator_address!)}
              </h2>
              <p className="text-md mt-4" style={{ color: "var(--accent)" }}>
                These are the microdapps linked to your project:
              </p>
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {userProject?.project_dapp_ids?.map((dappId, index) => (
                <MicroDappCard key={index} dappId={dappId} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </motion.div>
  );
}
