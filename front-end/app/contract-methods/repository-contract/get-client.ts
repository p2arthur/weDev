import * as algokit from "@algorandfoundation/algokit-utils";
import { WeRepoClient } from "./WeRepoClient";

export async function getRepoApplicationClient() {
  const appId = BigInt(Number(import.meta.env.VITE_REPO_CONTRACT_APP_ID));
  const algorand = algokit.AlgorandClient.testNet();
  const appClient = algorand.client.getTypedAppClientById(WeRepoClient, {
    appId: appId,
  });

  return appClient;
}
