/*! Copyright TXPCo, 2020, 2021 */
import { URL } from 'url'
import { InvalidParameterError } from './error';
import { PersistenceDetails, Persistence } from "./Persistence";

export enum ERoleType {
   Prospect = "Prospect", Member = "Member", Coach = "Coach"
}

export class Name {
   private _name: string;
   private _surname: string;

   /**
    * Create a Name object
    * @param name - user first name
    * @param surname - user family name, can be null
    */
   constructor(name: string, surname: string | null = null ) {
      if (!Name.isValidName (name)) {
         throw new InvalidParameterError("Name");
      }

      this._name = name;
      this._surname = surname;
   }

   /**
   * set of 'getters' for private variables
   */
   get name(): string {
      return this._name;
   }
   get surname(): string {
      return this._surname;
   }

   /**
 * test for equality - checks all fields are the same. 
 * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
 * @param rhs - the object to compare this one to.  
 */
   equals(rhs: Name): boolean {

      return (this._name === rhs._name &&
         ((this._surname === rhs._surname)));
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
         throw new InvalidParameterError("Email");
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
         throw new InvalidParameterError("Url");
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

export class Roles {
   private _roles: Array<ERoleType>;

   /**
    * Create a Roles object
    * @param roles - list of roles to initialise
    */
   constructor(roles: Array<ERoleType>) {

      if (!Roles.isValidRoleList(roles)) {
         throw new InvalidParameterError("Roles");
      }

      // Sort the list as we do an item by item equality test
      roles.sort();
      this._roles = roles;
   }

   /**
   * set of 'getters' for private variables
   */
   get roles(): Array<ERoleType> {
      return this._roles;
   }

   /**
    * test if a person has a given role  
    * @param role - the roles to check 
    */
   includesRole(role: ERoleType): boolean {

      return (this._roles.includes(role));
   }

   /**
    * test for valid list of roles
    * @param roles - the list to test 
    */
   static isValidRoleList(roles: Array<ERoleType>): boolean {
      if (new Set(roles).size !== roles.length)
         return false;

      return (true);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   static rolesArraysAreEqual(lhs: Array<ERoleType>,
                              rhs: Array<ERoleType>): boolean {

   // compare lengths - can save a lot of time 
   if (lhs.length != rhs.length)
      return false;

   for (var i = 0; i < lhs.length; i++) {
      if (lhs[i] !== (rhs[i])) {
         return false;
      }
   }
   return true;
}

   equals(rhs: Roles): boolean {

      return (Roles.rolesArraysAreEqual(this._roles, rhs._roles));
   }
}

export class Person extends Persistence {
   private _externalId: string;
   private _name: Name;
   private _email: EmailAddress | null;
   private _thumbnailUrl: Url | null;
   private _roles: Roles | null;

/**
 * Create a Person object
 * @param persistenceDetails - (from Persistence) for the database layer to use and assign
 * @param externalId - ID assigned by external system (like facebook)
 * @param name - plain text user name
 * @param email - user email, can be null if not provided
 * @param thumbnailUrl - URL to thumbnail image, can be null if not provided
 * @param roles - list of roles the Person plays, can be null
 */
   constructor(persistenceDetails: PersistenceDetails,
      externalId: string, name: Name, email: EmailAddress | null, thumbnailUrl: Url | null, roles: Roles | null) {

      super(persistenceDetails);

      this._externalId = externalId;
      this._name = name;
      this._email = email;
      this._thumbnailUrl = thumbnailUrl;
      this._roles = roles;
   }

   /**
   * set of 'getters' for private variables
   */
   get externalId(): string {
      return this._externalId;
   }
   get name(): Name {
      return this._name;
   }
   get email(): EmailAddress | null {
      return this._email;
   }
   get thumbnailUrl(): Url | null {
      return this._thumbnailUrl;
   }
   get roles(): Roles | null {
      return this._roles;
   }
   set name(name: Name) {
      this._name = name;
   }
   set email(email: EmailAddress) {
      this._email = email;
   }
   set thumbnailUrl(thumbnailUrl: Url) {
      this._thumbnailUrl = thumbnailUrl;
   }
   set roles(roles: Roles) {
      this._roles = roles;
   }

   /**
    * test if a person has a given role  
    * @param role - the roles to check 
    */
   hasRole(role: ERoleType): boolean {

      return (this._roles.includesRole(role));
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
    equals (rhs: Person) : boolean {

       return ((super.equals(rhs)) &&
         (this._externalId === rhs._externalId) &&
         (this._name.equals (rhs._name)) &&
         (this._email ? this._email.equals(rhs._email) : (rhs.email === null)) &&
         (this._thumbnailUrl ? this._thumbnailUrl.equals(rhs._thumbnailUrl) : (rhs.thumbnailUrl === null)) &&
         (this._roles ? this._roles.equals(rhs._roles) : (rhs._roles === null))
         );
   }
}


export function personArraysAreEqual(lhs: Array<Person>, rhs: Array<Person>): boolean {

   // if we have mis-matched false values, return false
   if (lhs && !rhs || !lhs && rhs)
      return false;

   for (var i = 0; i < lhs.length; i++) {
      if (!lhs[i].equals(rhs[i])) {
         return false;
      }
   }
   return true;
}

export interface IPersonLoader {
   load(): Person;
}

export interface IPersonStorer {
   save(person: Person);
}