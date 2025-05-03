import { MetaFunction, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { Hero } from "~/components/hero";
import { MainContainer } from "~/components/mainContainer";
import { VoteModal } from "~/components/voteModal";
import { WalletConnectionModal } from "~/components/walletConnectModal";
import { IWeRepoLocalStorage, useWeRepo } from "~/context/we-repo";
import * as algokit from "@algorandfoundation/algokit-utils";
import algosdk from "algosdk";

export const meta: MetaFunction = () => {
  return [
    { title: "weDAO" },
    { name: "Community DAO tools for everyone!", content: "weDAO" },
  ];
};

export default function Index() {
  const [projectLocalStorage, setProjectLocalStorage] =
    useState<IWeRepoLocalStorage>();

  const { dappId } = useParams();
  const { getUserLocalStorage } = useWeRepo();

  return (
    <div className="h-screen space-y-5 mx-6 justify-center ">
      <Header />
      <div className="flex flex-col pt-52">
        <Hero />
        <MainContainer dappId={Number(dappId)} />
      </div>
      <Footer />
      <WalletConnectionModal />
      <VoteModal />
    </div>
  );
}
