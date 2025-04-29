import * as algokit from "@algorandfoundation/algokit-utils";
import { YesNoDaoFactory } from "./YesNoDaoClient";
import { TransactionSigner } from "algosdk";
import { Config, microAlgo } from "@algorandfoundation/algokit-utils";
import { getRepoApplicationClient } from "../repository-contract/get-client";

export default async function deployHoldersContract(
  anyoneCanCreate: boolean,
  minHolding: number,
  assetId: number,
  senderAddress: string,
  signer: TransactionSigner
) {
  Config.configure({ populateAppCallResources: true, debug: true });

  console.log("Deploying holders contract...");
  const algorand = algokit.AlgorandClient.testNet();
  console.log("Deploying holders contract...", algorand);
  //Register the signer with the account manager
  algorand.account.setSigner(senderAddress, signer);
  console.log("Signer registered:", senderAddress);
  const factory = algorand.client.getTypedAppFactory(YesNoDaoFactory, {
    defaultSender: senderAddress,
  });

  const { appClient } = await factory.send.create.createApplication({
    args: {
      anyoneCanCreate: true,
      minimumHolding: BigInt(1),
      assetId: BigInt(1),
      projectTitle: "String",
      projectDescription: "string;,",
    },
    extraFee: microAlgo(10000),
  });

  const appId = appClient.appId;
  const appAddress = appClient.appAddress;

  await algorand.send.payment({
    receiver: appAddress,
    amount: algokit.microAlgo(100000),
    sender: senderAddress,
  });

  console.log(`Deployed app with id: ${appId}`);

  const repoAppClient = await getRepoApplicationClient();

  await repoAppClient.send.createProjectMicroDapp({
    args: [appId, 1, senderAddress],
    sender: senderAddress,
    signer: signer,
  });

  return { appClient, appId };
}
