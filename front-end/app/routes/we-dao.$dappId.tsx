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

  const appendUserProjectData = async () => {
    const algorand = algokit.AlgorandClient.testNet();

    const appInfo = await algorand.app.getById(BigInt(dappId!));

    const address = algosdk.encodeAddress(appInfo.creator.publicKey);

    console.log("appInfo", address);
    const userLocalStorage = await getUserLocalStorage(address);

    const color = (c: number) => `#${c.toString(16).padStart(6, "0")}`;

    const backgroundColor = userLocalStorage?.background_color
      ? color(Number(userLocalStorage.background_color))
      : "#0b1e59"; // fallback dark blue

    const primaryColor = userLocalStorage?.primary_color
      ? color(Number(userLocalStorage.primary_color))
      : "#00c2ff";

    const secondaryColor = userLocalStorage?.secondary_color
      ? color(Number(userLocalStorage.secondary_color))
      : "#7fa4ff";

    const accentColor = userLocalStorage?.accent_color
      ? color(Number(userLocalStorage.accent_color))
      : "#3db2ff";

    const mappedLocalStorage: IWeRepoLocalStorage = {
      background_color: backgroundColor,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      accent_color: accentColor,
      project_username: localStorage?.project_username,
    };

    setProjectLocalStorage(mappedLocalStorage);
  };

  useEffect(() => {
    appendUserProjectData();
  }, []);

  return (
    <div className="h-screen space-y-5 mx-6 justify-center ">
      <Header />
      <div className="flex flex-col pt-10">
        <Hero />
        <MainContainer
          localStorage={projectLocalStorage!}
          dappId={Number(dappId)}
        />
      </div>
      <Footer />
      <WalletConnectionModal />
      <VoteModal />
    </div>
  );
}
