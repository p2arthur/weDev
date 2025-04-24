import algosdk from "algosdk";
import { createContext, useState, ReactNode, useContext } from "react";
import { byteArrayToUint128 } from "~/contract-methods/holders-contract/proposals";
import { getRepoApplicationClient } from "~/contract-methods/repository-contract/get-client";
import decodeProjectData from "~/contract-methods/repository-contract/utils/decodeProjectData";

interface WeRepoContextType {
  projectsList: IWeRepoProject[];
  userProject: IWeRepoProject | undefined;
  appendAllRepoProjects: () => Promise<void>;
}

export interface IWeRepoProject {
  project_name_desc: string;
  project_dapp_ids: number[];
}

const WeRepoContext = createContext<WeRepoContextType>({} as WeRepoContextType);

const WeRepoProvider = ({ children }: { children: ReactNode }) => {
  const [projectsList, setProjectsList] = useState<IWeRepoProject[]>([]);
  const [userProject, setUserProject] = useState<IWeRepoProject>();

  const getAllRepoProjects = async () => {
    console.log("Getting all repo projects");
    const appClient = await getRepoApplicationClient();

    // Get all box names for the application
    const boxes = await appClient.appClient.getBoxNames();

    console.log("Boxes:", boxes);
    try {
      const allProjects = await decodeProjectData(boxes, appClient);
      setProjectsList(allProjects);
      console.log("All projects:", allProjects);
    } catch (error) {
      console.error("Error getting box value:", error);
    }
  };

  const appendAllRepoProjects = async () => {
    await getAllRepoProjects();
  };

  return (
    <WeRepoContext.Provider
      value={{
        projectsList,
        userProject,
        appendAllRepoProjects,
      }}
    >
      {children}
    </WeRepoContext.Provider>
  );
};

// Custom hook to use WeRepoContext
const useWeRepo = () => {
  const context = useContext(WeRepoContext);

  if (!context) {
    throw new Error("useWeRepo must be used within a WeRepoProvider");
  }

  return context;
};

export { WeRepoContext, WeRepoProvider, useWeRepo };
