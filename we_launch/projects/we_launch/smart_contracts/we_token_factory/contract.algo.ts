import { arc4, compile, Contract, itxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { WeToken } from '../we_token/contract.algo'

export class WeTokenFactory extends Contract {
  // Holds all the deployed campaign ids
  all_campaigns = new arc4.DynamicArray<arc4.UintN64>()

  //Should enable the deployment

  /*
   * @param tokenName - The name of the token
   * @param tokenSymbol - The symbol of the token
   * @param tokenDecimals - The number of decimals for the token
   * @param tokenTotalSupply - The total supply of the token
   */
  public createTokenCampaign(tokenName: string, tokenSymbol: string, tokenDecimals: uint64, tokenTotalSupply: uint64) {
    const compiled = compile(WeToken)

    const tokenCampaignContractId = itxn
      .applicationCall({
        approvalProgram: compiled.approvalProgram,
        clearStateProgram: compiled.clearStateProgram,
        fee: 0,
        globalNumUint: 2, // <-- Allow 1 uint in global state,
        globalNumBytes: 2, // <-- Allow 0 byte slices in global state
      })
      .submit().createdApp.id

    this.all_campaigns.push(new arc4.UintN64(tokenCampaignContractId))
  }
}
