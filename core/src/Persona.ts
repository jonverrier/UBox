/*! Copyright TXPCo, 2020, 2021 */
// Party contains things that are common across a Person and a Business - currently just Name and Url

import { Url } from './Url';
import { InvalidParameterError } from './CoreError';
import { PersistenceDetails, PersistenceDetailsMemento, Persistence, IMultiLoaderFor } from "./Persistence";


export class PersonaDetailsMemento {
   _name: string;
   _thumbnailUrl: string;
   _bio: string;

   /**
    * Create a PersonMemento object
    * @param name - plain text user name.
    * @param thumbnailUrl - URL to thumbnail image.
    * @param bio - string to use as biography 
    * Design - all memento classes must depend only on base types, value types, or other Mementos
    */
   constructor(name: string,
      thumbnailUrl: string,
      bio: string   ) {

      this._name = name;
      this._thumbnailUrl = thumbnailUrl;
      this._bio = bio;
   }
}

// PersonaDetails - really just aggregates name, URL & bio to reduce number of parameters for setup of new objects
// excludes email and other PII so can be passed to client even when describing an individual.
export class PersonaDetails  {
   private _name: string;
   private _thumbnailUrl: string;
   _bio: string;

   /**
    * Create a PersonaDetails object
    * @param name - plain text user name.
    * @param thumbnailUrl - URL to thumbnail image.
    * @param bio - string to use as biography * 
    */
   public constructor(name: string, thumbnailUrl: string, bio: string)
   public constructor(memento: PersonaDetailsMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {
         let memento: PersonaDetailsMemento = params[0];
         this._name = memento._name;
         this._thumbnailUrl = memento._thumbnailUrl;
         this._bio = memento._bio;
      }
      else {
         this._name = params[0];
         this._thumbnailUrl = params[1];
         this._bio = params[2];
      }

      if (!PersonaDetails.isValidUrl(this._thumbnailUrl)) {
         throw new InvalidParameterError("Url");
      }

      if (!PersonaDetails.isValidName(this._name)) {
         throw new InvalidParameterError("Name");
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get name(): string {
      return this._name;
   }

   get thumbnailUrl(): string {
      return this._thumbnailUrl;
   }

   get bio(): string {
      return this._bio;
   }

   set name(name: string) {
      if (!PersonaDetails.isValidName(name)) {
         throw new InvalidParameterError("Name");
      }

      this._name = name;
   }

   set thumbnailUrl(thumbnailUrl: string) {
      if (!PersonaDetails.isValidUrl(thumbnailUrl)) {
         throw new InvalidParameterError("Url");
      }

      this._thumbnailUrl = thumbnailUrl;
   }

   set bio(bio: string) {

      this._bio = bio;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: PersonaDetails): boolean {

      return ((this._name === rhs._name) &&
         (this._thumbnailUrl === rhs._thumbnailUrl) &&
         (this._bio === rhs._bio));
   }

   /**
   * memento() returns a copy of internal state
   */
   memento(): PersonaDetailsMemento {
      return new PersonaDetailsMemento(this.name,
         this.thumbnailUrl, this._bio);
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

   /**
    * test for valid url
    * @param url - the string to test 
    */
   static isValidUrl(url: string): boolean {
      if (url === null || url.length === 0)
         return false;

      let parsed;

      try {
         parsed = new Url(url);
      } catch (_) {
         return false;
      }
      return (true);
   }

   static _notSignedIn: PersonaDetails = new PersonaDetails("Not signed in", "/assets/img/person-o-512x512.png", "");
   static _unknown: PersonaDetails = new PersonaDetails("Unknown", "/assets/img/person-o-512x512.png", "");
   /**
    * return persona details for 'not logged in'
    */
   static notLoggedIn(): PersonaDetails {
      return PersonaDetails._notSignedIn;
   }

   /**
    * test if the persona details are the status 'not logged in'
    * @param persona - the persona to test 
    */
   static isNotLoggedIn(persona: PersonaDetails): boolean {
      return (persona === PersonaDetails._notSignedIn) ||
         (persona && persona.equals(PersonaDetails._notSignedIn));
   }

   /**
    * return persona details for 'unknown'
    */
   static unknown(): PersonaDetails {
      return PersonaDetails._unknown;
   }
}

// Design note - classes derived from persona should have the same layout for IO. This means Persona classes can be constructed from wire/Db representations of derived classes.
// This enables Personas to be used for Lists etc & saves duplicate classes/code for each derived type
export class PersonaMemento {
   _persistenceDetails: PersistenceDetailsMemento;
   _personaDetails: PersonaDetailsMemento;

   /**
    * Create a PersonMemento object
    * @param persistenceDetails - (from Persistence) for the database layer to use and assign. Cannot be null, may have null values.* 
    * @param personaDetails - agrregate of information to represent a Persona 
    * Design - all memento classes must depend only on base types, value types, or other Mementos
    */
   constructor(persistenceDetails: PersistenceDetailsMemento,
      personaDetails: PersonaDetailsMemento) {

      this._persistenceDetails = persistenceDetails;
      this._personaDetails = personaDetails;
   }
}

export class Persona extends Persistence {
   private _personaDetails: PersonaDetails;

   /**
    * Create a Persona object
    * @param personaDetails - plain text user name. Cannot be null.
    * @param thumbnailUrl - URL to thumbnail image
    */
   public constructor(persistenceDetails: PersistenceDetails,
      personaDetails: PersonaDetails)
   public constructor(memento: PersonaMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {
         let memento: PersonaMemento = params[0];

         super(new PersistenceDetails(memento._persistenceDetails._key,
            memento._persistenceDetails._schemaVersion,
            memento._persistenceDetails._sequenceNumber));

         this._personaDetails = new PersonaDetails (memento._personaDetails._name,
            memento._personaDetails._thumbnailUrl,
            memento._personaDetails._bio);
      }
      else {
         super(params[0]);

         this._personaDetails = params[1];
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get personaDetails(): PersonaDetails {
      return this._personaDetails;
   }
   set personaDetails(personaDetails: PersonaDetails) {
      this._personaDetails = personaDetails;
   }

   /**
   * memento() returns a copy of internal state
   */
   memento(): PersonaMemento {
      return new PersonaMemento(this.persistenceDetails.memento(),
         this._personaDetails.memento());
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

      return (super.equals(rhs) &&
         this._personaDetails.equals(rhs._personaDetails));
   }
}

export interface IPersonaStore extends IMultiLoaderFor<Persona> {

}