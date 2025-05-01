import algosdk, { TransactionSigner } from "algosdk";
import { I } from "node_modules/framer-motion/dist/types.d-B50aGbjN";
import { createContext, useState, ReactNode, useContext } from "react";
import { getRepoApplicationClient } from "~/contract-methods/repository-contract/get-client";
import decodeProjectData from "~/contract-methods/repository-contract/utils/decodeProjectData";

export interface IWeRepoLocalStorage {
  project_username: string | undefined;
  background_color: number | string | undefined;
  primary_color: number | string | undefined;
  secondary_color: number | string | undefined;
  accent_color: number | string | undefined;
}

interface WeRepoContextType {
  projectsList: IWeRepoProject[];
  userProject: IWeRepoProject | undefined;
  loadingProjects: boolean;
  appendAllRepoProjects: () => Promise<void>;
  appendUserProjectData: (walletAddress: string) => Promise<void>;
  createNewProject: (
    signer: TransactionSigner,
    senderAddress: string,
    projectData: IWeRepoProject
  ) => Promise<void>;
  getUserLocalStorage: (walletAddress: string) => Promise<IWeRepoLocalStorage>;
}

export interface IWeRepoProject {
  project_name: string;
  project_dapp_ids: number[];
  creator_address: string;
  project_username: string;
  background_color: number;
  primary_color: number;
  secondary_color: number;
  accent_color: number;
  project_reputation: number;
  project_contribution: number;
}

const WeRepoContext = createContext<WeRepoContextType>({} as WeRepoContextType);

const WeRepoProvider = ({ children }: { children: ReactNode }) => {
  const [projectsList, setProjectsList] = useState<IWeRepoProject[]>([]);
  const [userProject, setUserProject] = useState<IWeRepoProject>();
  const [loadingProjects, setLoadingProjects] = useState(false);

  const getAllRepoProjects = async () => {
    setLoadingProjects(true);
    setProjectsList([]);
    console.log("Getting all repo projects");
    const appClient = await getRepoApplicationClient();

    // Get all box names for the application
    const boxes = await appClient.appClient.getBoxNames();

    console.log("Boxes:", boxes);
    try {
      const allProjects: IWeRepoProject[] = [];

      for (const box of boxes) {
        const nameRaw = box.nameRaw;
        const prefix = nameRaw.slice(0, 2); // Extract the "_p" prefix
        const addressBytes = nameRaw.slice(2); // Extract the address portion

        // If the address portion is a valid Algorand address (32 bytes)
        // Create an Address object from the raw bytes
        const address = new algosdk.Address(addressBytes);
        // Convert to the standard Algorand address string format
        const addressString = address.toString();
        console.log("Prefix:", new TextDecoder().decode(prefix));
        console.log("Address:", addressString);

        // Get the box value using the raw name
        const boxValue = await appClient.appClient.getBoxValue(box.nameRaw);

        const projectUserLocalState = await getUserLocalStorage(addressString);

        const project = await decodeProjectData(boxValue, appClient);
        project.creator_address = addressString; // Set the creator address
        project.background_color = Number(
          projectUserLocalState.background_color!
        );
        project.primary_color = Number(projectUserLocalState.primary_color!);
        project.secondary_color = Number(
          projectUserLocalState.secondary_color!
        );
        project.accent_color = Number(projectUserLocalState.accent_color!);
        project.project_username = projectUserLocalState.project_username!;
        project.project_name = project.project_name || "Unnamed Project";

        allProjects.push(project);
      }

      setProjectsList(allProjects);
      setLoadingProjects(false);
      console.log("All projects:", allProjects);
    } catch (error) {
      console.error("Error getting box value:", error);
      setLoadingProjects(false);
    }
  };

  const getUserLocalStorage = async (
    walletAddress: string
  ): Promise<IWeRepoLocalStorage> => {
    const appClient = await getRepoApplicationClient();

    return {
      project_username: await appClient.state
        .local(walletAddress)
        .projectUsername(),
      background_color: Number(
        await appClient.state.local(walletAddress).projectBackgroundColor()
      ),
      primary_color: Number(
        await appClient.state.local(walletAddress).projectPrimaryColor()
      ),
      secondary_color: Number(
        await appClient.state.local(walletAddress).projectSecondaryColor()
      ),
      accent_color: Number(
        await appClient.state.local(walletAddress).projectAccentColor()
      ),
    };
  };

  const getUserRepoMicroDapps = async (walletAddress: string) => {
    const prefixBytes = new TextEncoder().encode("_p");
    const addressBytes = algosdk.decodeAddress(walletAddress).publicKey;
    const boxNameRaw = new Uint8Array([...prefixBytes, ...addressBytes]);

    const appClient = await getRepoApplicationClient();
    const boxValue = await appClient.appClient.getBoxValue(boxNameRaw);

    const project = await decodeProjectData(boxValue, appClient);

    project.creator_address = walletAddress;
    project.project_name = project.project_name || "Unnamed Project";

    return project;
  };

  const appendUserProjectData = async (walletAddress: string) => {
    try {
      const localData = await getUserLocalStorage(walletAddress);
      const repoData = await getUserRepoMicroDapps(walletAddress);

      if (!localData || !repoData) return;

      setUserProject({
        ...repoData,
        background_color: Number(localData.background_color) || 0,
        primary_color: Number(localData.primary_color) || 0,
        secondary_color: Number(localData.secondary_color) || 0,
        accent_color: Number(localData.accent_color) || 0,
        project_username: localData.project_username || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const createNewProject = async (
    signer: TransactionSigner,
    senderAddress: string,
    projectData: IWeRepoProject
  ) => {
    const appClient = await getRepoApplicationClient();
    // try {
    //   const optedIn = await appClient.state
    //     .local(senderAddress)
    //     ?.projectUsername();
    // } catch (error) {
    //   await appClient.send.optIn.optInToApplication({
    //     args: [],
    //     sender: senderAddress,
    //     signer: signer,
    //   });
    // }

    await appClient.send.createNewProject({
      args: [
        projectData.project_name,
        projectData.project_username || "",
        projectData.primary_color,
        projectData.background_color,
        projectData.secondary_color,
        projectData.accent_color,
      ],
      sender: senderAddress,
      signer: signer,
    });
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
        appendUserProjectData,
        loadingProjects,
        createNewProject,
        getUserLocalStorage,
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
