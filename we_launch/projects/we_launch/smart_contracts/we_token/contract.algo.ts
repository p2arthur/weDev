import { Contract } from '@algorandfoundation/algorand-typescript'

export class WeToken extends Contract {
  public hello(name: string): string {
    return `Hello, ${name}`
  }
}
