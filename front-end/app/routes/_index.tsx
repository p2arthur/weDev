import type { MetaFunction } from "@remix-run/node";
import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { WalletConnectionModal } from "../components/walletConnectModal";
import { VoteModal } from "../components/voteModal";
import { Footer } from "../components/footer";
import { motion } from "framer-motion";
import { FaCubes, FaCoins, FaRocket } from "react-icons/fa";

export const meta: MetaFunction = () => {
  return [
    { title: "weDAO" },
    { name: "Community DAO tools for everyone!", content: "weDAO" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      <Header />
      <main className="flex-grow pt-32">
        <Hero />

        {/* MicroDapps Section */}
        <section className="flex flex-col items-center justify-center bg-background py-20">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-heading mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Deploy Your Own MicroDapps
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {/* Holders DAO */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl text-center transition-all"
            >
              <FaCubes size={48} className="text-primary mb-6" />
              <h3 className="text-2xl font-semibold text-heading mb-4">
                Holders DAO
              </h3>
              <p className="text-base text-primary">
                Create communities where voting power is based on wallet
                holdings, bringing accessible governance to everyone.
              </p>
            </motion.div>

            {/* Rewards DAO */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl text-center transition-all"
            >
              <FaCoins size={48} className="text-primary mb-6" />
              <h3 className="text-2xl font-semibold text-heading mb-4">
                Rewards DAO
              </h3>
              <p className="text-base text-primary">
                Reward participants automatically for engagement and activity —
                no complicated setups needed.
              </p>
            </motion.div>

            {/* Staking Pools */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl text-center transition-all"
            >
              <FaRocket size={48} className="text-primary mb-6" />
              <h3 className="text-2xl font-semibold text-heading mb-4">
                Staking Pools
              </h3>
              <p className="text-base text-primary">
                Launch staking pools to enable your community to earn rewards by
                participating and supporting your project.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Launchpad & Customizable MicrodApps Section */}
        <motion.section
          className="flex flex-col items-center justify-center py-24 bg-background-secondary"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h3 className="text-4xl md:text-5xl font-extrabold text-heading mb-16 text-center">
            Launchpad & Customizable Projects
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-8">
            {/* Launchpad Card */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center bg-white/10 backdrop-blur-lg rounded-3xl p-10 shadow-xl text-center"
            >
              <FaRocket size={48} className="text-primary mb-6" />
              <h4 className="text-2xl font-semibold text-heading mb-4">
                Decentralized Launchpad
              </h4>
              <p className="text-base text-primary">
                Launch your Web3 projects directly to the blockchain, secured by
                a transparent registry contract on Algorand. Full ownership, no
                middlemen.
              </p>
            </motion.div>

            {/* Customizable MicrodApps Card */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center bg-white/10 backdrop-blur-lg rounded-3xl p-10 shadow-xl text-center"
            >
              <FaCubes size={48} className="text-primary mb-6" />
              <h4 className="text-2xl font-semibold text-heading mb-4">
                Customizable MicrodApps
              </h4>
              <p className="text-base text-primary">
                Explore a growing open-source repository of microdApps — easily
                customize UIs and features to match your vision and deploy with
                ease.
              </p>
            </motion.div>
          </div>

          {/* Gamification Highlight */}
          <motion.div
            className="mt-20 flex flex-col items-center bg-white/10 backdrop-blur-lg rounded-3xl p-10 shadow-xl w-full max-w-3xl text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block bg-primary text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                Coming Soon
              </span>
              <FaCoins size={28} className="text-primary" />
            </div>
            <h4 className="text-3xl font-bold text-heading mb-4">
              Gamify your Journey
            </h4>
            <p className="text-base text-primary">
              Earn badges, achievements, and rewards as you launch, customize,
              and grow your projects — making WeDev not just a tool, but an
              experience.
            </p>
          </motion.div>
        </motion.section>
      </main>
      <Footer />
      <WalletConnectionModal />
      <VoteModal />
    </div>
  );
}
