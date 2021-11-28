/*! Copyright TXPCo, 2020, 2021 */
// Party contains things that are common across a Person and a Business - currently just Name and Url

import { URL } from 'url'
import { InvalidParameterError } from './CoreError';

export class NameMemento {
   readonly _displayName: string;

   /**
    * Create a NameMemento object
    * @param displayName - user name for a Person, or the name of Business.
    * Design - all memento classes must depend only on base types, value types, or other Mementos**
    */
   constructor(displayName: string) {

      this._displayName = displayName;
   }
}

export class Name {
   private _displayName: string;

   /**
    * Create a Name object
    * @param displayName - user name for a Person, or the name of business.
    */
   public constructor(displayName: string) {

      if (!Name.isValidName(displayName)) {
            throw new InvalidParameterError("Name");
         }
      this._displayName = displayName;
   }

   /**
   * set of 'getters' for private variables
   */
   get displayName(): string {
      return this._displayName;
   }

   /**
   * memento() returns a copy of internal state
   */
   memento(): NameMemento {
      return new NameMemento(this._displayName);
   }

   /**
 * test for equality - checks all fields are the same. 
 * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
 * @param rhs - the object to compare this one to.  
 */
   equals(rhs: Name): boolean {

      return (this._displayName === rhs._displayName);
   }

   /**
    * test for valid name 
    * @param name - the string to test
    */
   static isValidName(name: string): boolean {
      if (name && name.length > 0)
         return true;

      return (false);
   }
}

export class UrlMemento {
   _url: string;
   _isUrlVerified: boolean;

   /**
    * Create a UrlMemento object
    * @param url - user email
    * @param isUrlVerified - boolean to say if we know URL is valid i.e we have retrieved it
    * Design - all memento classes must depend only on base types, value types, or other Mementos*
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

export class PersonaMemento {
   _name: NameMemento;
   _thumbnailUrl: UrlMemento | null;

   /**
    * Create a PersonMemento object
    * @param name - plain text user name. Cannot be null. 
    * @param thumbnailUrl - URL to thumbnail image, can be null if not provided
    * Design - all memento classes must depend only on base types, value types, or other Mementos
    */
   constructor( name: NameMemento, thumbnailUrl: UrlMemento | null) {

      this._name = name;
      this._thumbnailUrl = thumbnailUrl;
   }
}

export class Persona {
   private _name: Name;
   private _thumbnailUrl: Url | null;

   /**
    * Create a Persona object
    * @param name - plain text user name. Cannot be null.
    * @param thumbnailUrl - URL to thumbnail image, can be null if not provided
    */
   public constructor(name: Name, thumbnailUrl: Url | null)
   public constructor(memento: PersonaMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {
         let memento: PersonaMemento = params[0];

         this._name = new Name(memento._name._displayName);
         this._thumbnailUrl = new Url(memento._thumbnailUrl._url, memento._thumbnailUrl._isUrlVerified);
      }
      else {
         this._name = params[0];
         this._thumbnailUrl = params[1];
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get name(): Name {
      return this._name;
   }
   get thumbnailUrl(): Url | null {
      return this._thumbnailUrl;
   }
   set name(name: Name) {
      this._name = name;
   }
   set thumbnailUrl(thumbnailUrl: Url) {
      this._thumbnailUrl = thumbnailUrl;
   }

   /**
   * memento() returns a copy of internal state
   */
   memento(): PersonaMemento {
      return new PersonaMemento(
         this._name.memento(),
         this._thumbnailUrl.memento());
   }

   static mementos (people: Array<Persona>): Array<PersonaMemento> {

      let peopleMemento = new Array<PersonaMemento>(people.length);

      for (var i: number = 0; i < people.length; i++)
         peopleMemento[i] = people[i].memento();

      return peopleMemento;
   }


   static areEqual(lhs: Array<Persona>, rhs: Array<Persona>): boolean {

      // if we have mis-matched false values, return false
      if (lhs && !rhs || !lhs && rhs)
         return false;

      // if we have mis-matched sizes, return false
      if (lhs.length !== rhs.length)
         return false;

      // lse compare all entries
      for (var i = 0; i < lhs.length; i++) {
         if (!lhs[i].equals(rhs[i])) {
            return false;
         }
      }
      return true;
   }


   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Persona): boolean {

      return (this._name.equals(rhs._name)) &&
         (this._thumbnailUrl ? this._thumbnailUrl.equals(rhs._thumbnailUrl) : (rhs.thumbnailUrl === null));
   }
}