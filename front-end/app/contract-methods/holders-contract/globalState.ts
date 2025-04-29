import { getApplicationClient } from "./get-client";

export async function getGlobalState(dappId: number) {
  const appClient = await getApplicationClient(dappId);
  const globalState = await appClient.state.global.getAll();
  console.log("Global State:", globalState);
  return globalState;
}
