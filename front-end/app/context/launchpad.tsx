import { TransactionSigner } from "algosdk";
import React, { createContext, useContext, useEffect, useState } from "react";
import deployHoldersContract from "~/contract-methods/holders-contract/deployHoldersContract";
import { Web3Tool } from "~/Web3Tools/Web3ToolTypes";
import { IWeRepoProject, useWeRepo } from "./we-repo";
import { useWallet } from "@txnlab/use-wallet-react";
import { getRepoApplicationClient } from "~/contract-methods/repository-contract/get-client";

interface ProjectToLaunchMetadata {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projectTitle: string;
  web3Tools: Web3Tool[];
}

interface LaunchpadContextType {
  launchNewProject: (
    project: IWeRepoProject,
    anyoneCanCreate: boolean,
    minHolding: number,
    assetId: number
  ) => Promise<void>;
}

const LaunchpadContext = createContext<LaunchpadContextType | undefined>(
  undefined
);

export const LaunchpadProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [launchNewPojectMetadata, setLaunchNewPojectMetadata] = useState<
    ProjectToLaunchMetadata[]
  >([]);

  const { createNewProject } = useWeRepo();

  const { activeAccount, transactionSigner } = useWallet();

  const launchNewProject = async (
    project: IWeRepoProject,
    anyoneCanCreate: boolean,
    minHolding: number,
    assetId: number
  ): Promise<void> => {
    try {
      if (!activeAccount) return;

      console.log("launchNewProject", project);

      const result = await createNewProject(
        transactionSigner,
        activeAccount.address,
        project
      );

      const appClient = await deployHoldersContract(
        false,
        0,
        0,
        activeAccount.address,
        transactionSigner
      );
      console.log("appClient", appClient);

      const appId = appClient.appId;
      const repoAppClient = await getRepoApplicationClient();

      await repoAppClient.send.createProjectMicroDapp({
        args: [appId, 1, activeAccount.address],
        sender: activeAccount.address,
        signer: transactionSigner,
      });
    } catch (error) {
      console.error("error creaing new project", error);
      throw new Error("Error launching new project: " + error);
    }
  };

  return (
    <LaunchpadContext.Provider value={{ launchNewProject }}>
      {children}
    </LaunchpadContext.Provider>
  );
};

export const useLaunchpad = (): LaunchpadContextType => {
  const context = useContext(LaunchpadContext);
  if (!context) {
    throw new Error(
      "useAsaMetadata must be used within an AsaMetadataProvider"
    );
  }
  return context;
};
