import { Account, arc4 } from '@algorandfoundation/algorand-typescript'

// Define your ProjectIDtype as the creator wallet address for keeping track of projects 1 per wallet
export type ProjectId = Account

// Define the Data of a project to be added to the repository
export class ProjectData extends arc4.Struct<{
  project_name_des: arc4.Str
  dappIds: arc4.DynamicArray<arc4.UintN64>
}> {}
