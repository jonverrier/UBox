/*! Copyright TXPCo, 2020, 2021 */
import { URL } from 'url'
import { InvalidParameterError } from './error';

export class NickName {
   private _nickName: string;

   /**
    * Create a NickName object
    * @param nickName - user email
    */
   constructor(nickName: string) {

      if (!NickName.isValidNickName(nickName)) {
         throw new InvalidParameterError();
      }

      this._nickName = nickName;
   }

   /**
   * set of 'getters' for private variables
   */
   get nickName(): string {
      return this._nickName;
   }

   /**
 * test for equality - checks all fields are the same. 
 * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
 * @param rhs - the object to compare this one to.  
 */
   equals(rhs: NickName): boolean {

      return (this._nickName === rhs._nickName);
   }

   /**
    * test for valid nickName 
    * @param nickName - the string to test
    */
   static isValidNickName(nickName: string): boolean {
      if (nickName === null || nickName.length === 0)
         return false;

      return (true);
   }
}

export class Name {
   private _name: string;

   /**
    * Create a Name object
    * @param name - user email
    */
   constructor(name: string) {
      if (!Name.isValidName (name)) {
         throw new InvalidParameterError();
      }

      this._name = name;
   }

   /**
   * set of 'getters' for private variables
   */
   get name(): string {
      return this._name;
   }

   /**
 * test for equality - checks all fields are the same. 
 * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
 * @param rhs - the object to compare this one to.  
 */
   equals(rhs: Name): boolean {

      return (this._name === rhs._name);
   }

   /**
    * test for valid name 
    * @param name - the string to test
    */
   static isValidName(name: string): boolean {
      if (name === null || name.length === 0)
         return false;

      return (true);
   }
}

export class EmailAddress {
   private _email: string;
   private _isEmailVerified: boolean;

   /**
    * Create an EmailAddress object
    * @param email - user email
    * @param isEmailVefified - boolean to say if we know it is their email
    */
   constructor(email: string, isEmailVerified: boolean) {

      if (!EmailAddress.isValidEmailAddress(email)) {
         throw new InvalidParameterError();
      }
      this._email = email;
      this._isEmailVerified = isEmailVerified;
   }

   /**
   * set of 'getters' for private variables
   */
   get email(): string {
      return this._email;
   }
   get isEmailVerified(): boolean {
      return this._isEmailVerified;
   }

   /**
    * test for valid email address 
    * @param email - the string to test 
    */
   static isValidEmailAddress(email: string): boolean {
      if (email === null || email.length === 0)
         return false;

      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
         return (true);
      }
      return (false);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: EmailAddress): boolean {

      return (
         (this._email === rhs._email) &&
         (this._isEmailVerified === rhs._isEmailVerified));
   }
}

export class Url {
   private _url: string;
   private _isUrlVerified: boolean;

   /**
    * Create a Url object
    * @param url - user email
    * @param isUrlVerified - boolean to say if we know URL is valid i.e we have retrieved it
    */
   constructor(url: string, isUrlVerified: boolean) {

      if (!Url.isValidUrl(url)) {
         throw new InvalidParameterError();
      }
      this._url = url;
      this._isUrlVerified = isUrlVerified;
   }

   /**
   * set of 'getters' for private variables
   */
   get url(): string {
      return this._url;
   }
   get isUrlVerified(): boolean {
      return this._isUrlVerified;
   }

   /**
    * test for valid url
    * @param url - the string to test 
    */
   static isValidUrl(url: string): boolean {
      if (url === null || url.length === 0)
         return false;

      let parsed;

      try {
         parsed = new URL(url);
      } catch (_) {
         return false;
      }
      return (true);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Url): boolean {

      return (
         (this._url === rhs._url) &&
         (this._isUrlVerified === rhs._isUrlVerified));
   }
}

export class Person  {
   private _id: any; 
   private _externalId: string;
   private _nickName: NickName;
   private _name: Name;
   private _email: EmailAddress;
   private _thumbnailUrl: Url;
   private _authCode: string;

/**
 * Create a Person object
 * @param _id - ID assigned by database
 * @param externalId - ID assigned by external system (like facebook)
 * @param alias - Alias entered by users of the system e.g 'Jon V' if full name / email is not known
 * @param name - plain text user name
 * @param email - user email
 * @param thumbnailUrl - URL to thumbnail image
 * @param authCode - provided by underlying identity system when user logs in
 */
   constructor(_id: any, externalId: string, nickName: NickName, name: Name, email: EmailAddress, thumbnailUrl: Url, lastAuthCode:string) {
      this._id = _id;
      this._externalId = externalId;
      this._nickName = nickName;
      this._name = name;
      this._email = email;
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
   get nickName(): NickName {
      return this._nickName;
   }
   get name(): Name {
      return this._name;
   }
   get email(): EmailAddress {
      return this._email;
   }
   get thumbnailUrl(): Url {
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
         (this._nickName.equals(rhs._nickName)) &&
         (this._name.equals (rhs._name)) &&
         (this._email.equals(rhs._email)) &&
         (this._thumbnailUrl.equals (rhs._thumbnailUrl)) &&
         (this._authCode === rhs._authCode));
   };
};


export interface IPersonLoader {
   load(): Person;
}

export interface IPersonStorer {
   save(person: Person);
}