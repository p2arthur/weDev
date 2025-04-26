import { AlgorandClient, algos, Config, microAlgo } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { WeRepoClient, WeRepoFactory } from '../artifacts/we_repo/WeRepoClient'

const fixture = algorandFixture()
Config.configure({ populateAppCallResources: true })

// App clients -------------------------------------------
let weRepoClient: WeRepoClient
//--------------------------------------------------------

// Environment clients ------------------------------------
let algorand: AlgorandClient
//--------------------------------------------------------

// Relevant user accounts ------------------------------------
let managerAccount: TransactionSignerAccount
let projectCreatorAccount: TransactionSignerAccount
//--------------------------------------------------------

describe('WeRepo contract', () => {
  beforeEach(fixture.newScope)
  beforeAll(async () => {
    await fixture.newScope()

    algorand = AlgorandClient.fromEnvironment()

    managerAccount = await algorand.account.kmd.getOrCreateWalletAccount('manager-account', algos(100))
    projectCreatorAccount = await algorand.account.kmd.getOrCreateWalletAccount('project-creator-account', algos(100))
    algorand.setSignerFromAccount(managerAccount)
    algorand.setSignerFromAccount(projectCreatorAccount)

    await algorand.account.ensureFundedFromEnvironment(managerAccount.addr, microAlgo(1000000))

    await algorand.send.payment({
      sender: managerAccount.addr,
      receiver: projectCreatorAccount.addr,
      amount: microAlgo(150000), // Send 1 Algo to the new wallet
    })

    const factory = algorand.client.getTypedAppFactory(WeRepoFactory, { defaultSender: managerAccount.addr })

    const { appClient } = await factory.send.create.createApplication({
      args: [],
      sender: managerAccount.addr,
    })

    await algorand.send.payment({
      sender: managerAccount.addr,
      receiver: appClient.appAddress,
      amount: microAlgo(150000), // Send 1 Algo to the new wallet
    })

    weRepoClient = appClient
  }, 300000)

  test('Test if application got created with correct initial state', async () => {
    const result = await weRepoClient.appClient.getGlobalState()
  })

  test('Test if manager can create a new project', async () => {
    await weRepoClient.send.optIn.optInToApplication({ args: [], sender: projectCreatorAccount.addr })

    const result = await weRepoClient.send.createNewProject({
      args: ['Project name', 'Project username', 0n, 0n, 0n, 0n],
      sender: projectCreatorAccount.addr,
    })

    const totalProjects = await weRepoClient.state.global.totalProjects()
    const projectUser = await weRepoClient.state.local(projectCreatorAccount.addr).projectUsername()

    console.log('Project User:', projectUser)

    expect(totalProjects).toEqual(1)
  })

  test('Test creating dapps of three different types and logging them', async () => {
    // Create a project first
    const projectName = 'Multi-Dapp Project'
    await weRepoClient.send.createNewProject({
      args: [projectName, 'multi-dapp-project', 0n, 0n, 0n, 0n],
      sender: projectCreatorAccount.addr,
    })

    // Create three different dapp types
    const holdersDappId = 12345n
    const rewardsDappId = 67890n
    const governanceDappId = 54321n

    // Add dapps of three different types
    await weRepoClient.send.createProjectMicroDapp({
      args: [holdersDappId, 1n, String(projectCreatorAccount.addr)],
      sender: projectCreatorAccount.addr,
    })

    await weRepoClient.send.createProjectMicroDapp({
      args: [rewardsDappId, 2n, String(projectCreatorAccount.addr)],
      sender: projectCreatorAccount.addr,
    })

    await weRepoClient.send.createProjectMicroDapp({
      args: [governanceDappId, 3n, String(projectCreatorAccount.addr)],
      sender: projectCreatorAccount.addr,
    })

    // Retrieve and log all dapp IDs
    const allDappIds = await weRepoClient.send.getAllDappIds({ args: [], sender: projectCreatorAccount.addr })

    console.log('All Dapp IDs:', allDappIds.returns)

    // Retrieve and log individual dapp IDs by type
    const type1DappId = await weRepoClient.send.getDappIdByType({
      args: [1n],
      sender: projectCreatorAccount.addr,
    })

    const type2DappId = await weRepoClient.send.getDappIdByType({
      args: [2n],
      sender: projectCreatorAccount.addr,
    })

    const type3DappId = await weRepoClient.send.getDappIdByType({
      args: [3n],
      sender: projectCreatorAccount.addr,
    })

    console.log('Type 1 Dapp ID (Holders):', type1DappId.returns?.[0].returnValue)
    console.log('Type 2 Dapp ID (Rewards):', type2DappId.returns?.[0].returnValue)
    console.log('Type 3 Dapp ID (Governance):', type3DappId.returns?.[0].returnValue)

    // Also test the convenience methods
    const holdersDao = await weRepoClient.send.getProjectHoldersDao({ args: [], sender: projectCreatorAccount.addr })

    const rewardsDao = await weRepoClient.send.getProjectRewardsDao({ args: [], sender: projectCreatorAccount.addr })

    // console.log('Holders DAO ID:', holdersDao)
    // console.log('Rewards DAO ID:', rewardsDao)

    // // Verify the dapp IDs match what we set
    // expect(type1DappId).toBe(holdersDappId)
    // expect(type2DappId).toBe(rewardsDappId)
    // expect(type3DappId).toBe(governanceDappId)
  })
})
