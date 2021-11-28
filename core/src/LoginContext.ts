/*! Copyright TXPCo, 2020, 2021 */
import { InvalidParameterError } from './CoreError';

export enum ELoginProvider {
   Apple = "Apple", Google = "Google", Private = "Private"
}

export class LoginContextMemento {
   readonly _provider: ELoginProvider;
   readonly _token: string;

   /**
    * Create a LoginDetailsMemento object
    * @param name - user first name
    * @param surname - user family name, can be null
    */
   constructor(provider: ELoginProvider, token: string) {

      this._provider = provider;
      this._token = token;
   }
}

export class LoginContext {
   private _provider: ELoginProvider;
   private _token: string;

   /**
    * Create a LoginDetails object
    * @param provider - which login provider was used 
    * @param token - token provided by the external provider 
    */
   constructor(provider: ELoginProvider, token: string) {

      if (!LoginContext.isValidLoginDetails(token)) {
         throw new InvalidParameterError("LoginDetails");
      }

      this._provider = provider;
      this._token = token;
   }

   /**
   * set of 'getters' for private variables
   */
   get provider(): ELoginProvider {
      return this._provider;
   }
   get token(): string {
      return this._token;
   }

   /**
   * memento() returns a copy of internal state
   */
   memento(): LoginContextMemento {
      return new LoginContextMemento(this._provider, this._token);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: LoginContext): boolean {

      return (
         (this._provider === rhs._provider) &&
         (this._token === rhs._token));
   }

   /**
    * test for valid login token 
    * @param token - the string to test
    */
   static isValidLoginDetails(token: string): boolean {
      if (token === null || token.length === 0)
         return false;

      return (true);
   }
}
