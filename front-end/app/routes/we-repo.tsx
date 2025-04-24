import { useParams } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { useWeRepo } from "~/context/we-repo";

export default function WalletRepoPage() {
  const { walletAddress } = useParams();
  const { appendAllRepoProjects, projectsList } = useWeRepo();

  useEffect(() => {
    appendAllRepoProjects();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-24 md:mt-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={walletAddress}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div className="w-full max-w-5xl text-white">
                <h2 className="text-3xl font-bold">
                  Projects linked to {walletAddress}
                </h2>
                <p className="text-sm text-text/70 mt-2">
                  These are the repositories in the We repo and its microdapp
                  ids
                </p>
              </motion.div>

              <motion.div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {projectsList.map((project, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface p-6 rounded-xl shadow-lg text-white"
                  >
                    <h3 className="text-xl font-bold mb-2">
                      {project.project_name_desc}
                    </h3>
                    <ul className="space-y-1 text-sm text-text/70">
                      {project.project_dapp_ids.map((dappId, i) => (
                        <li key={i}>App ID: {dappId}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
