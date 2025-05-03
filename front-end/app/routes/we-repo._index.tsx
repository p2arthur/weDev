import { useNavigate } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { useWeRepo } from "~/context/we-repo";
import { useWallet } from "@txnlab/use-wallet-react";
import deployHoldersContract from "~/contract-methods/holders-contract/deployHoldersContract";
import roundWalletAddress from "~/utils/roundWalletAddress";

export default function AllReposPage() {
  const { appendAllRepoProjects, projectsList, loadingProjects } = useWeRepo();
  const navigate = useNavigate();
  const { activeAccount, transactionSigner } = useWallet();

  useEffect(() => {
    appendAllRepoProjects();
  }, []);

  const handleDeployHoldersContract = async () => {
    if (!activeAccount) return;
    await deployHoldersContract(
      true,
      1,
      0,
      activeAccount.address,
      transactionSigner
    );
  };

  const color = (c: number) => `#${c.toString(16).padStart(6, "0")}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-20 mt-24 md:mt-32">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="w-full text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-heading">
                Explore Community Projects
              </h2>
              <p className="text-base text-primary mt-4 max-w-2xl mx-auto">
                These are decentralized repositories and microdApps created
                through WeDev. Discover, customize, and deploy your own versions
                easily!
              </p>
            </div>

            {/* Projects List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
              {projectsList.map((project, index) => (
                <motion.div
                  key={index}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col bg-white/10 hover:scale-105 backdrop-blur-lg overflow-hidden rounded-3xl p-8 shadow-xl text-center border-2 border-transparent transition-all hover:border-[var(--primary)] hover:text-white cursor-pointer"
                  onClick={() => navigate(`${project.creator_address}`)}
                >
                  {/* Project Header */}
                  <div className="flex flex-col gap-2 mb-6">
                    <h3 className="text-2xl font-semibold text-white">
                      {project.project_name}
                    </h3>
                    <p className="text-sm text-text/70">
                      {project.project_dapp_ids.length} MicrodApps
                    </p>
                  </div>

                  {/* MicrodApp IDs */}
                  <div className="flex flex-col items-center gap-1 mb-6">
                    <h4 className="text-lg text-white font-bold mb-2">
                      App IDs
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {project.project_dapp_ids.map((dappId, i) => (
                        <li key={i} className="text-text/70">
                          App ID: {dappId}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Project Creator */}
                  <div className="flex flex-col gap-1">
                    <p className="text-xs uppercase font-bold text-text/70 tracking-wider">
                      Created by
                    </p>
                    <p className="text-sm text-text/70 break-all">
                      {roundWalletAddress(project.creator_address)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Loading Spinner */}
            {loadingProjects && (
              <div className="flex justify-center items-center mt-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
