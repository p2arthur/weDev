import * as algokit from "@algorandfoundation/algokit-utils";
import { YesNoDaoClient } from "./YesNoDaoClient";

export async function getApplicationClient(dappId: number) {
  const appId = BigInt(dappId);
  const algorand = algokit.AlgorandClient.testNet();
  const appClient = algorand.client.getTypedAppClientById(YesNoDaoClient, {
    appId: appId,
  });

  return appClient;
}
