import {
  abimethod,
  Account,
  arc4,
  assert,
  BoxMap,
  Contract,
  GlobalState,
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

  @abimethod({ onCreate: 'require', allowActions: 'NoOp' })
  public createApplication(): void {
    // Sets the manager address to be equal to the sender of the transaction
    this.manager_address.value = Txn.sender

    // Sets the total number of projects to 0
    this.total_projects.value = 0
  }

  // Method to create a new project into the repo
  @abimethod({ allowActions: 'NoOp' })
  public createNewProject(project_name: string): void {
    // First check if the box exists, if not create it
    if (!this.project(Txn.sender).exists) {
      // Create the box with appropriate size
      this.project(Txn.sender).create({ size: 500 })

      // Initialize with empty array for dappIds
      this.project(Txn.sender).value = new ProjectData({
        dappIds: new arc4.DynamicArray<arc4.UintN64>(),
        project_name_des: new arc4.Str(project_name),
      })

      // Increment the total number of projects
      this.total_projects.value = Uint64(this.total_projects.value + 1)
    } else {
      // Just update the name if project already exists
      this.project(Txn.sender).value.project_name_des = new arc4.Str(project_name)
    }
  }

  @abimethod({ allowActions: 'NoOp' })
  public updateProjectName(new_project_name: string): void {
    // Assert that the box exists before updating
    assert(this.project(Txn.sender).exists, 'Project created by the given address does not exist')

    this.project(Txn.sender).value.project_name_des = new arc4.Str(new_project_name)
  }

  @abimethod({ allowActions: 'NoOp' })
  public createProjectMicroDapp(dappId: uint64, type: uint64): void {
    // Check if the box exists first
    if (!this.project(Txn.sender).exists) {
      // Create and initialize the box if it doesn't exist
      this.project(Txn.sender).create({ size: 500 })
      this.project(Txn.sender).value = new ProjectData({
        project_name_des: new arc4.Str(''),
        dappIds: new arc4.DynamicArray<arc4.UintN64>(),
      })

      // Increment the total number of projects
      this.total_projects.value = Uint64(this.total_projects.value + 1)
    }

    // Get the current dappIds array
    const dappIds = this.project(Txn.sender).value.dappIds.copy()

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
    return this.project(Txn.sender).value.project_name_des.native
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
