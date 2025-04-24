import { Contract } from '@algorandfoundation/algorand-typescript'

export class WeRepo extends Contract {
  public hello(name: string): string {
    return `Hello, ${name}`
  }
}
