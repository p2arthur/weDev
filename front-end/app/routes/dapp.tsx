import { Outlet, useOutletContext, useParams } from "@remix-run/react";
import { Header } from "~/components/header";
import { Hero } from "~/components/hero";
import * as algokit from "@algorandfoundation/algokit-utils";
import algosdk from "algosdk";
import { color } from "framer-motion";
import { useEffect, useState } from "react";
import { useWeRepo, IWeRepoLocalStorage } from "~/context/we-repo";
import { Footer } from "~/components/footer";

export default function DappLayout() {
  const { dappId } = useParams();
  const { getUserLocalStorage } = useWeRepo();
  const [projectLocalStorage, setProjectLocalStorage] =
    useState<IWeRepoLocalStorage>();
  const [loadingProjectLocalStorage, setLoadingProjectLocalStorage] =
    useState(true);

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

    setLoadingProjectLocalStorage(false);
  };

  useEffect(() => {
    appendUserProjectData();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={
        {
          "--background": projectLocalStorage?.background_color,
          "--primary": projectLocalStorage?.primary_color,
          "--secondary": projectLocalStorage?.secondary_color,
          "--accent": projectLocalStorage?.accent_color,
        } as React.CSSProperties
      }
    >
      <Header projectName="$MONKO" />
      <main className="flex-grow">
        <Outlet context={{ projectLocalStorage, loadingProjectLocalStorage }} />{" "}
        {/* This renders the child route */}
      </main>

      <Footer />
    </div>
  );
}

type ContextType = {
  projectLocalStorage?: IWeRepoLocalStorage;
  loadingProjectLocalStorage: boolean;
};

export function useProjectLocalStorage() {
  return useOutletContext<ContextType>();
}
