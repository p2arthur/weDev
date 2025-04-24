import { IWeRepoProject } from "~/context/we-repo";
import { WeRepoClient } from "../WeRepoClient";
import { BoxName } from "@algorandfoundation/algokit-utils/types/app";

export default async function decodeProjectData(
  boxes: BoxName[],
  appClient: WeRepoClient
) {
  const projects = [];
  console.log("Boxes:", boxes);
  for (const box of boxes) {
    console.log("Box name:", box.nameRaw);
    try {
      // Get the box value using the raw name
      const boxValue = await appClient.appClient.getBoxValue(box.nameRaw);

      // First 4 bytes are likely metadata/header
      // Next 2 bytes (at index 4-5) might indicate array length
      const arrayLengthBytes = boxValue.slice(4, 6);
      const arrayLength = (arrayLengthBytes[0] << 8) | arrayLengthBytes[1];

      // Each dappId is 8 bytes (uint64)
      const dappIds: number[] = [];
      let currentIndex = 6; // Start after the array length

      // Extract each dappId
      for (let i = 0; i < arrayLength; i++) {
        let dappId = 0;
        // Convert 8 bytes to a number (using only lower 32 bits for JavaScript number)
        for (let j = 0; j < 8; j++) {
          if (currentIndex + j < boxValue.length) {
            dappId = dappId * 256 + boxValue[currentIndex + j];
          }
        }
        dappIds.push(dappId);
        currentIndex += 8;
      }

      // After the array, we should have the string length
      if (currentIndex < boxValue.length) {
        const stringLengthBytes = boxValue.slice(
          currentIndex,
          currentIndex + 2
        );
        const stringLength = (stringLengthBytes[0] << 8) | stringLengthBytes[1];
        currentIndex += 2;

        // Extract the project name and description
        if (currentIndex + stringLength <= boxValue.length) {
          const projectNameDesc = new TextDecoder().decode(
            boxValue.slice(currentIndex, currentIndex + stringLength)
          );

          projects.push({
            project_name_desc: projectNameDesc,
            project_dapp_ids: dappIds,
          });

          console.log("Project name/desc:", projectNameDesc);
          console.log("Dapp IDs:", dappIds);
        }
      }
      console.log("These are the projects:", projects);
    } catch (error) {
      console.error("Error getting box value:", error);
    }
  }
  return projects;
}
