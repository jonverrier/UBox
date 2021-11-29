/*! Copyright TXPCo, 2020, 2021 */
import { URL } from 'url'
import { InvalidParameterError } from './CoreError';
import { PersistenceDetails} from "./Persistence";
import { Persona, PersonaMemento} from './Persona';

// Rule summary for a Persistent Object: 
// - derives from IPersistence, which contains a PersistentDetails member object. 
// - can save itself to a Memento object, which contains internal state. 
// - has a Codec class, which can transform to and from the Memento format. 
// - Memento versions are transmitted over the wire, and stored in the database.

export enum ERoleType {
   Prospect = "Prospect", Member = "Member", Coach = "Coach"
}

export class EmailAddressMemento {
   readonly _email: string;
   readonly _isEmailVerified: boolean;

   /**
    * Create an EmailAddressMemento object
    * @param email - user email
    * @param isEmailVefified - boolean to say if we know it is their email
    */
   constructor(email: string, isEmailVerified: boolean) {

      this._email = email;
      this._isEmailVerified = isEmailVerified;
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

export class RolesMemento {
   readonly _roles: Array<ERoleType>;

   /**
    * Create a RolesMemento {
 object
    * @param roles - list of roles to initialise
    */
   constructor(roles: Array<ERoleType>) {

      this._roles = roles;
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
      this._roles = new Array<ERoleType>(roles.length);

      // duplicate into a clean array in case we are passed (for example) a Mongo array
      for (let i in roles) {
         this._roles[i] = roles[i]; 
      }
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
   static areEqual(lhs: Array<ERoleType>,
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

      return (Roles.areEqual(this._roles, rhs._roles));
   }
}

export class PersonMemento extends PersonaMemento {
   _persona: PersonaMemento;
   _email: EmailAddressMemento | null;
   _roles: RolesMemento | null;

   /**
    * Create a PersonMemento object
    * @param persona - personal (name and imageUrl)
    * @param email - user email, can be null if not provided
    * @param roles - list of roles the Person plays
    * Design - all memento classes must depend only on base types, value types, or other Mementos
    */
   constructor(persona: PersonaMemento, email: EmailAddressMemento, roles: RolesMemento) {

      super(persona._persistenceDetails, persona._name, persona._thumbnailUrl);

      this._persona = persona; 
      this._email = email;
      this._roles = roles;
   }
}

export class Person extends Persona {
   private _email: EmailAddress ;
   private _roles: Roles ;

/**
 * Create a Person object
 * @param persona - plain text user name. Cannot be null.
 * @param email - user email, can be null if not provided
 * @param thumbnailUrl - URL to thumbnail image, can be null if not provided
 * @param roles - list of roles the Person plays, can be null
 */
   public constructor(
      persona: Persona, email: EmailAddress , roles: Roles );
   public constructor(memento: PersonMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {

         let memento: PersonMemento = params[0];

         super(params[0]._persona);

         this._email = new EmailAddress(memento._email._email, memento._email._isEmailVerified);
         this._roles = new Roles(memento._roles._roles);

      } else {

         super(params[0]);

         this._email = params[1];
         this._roles = params[2];
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get email(): EmailAddress {
      return this._email;
   }

   get roles(): Roles {
      return this._roles;
   }
   set email(email: EmailAddress) {
      this._email = email;
   }

   set roles(roles: Roles) {
      this._roles = roles;
   }

   /**
   * memento() returns a copy of internal state
   */
   memento(): PersonMemento {
      return new PersonMemento(super.memento(),
         this._email ? this.email.memento() : null,
         this._roles ? this.roles.memento() : null);
   }

   static mementos(people: Array<Person>): Array<PersonMemento> {

      let peopleMemento = new Array<PersonMemento>(people.length);

      for (var i: number = 0; i < people.length; i++)
         peopleMemento[i] = people[i].memento();

      return peopleMemento;
   }

   
   static areEqual(lhs: Array<Person>, rhs: Array<Person>): boolean {

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
         (this._email.equals(rhs._email)) &&
         (this._roles.equals(rhs._roles))
         );
   }
}

export interface IPersonStore {
   loadOne(id: string): Promise<Person | null>;
   loadMany(ids: Array<string>): Promise <Array<Person>>;
   save(person: Person): Promise<Person | null>;
}
