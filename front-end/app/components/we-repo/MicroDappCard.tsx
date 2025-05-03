import { useNavigate } from "@remix-run/react";
import { motion } from "framer-motion";

interface MicroDappCardProps {
  dappId: number;
}

export default function MicroDappCard({ dappId }: MicroDappCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.1 }}
      className="p-6 rounded-2xl shadow-lg flex flex-col justify-between cursor-pointer bg-[var(--primary)] text-black hover:bg-[var(--primary)] transition"
      onClick={() => {
        navigate(`/dapp/we-dao/${dappId}`);
      }}
    >
      <h3 className="text-lg font-bold">Microdapp ID</h3>
      <p className="text-sm mt-2">{dappId}</p>
    </motion.div>
  );
}
