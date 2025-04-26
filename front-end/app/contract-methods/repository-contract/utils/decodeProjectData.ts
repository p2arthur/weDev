import { IWeRepoProject } from "~/context/we-repo";
import { WeRepoClient } from "../WeRepoClient";
import { BoxName } from "@algorandfoundation/algokit-utils/types/app";
import algosdk from "algosdk";

export default async function decodeProjectData(
  boxValue: Uint8Array<ArrayBufferLike>,
  appClient: WeRepoClient
) {
  let project: IWeRepoProject = {
    project_name: "",
    project_dapp_ids: [],
    creator_address: "",
    project_username: "",
    primary_color: 0,
    secondary_color: 0,
    accent_color: 0,
    background_color: 0,
    project_reputation: 0,
    project_contribution: 0,
  };

  try {
    // First 4 bytes are likely metadata/header
    let currentIndex = 4;

    // Extract project_reputation (uint64) - 8 bytes
    let projectReputation = 0;
    if (currentIndex + 8 <= boxValue.length) {
      const dataView = new DataView(
        boxValue.buffer,
        boxValue.byteOffset + currentIndex,
        8
      );
      projectReputation = Number(dataView.getBigUint64(0, false)); // false for big-endian
    }
    currentIndex += 8;

    // Extract project_contribution (uint64) - 8 bytes
    let projectContribution = 0;
    if (currentIndex + 8 <= boxValue.length) {
      const dataView = new DataView(
        boxValue.buffer,
        boxValue.byteOffset + currentIndex,
        8
      );
      projectContribution = Number(dataView.getBigUint64(0, false)); // false for big-endian
    }
    currentIndex += 8;

    // Next 2 bytes indicate array length
    const arrayLengthBytes = boxValue.slice(currentIndex, currentIndex + 2);
    const arrayLength = (arrayLengthBytes[0] << 8) | arrayLengthBytes[1];
    currentIndex += 2;

    // Each dappId is 8 bytes (uint64)
    const dappIds: number[] = [];

    // Extract each dappId
    for (let i = 0; i < arrayLength; i++) {
      if (currentIndex + 8 <= boxValue.length) {
        const dataView = new DataView(
          boxValue.buffer,
          boxValue.byteOffset + currentIndex,
          8
        );
        const dappId = Number(dataView.getBigUint64(0, false)); // false for big-endian
        dappIds.push(dappId);
      }
      currentIndex += 8;
    }

    // After the array, we should have the string length
    if (currentIndex < boxValue.length) {
      const stringLengthBytes = boxValue.slice(currentIndex, currentIndex + 2);
      const stringLength = (stringLengthBytes[0] << 8) | stringLengthBytes[1];
      currentIndex += 2;

      // Extract the project name and description
      if (currentIndex + stringLength <= boxValue.length) {
        const projectNameDesc = new TextDecoder().decode(
          boxValue.slice(currentIndex, currentIndex + stringLength)
        );

        project = {
          project_name: projectNameDesc,
          project_dapp_ids: dappIds,
          project_username: "",
          creator_address: "",
          background_color: 0,
          primary_color: 0,
          secondary_color: 0,
          accent_color: 0,
          project_reputation: projectReputation,
          project_contribution: projectContribution,
        };

        console.log("Project name/desc:", projectNameDesc);
        console.log("Dapp IDs:", dappIds);
        console.log("Project reputation:", projectReputation);
        console.log("Project contribution:", projectContribution);
      }
    }
  } catch (error) {
    console.error("Error getting box value:", error);
  }

  return project;
}
