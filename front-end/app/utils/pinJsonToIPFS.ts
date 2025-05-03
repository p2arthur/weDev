import axios from "axios";
import { IWeRepoProject } from "~/context/we-repo";

export const pinJsonToIPFS = async (projectData: IWeRepoProject) => {
  const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
  const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY;

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      projectData,
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      }
    );

    const cid = res.data.IpfsHash; // You’ll get the IPFS CID here
    return `${cid}`;
  } catch (error) {
    console.error("Pinata upload failed:", error);
    throw error;
  }
};
