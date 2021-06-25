/*! Copyright TXPCo, 2020, 2021 */


export class Person  {
   private _id: any; 
   private _externalId: string;
   private _alias: string;
   private _name: string;
   private _email: string;
   private _isEmailVerified: boolean;
   private _thumbnailUrl: string;
   private _authCode: string;

   static readonly __type: string = "Person";

/**
 * Create a Person object
 * @param _id - ID assigned by database
 * @param externalId - ID assigned by external system (like facebook)
 * @param alias - Alias entered by users of the system e.g 'Jon V' if full name / email is not known
 * @param name - plain text user name
 * @param email - user email
 * @param isEmailIsVefified - boolean to say if we know it is their email
 * @param thumbnailUrl - URL to thumbnail image
 * @param authCode - provided by underlying identity system when user logs in
 */
   constructor(_id: any, externalId: string, alias: string, name: string, email: string, isEmailVerified: boolean, thumbnailUrl: string, lastAuthCode:string) {
      this._id = _id;
      this._externalId = externalId;
      this._alias = alias;
      this._name = name;
      this._email = email;
      this._isEmailVerified = isEmailVerified;
      this._thumbnailUrl = thumbnailUrl;
      this._authCode = lastAuthCode;
   }

   /**
   * set of 'getters' for private variables
   */
   get id(): any {
      return this._id;
   }
   get externalId(): string {
      return this._externalId;
   }
   get alias(): string {
      return this._alias;
   }
   get name(): string {
      return this._name;
   }
   get email(): string {
      return this._email;
   }
   get isEmailVerified(): boolean {
      return this._isEmailVerified;
   }
   get thumbnailUrl(): string {
      return this._thumbnailUrl;
   }
   get authCode(): string {
      return this._authCode;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
    equals (rhs: Person) : boolean {

      return ((this._id === rhs._id) &&
         (this._externalId === rhs._externalId) &&
         (this._alias === rhs._alias) &&
         (this._name === rhs._name) &&
         (this._email === rhs._email) &&
         (this._isEmailVerified === rhs._isEmailVerified) &&
         (this._thumbnailUrl === rhs._thumbnailUrl) &&
         (this._authCode === rhs._authCode));
   };
};


export interface IPersonLoader {
   load(): Person;
}

export interface IPersonStorer {
   save(person: Person);
}