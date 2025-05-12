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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
              {projectsList.map((project, index) => (
                <motion.div
                  key={project.creator_address + index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => navigate(`${project.creator_address}`)}
                  className="group cursor-pointer rounded-3xl bg-white/10 backdrop-blur-lg p-6 shadow-xl border-2 border-transparent hover:border-[var(--primary)] hover:shadow-[0_0_20px_var(--primary)] transition-all duration-300"
                >
                  {/* Header */}
                  <div className="mb-6 overflow-hidden">
                    <h3 className="text-xl font-bold text-white transition-colors duration-200">
                      {project.project_name}
                    </h3>
                    <p className="text-sm text-text/60 mt-1">
                      {project.project_dapp_ids.length} MicrodApp
                      {project.project_dapp_ids.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* App IDs */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-white mb-2">
                      App IDs
                    </h4>
                    <ul className="space-y-1 text-xs text-text/70 text-left">
                      {project.project_dapp_ids.map((dappId, i) => (
                        <li key={i} className="truncate">
                          • {dappId}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto text-left">
                    <p className="text-xs text-text/60 uppercase font-semibold mb-1">
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
