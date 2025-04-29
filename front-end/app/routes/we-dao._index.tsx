import { MetaFunction } from "@remix-run/react";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { Hero } from "~/components/hero";
import { MainContainer } from "~/components/mainContainer";
import { VoteModal } from "~/components/voteModal";
import { WalletConnectionModal } from "~/components/walletConnectModal";

export const meta: MetaFunction = () => {
  return [
    { title: "weDAO" },
    { name: "Community DAO tools for everyone!", content: "weDAO" },
  ];
};

export default function Index() {
  return (
    <div className="h-screen space-y-5 mx-6 justify-center ">
      <Header />
      <div className="flex flex-col pt-10">
        <Hero />
      </div>
      <Footer />
      <WalletConnectionModal />
      <VoteModal />
    </div>
  );
}
