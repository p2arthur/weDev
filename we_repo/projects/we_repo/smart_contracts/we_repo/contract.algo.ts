import {
  abimethod,
  Account,
  arc4,
  assert,
  baremethod,
  BoxMap,
  Contract,
  GlobalState,
  LocalState,
  Txn,
  Uint64,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { ProjectData, ProjectId } from './config.algo'

// Define the structure for our project data

export class WeRepo extends Contract {
  // Keeps track of the manager address
  manager_address = GlobalState<Account>()

  // Keeps track of the total number of projects
  total_projects = GlobalState<uint64>()

  // Save a project box map
  project = BoxMap<ProjectId, ProjectData>({ keyPrefix: '_p' })

  project_username = LocalState<string>()
  project_background_color = LocalState<uint64>()
  project_primary_color = LocalState<uint64>()
  project_secondary_color = LocalState<uint64>()
  project_accent_color = LocalState<uint64>()

  @abimethod({ onCreate: 'require', allowActions: 'NoOp' })
  public createApplication(): void {
    // Sets the manager address to be equal to the sender of the transaction
    this.manager_address.value = Txn.sender

    // Sets the total number of projects to 0
    this.total_projects.value = 0
  }

  @baremethod()
  deleteApplication() {}

  optInToApplication() {}

  // Method to create a new project into the repo
  @abimethod({ allowActions: 'NoOp' })
  public createNewProject(
    project_name: string,
    project_username: string,
    background_color: uint64,
    primary_color: uint64,
    secondary_color: uint64,
    accent_color: uint64,
  ): void {
    // First check if the box exists, if not create it
    if (!this.project(Txn.sender).exists) {
      // Create the box with appropriate size
      this.project(Txn.sender).create({ size: 500 })

      // Initialize with empty array for dappIds
      this.project(Txn.sender).value = new ProjectData({
        dappIds: new arc4.DynamicArray<arc4.UintN64>(),
        project_reputation: new arc4.UintN64(1),
        project_contribution: new arc4.UintN64(1),
        project_name: new arc4.Str(project_name),
      })

      this.project_username(Txn.sender).value = project_username
      this.project_background_color(Txn.sender).value = background_color
      this.project_primary_color(Txn.sender).value = primary_color
      this.project_secondary_color(Txn.sender).value = secondary_color
      this.project_accent_color(Txn.sender).value = accent_color

      // Increment the total number of projects
      this.total_projects.value = Uint64(this.total_projects.value + 1)
    } else {
      // Just update the name if project already exists
      this.project(Txn.sender).value.project_name = new arc4.Str(project_name)
    }
  }

  @abimethod({ allowActions: 'NoOp' })
  public updateProjectName(new_project_name: string): void {
    // Assert that the box exists before updating
    assert(this.project(Txn.sender).exists, 'Project created by the given address does not exist')

    this.project(Txn.sender).value.project_name = new arc4.Str(new_project_name)
  }

  @abimethod({ allowActions: 'NoOp' })
  public updateProjectColors(
    background_color: uint64,
    primary_color: uint64,
    secondary_color: uint64,
    accent_color: uint64,
  ): void {
    // Assert that the user opted in to the contract
    assert(this.project_username(Txn.sender).hasValue, 'User has not opted in to the contract')
    this.project_background_color(Txn.sender).value = background_color
    this.project_primary_color(Txn.sender).value = primary_color
    this.project_secondary_color(Txn.sender).value = secondary_color
    this.project_accent_color(Txn.sender).value = accent_color
  }

  @abimethod({ allowActions: 'NoOp' })
  public createProjectMicroDapp(dappId: uint64, type: uint64, creatorAddress: Account): void {
    // Check if the box exists first
    if (!this.project(Txn.sender).exists) {
      // Create and initialize the box if it doesn't exist
      this.project(Txn.sender).create({ size: 500 })
      this.project(Txn.sender).value = new ProjectData({
        project_name: new arc4.Str(''),
        dappIds: new arc4.DynamicArray<arc4.UintN64>(),
        project_reputation: new arc4.UintN64(this.project(Txn.sender).value.project_reputation.native + 5),
        project_contribution: new arc4.UintN64(this.project(Txn.sender).value.project_contribution.native + 5),
      })

      // Increment the total number of projects
      this.total_projects.value = Uint64(this.total_projects.value + 1)
    }

    // Get the current dappIds array
    const dappIds = this.project(creatorAddress).value.dappIds.copy()

    // Expand the array if needed to accommodate the type index
    while (dappIds.length < type) {
      dappIds.push(new arc4.UintN64(0))
    }

    // Update the specific dapp ID at the index (type-1)
    dappIds[type - 1] = new arc4.UintN64(dappId)

    // Save the updated array back to the box
    this.project(Txn.sender).value.dappIds = dappIds.copy()
  }

  @abimethod({ allowActions: 'NoOp', readonly: true })
  public getProjectName(): string {
    assert(this.project(Txn.sender).exists, 'Project does not exist')
    return this.project(Txn.sender).value.project_name.native
  }

  @abimethod({ allowActions: 'NoOp', readonly: true })
  public getDappIdByType(type: uint64): uint64 {
    assert(this.project(Txn.sender).exists, 'Project does not exist')
    const dappIds = this.project(Txn.sender).value.dappIds.copy()

    // If the type index is out of bounds, return 0 instead of failing
    if (type <= 0 || type > dappIds.length) {
      return 0
    }

    return dappIds[type - 1].native
  }

  @abimethod({ allowActions: 'NoOp', readonly: true })
  public getAllDappIds(): arc4.DynamicArray<arc4.UintN64> {
    assert(this.project(Txn.sender).exists, 'Project does not exist')
    return this.project(Txn.sender).value.dappIds
  }

  // For backward compatibility with your test
  @abimethod({ allowActions: 'NoOp', readonly: true })
  public getProjectHoldersDao(): arc4.UintN64 {
    assert(this.project(Txn.sender).exists, 'Project does not exist')
    const dappIds = this.project(Txn.sender).value.dappIds.copy()
    return dappIds.length >= 1 ? dappIds[0] : new arc4.UintN64(0)
  }

  @abimethod({ allowActions: 'NoOp', readonly: true })
  public getProjectRewardsDao(): arc4.UintN64 {
    assert(this.project(Txn.sender).exists, 'Project does not exist')
    const dappIds = this.project(Txn.sender).value.dappIds.copy()
    return dappIds.length >= 2 ? dappIds[1] : new arc4.UintN64(0)
  }
}
