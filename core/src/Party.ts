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
      if (name === null || name.length === 0)
         return false;

      return (true);
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
