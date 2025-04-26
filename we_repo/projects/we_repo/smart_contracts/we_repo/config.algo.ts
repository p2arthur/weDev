import { Account, arc4 } from '@algorandfoundation/algorand-typescript'

// Define your ProjectIDtype as the creator wallet address for keeping track of projects 1 per wallet
export type ProjectId = Account

// Define the Data of a project to be added to the repository
export class ProjectData extends arc4.Struct<{
  project_reputation: arc4.UintN64
  project_contribution: arc4.UintN64
  dappIds: arc4.DynamicArray<arc4.UintN64>
  project_name: arc4.Str
}> {}
