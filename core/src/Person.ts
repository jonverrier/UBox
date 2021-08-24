/*! Copyright TXPCo, 2020, 2021 */
import { URL } from 'url'
import { InvalidParameterError } from './CoreError';
import { PersistenceDetails, PersistenceDetailsMemento, Persistence } from "./Persistence";

// Rule summary for a Persistent Object: 
// - derives from IPersistence, which contains a PersistentDetails member object. 
// - can save itself to a Memento object, which contains internal state. 
// - has a Codec class, which can transform to and from the Memento format. 
// - Memento versions are transmitted over the wire, and stored in the database.

export enum ERoleType {
   Prospect = "Prospect", Member = "Member", Coach = "Coach"
}

export enum ELoginProvider {
   Apple = "Apple", Google = "Google", Private = "Private"
}

export class NameMemento {
   _name: string;
   _surname: string;

   /**
    * Create a NameMemento object
    * @param name - user first name
    * @param surname - user family name, can be null
    */
   constructor(name: string, surname: string | null = null) {

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

}

export class Name {
   private _name: string;
   private _surname: string;

   /**
    * Create a Name object
    * @param name - user first name
    * @param surname - user family name, can be null
    */
   public constructor(name: string, surname: string | null);
   public constructor(memento: NameMemento);
   public constructor(...paramArray: any[]) {

      if (paramArray.length === 1) {
         if (!Name.isValidName(paramArray[0]._name)) {
            throw new InvalidParameterError("Name");
         }
         this._name = paramArray[0]._name;
         this._surname = paramArray[0]._surname;
      } else {
         if (!Name.isValidName(paramArray[0])) {
            throw new InvalidParameterError("Name");
         }
         this._name = paramArray[0];
         this._surname = paramArray[1];
      }
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
   * memento() returns a copy of internal state
   */
   memento(): NameMemento {
      return new NameMemento(this._name, this._surname);
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

export class LoginDetailsMemento {
   _provider: ELoginProvider;
   _token: string;

   /**
    * Create a LoginDetailsMemento object
    * @param name - user first name
    * @param surname - user family name, can be null
    */
   constructor(provider: ELoginProvider, token: string) {

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
}

export class LoginDetails {
   private _provider: ELoginProvider;
   private _token: string;

   /**
    * Create a LoginDetails object
    * @param provider - which login provider was used 
    * @param token - token provided by the external provider 
    */
   constructor(provider: ELoginProvider, token: string) {

      if (!LoginDetails.isValidLoginDetails(token)) {
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
   memento(): LoginDetailsMemento {
      return new LoginDetailsMemento(this._provider, this._token);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: LoginDetails): boolean {

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

export class EmailAddressMemento {
   _email: string;
   _isEmailVerified: boolean;

   /**
    * Create an EmailAddressMemento object
    * @param email - user email
    * @param isEmailVefified - boolean to say if we know it is their email
    */
   constructor(email: string, isEmailVerified: boolean) {

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
   * memento() returns a copy of internal state
   */
   memento(): EmailAddressMemento {
      return new EmailAddressMemento(this._email, this._isEmailVerified);
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

export class UrlMemento {
   _url: string;
   _isUrlVerified: boolean;

   /**
    * Create a export class UrlMemento {
 object
    * @param url - user email
    * @param isUrlVerified - boolean to say if we know URL is valid i.e we have retrieved it
    */
   constructor(url: string, isUrlVerified: boolean) {

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
   * memento() returns a copy of internal state
   */
   memento(): UrlMemento {
      return new UrlMemento(this._url, this._isUrlVerified);
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

export class RolesMemento {
   _roles: Array<ERoleType>;

   /**
    * Create a RolesMemento {
 object
    * @param roles - list of roles to initialise
    */
   constructor(roles: Array<ERoleType>) {

      this._roles = roles;
   }

   /**
   * set of 'getters' for private variables
   */
   get roles(): Array<ERoleType> {
      return this._roles;
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

   /**
   * memento() returns a copy of internal state
   */
   memento(): RolesMemento {
      return new RolesMemento(this._roles);
   }

   equals(rhs: Roles): boolean {

      return (Roles.rolesArraysAreEqual(this._roles, rhs._roles));
   }
}

export class PersonMemento {
   _persistenceDetails: PersistenceDetailsMemento;
   _loginDetails: LoginDetailsMemento;
   _name: NameMemento;
   _email: EmailAddressMemento | null;
   _thumbnailUrl: UrlMemento | null;
   _roles: RolesMemento | null;

   /**
    * Create a PersonMemento object
    * @param persistenceDetails - (from Persistence) for the database layer to use and assign. Cannot be null, may have null values.
    * @param loginDetails - ID assigned by external system (like facebook). Cannot be null. 
    * @param name - plain text user name. Cannot be null. 
    * @param email - user email, can be null if not provided
    * @param thumbnailUrl - URL to thumbnail image, can be null if not provided
    * @param roles - list of roles the Person plays, can be null
    */
   constructor(persistenceDetails: PersistenceDetails,
      loginDetails: LoginDetails, name: Name, email: EmailAddress | null, thumbnailUrl: Url | null, roles: Roles | null) {

      this._persistenceDetails = persistenceDetails.memento();
      this._loginDetails = loginDetails.memento();
      this._name = name.memento();
      this._email = email ? email.memento() : null;
      this._thumbnailUrl = thumbnailUrl? thumbnailUrl.memento() : null;
      this._roles = roles ? roles.memento() : null;
   }

   /**
   * set of 'getters' for private variables
   */

   get persistenceDetails(): PersistenceDetailsMemento {
      return this._persistenceDetails;
   }
   get loginDetails(): LoginDetailsMemento {
      return this._loginDetails;
   }
   get name(): NameMemento {
      return this._name;
   }
   get email(): EmailAddressMemento | null {
      return this._email;
   }
   get thumbnailUrl(): UrlMemento | null {
      return this._thumbnailUrl;
   }
   get roles(): RolesMemento | null {
      return this._roles;
   }

}

export class Person extends Persistence {
   private _loginDetails: LoginDetails;
   private _name: Name;
   private _email: EmailAddress | null;
   private _thumbnailUrl: Url | null;
   private _roles: Roles | null;

/**
 * Create a Person object
 * @param persistenceDetails - (from Persistence) for the database layer to use and assign. Cannot be null, may have null values.
 * @param loginDetails - ID assigned by external system (like facebook). Cannot be null.
 * @param name - plain text user name. Cannot be null.
 * @param email - user email, can be null if not provided
 * @param thumbnailUrl - URL to thumbnail image, can be null if not provided
 * @param roles - list of roles the Person plays, can be null
 */
   public constructor(persistenceDetails: PersistenceDetails,
      loginDetails: LoginDetails, name: Name, email: EmailAddress | null, thumbnailUrl: Url | null, roles: Roles | null);
   public constructor(memento: PersonMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {

         let memento: PersonMemento = params[0];

         super(new PersistenceDetails(memento._persistenceDetails._key,
            memento._persistenceDetails._schemaVersion,
            memento._persistenceDetails._sequenceNumber));

         this._loginDetails = new LoginDetails(memento._loginDetails._provider, memento._loginDetails._token);
         this._name = new Name(memento._name._name, memento._name._surname); 
         this._email = memento._email ? new EmailAddress(memento._email._email, memento._email._isEmailVerified) : null;
         this._thumbnailUrl = memento._thumbnailUrl ? new Url(memento._thumbnailUrl._url, memento._thumbnailUrl._isUrlVerified) : null;
         this._roles = memento._roles ? new Roles(memento._roles._roles) : null;

      } else {

         super(params[0]);

         this._loginDetails = params[1];
         this._name = params[2];
         this._email = params[3];
         this._thumbnailUrl = params[4];
         this._roles = params[5];
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get loginDetails(): LoginDetails {
      return this._loginDetails;
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
   * memento() returns a copy of internal state
   */
   memento(): PersonMemento {
      return new PersonMemento (this.persistenceDetails, this._loginDetails, this._name, this._email, this._thumbnailUrl, this._roles);
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
         (this._loginDetails.equals(rhs._loginDetails)) &&
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

export interface IPersonStore {
   loadOne(id: string): Promise<Person | null>;
   loadMany(ids: Array<string>): Promise <Array<Person>>;
   save(person: Person): Promise<Person | null>;
}
