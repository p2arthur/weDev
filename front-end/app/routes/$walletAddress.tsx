import { useParams } from "@remix-run/react";
import { useEffect } from "react";
import { useWeRepo } from "~/context/we-repo";

export default function WalletPage() {
  const { walletAddress } = useParams();
  const { appendAllRepoProjects: appendUserProjects } = useWeRepo();

  useEffect(() => {
    if (walletAddress) {
      appendUserProjects(walletAddress);
    }
  }, [walletAddress, appendUserProjects]);

  return (
    <div>
      <h1>Welcome!</h1>
      <p>Wallet Address: {walletAddress}</p>
    </div>
  );
}
