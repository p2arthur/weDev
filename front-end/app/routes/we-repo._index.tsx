import { useNavigate, useParams } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { useWeRepo } from "~/context/we-repo";
import algosdk from "algosdk";
import roundWalletAddress from "~/utils/roundWalletAddress";

export default function AllReposPage() {
  const { appendAllRepoProjects, projectsList, loadingProjects } = useWeRepo();
  const navigate = useNavigate();

  useEffect(() => {
    appendAllRepoProjects();
  }, []);

  const color = (c: number) => `#${c.toString(16).padStart(6, "0")}`;

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-24 md:mt-32">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div className="w-full max-w-5xl text-white">
                <h2 className="text-3xl font-bold">Projects linked to</h2>
                <p className="text-sm text-text/70 mt-2">
                  These are the repositories in the We repo and its microdapp
                  ids
                </p>
              </motion.div>

              <motion.div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {projectsList.map((project, index) => (
                  <motion.div
                    initial={
                      {
                        opacity: 0,
                        y: 20,
                        "--background": color(project.background_color),
                      } as any
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                      "--background": color(project.background_color),
                    }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="pb-10 transition-all bg-surface border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white flex flex-col p-2 rounded-md cursor-pointer"
                    onClick={() => navigate(`${project.creator_address}`)}
                    style={
                      {
                        "--background": color(project.background_color),
                        "--primary": color(project.primary_color),
                        "--secondary": color(project.secondary_color),
                        "--accent": color(project.accent_color),
                      } as React.CSSProperties
                    }
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex w-full justify-end gap-2">
                        <span className="rounded-full text-xs">
                          {project.project_dapp_ids.length} microdapps
                        </span>
                        <span className="rounded-full text-xs">
                          {project.project_dapp_ids.length} microdapps
                        </span>
                        <span className="rounded-full text-xs">
                          {project.project_reputation}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {project.project_name}
                      </h3>
                    </div>
                    <div className="h-full">
                      <ul className="space-y-1 text-sm text-text/70">
                        {project.project_dapp_ids.map((dappId, i) => (
                          <li key={i}>App ID: {dappId}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2>Created by:</h2>
                      <h3 className="text-text/70 text-xs">
                        {roundWalletAddress(project.creator_address)}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
          {loadingProjects && (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yes"></div>
            </div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
