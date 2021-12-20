/*! Copyright TXPCo, 2020, 2021 */
import { InvalidParameterError } from './CoreError';

export enum ELoginProvider {
   Apple = "Apple", Google = "Google", Private = "Private"
}

export class LoginContextMemento {
   readonly _provider: ELoginProvider;
   readonly _externalId: string;

   /**
    * Create a LoginDetailsMemento object
    * @param name - user first name
    * @param surname - user family name, can be null
    */
   constructor(provider: ELoginProvider, token: string)
   public constructor(memento: LoginContextMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {
         var memento: LoginContextMemento = params[0];

         this._provider = memento._provider;
         this._externalId = memento._externalId;
      }
      else {

         this._provider = params[0];
         this._externalId = params[1];
      }
   }
}

export class LoginContext {
   private _provider: ELoginProvider;
   private _externalId: string;

   /**
    * Create a LoginContext object
    * @param provider - which login provider was used 
    * @param externalId - token provided by the external provider 
    */
   constructor(provider: ELoginProvider, externalId: string);
   public constructor(memento: LoginContextMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {
         var memento: LoginContextMemento = params[0];

         this._provider = memento._provider;
         this._externalId = memento._externalId;
      }
      else {

         this._provider = params[0];
         this._externalId = params[1];
      }
   } 

   /**
   * set of 'getters' for private variables
   */
   get provider(): ELoginProvider {
      return this._provider;
   }
   get externalId(): string {
      return this._externalId;
   }

   /**
   * memento() returns a copy of internal state
   */
   memento(): LoginContextMemento {
      return new LoginContextMemento(this._provider, this._externalId);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: LoginContext): boolean {

      return (
         (this._provider === rhs._provider) &&
         (this._externalId === rhs._externalId));
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
