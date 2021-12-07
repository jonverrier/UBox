/*! Copyright TXPCo, 2020, 2021 */
import { InvalidParameterError } from './CoreError';
import { PersistenceDetails, PersistenceDetailsMemento, ILoaderFor, ISaverFor, IMultiLoaderFor } from "./Persistence";
import { Persona, PersonaDetails, PersonaDetailsMemento, PersonaMemento} from './Persona';

// Rule summary for a Persistent Object: 
// - derives from IPersistence, which contains a PersistentDetails member object. 
// - can save itself to a Memento object, which contains internal state. 
// - has a Codec class, which can transform to and from the Memento format. 
// - Memento versions are transmitted over the wire, and stored in the database.

export enum ERoleType {
   Prospect = "Prospect", Member = "Member", Coach = "Coach"
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

// Design note - classes derived from persona should have the same layout for IO. This means Persona classes can be constructed from wire/Db representations of derived classes. 
// This enables Personas to be used for Lists etc & saves duplicate classes/code for each derived type
export class PersonMemento extends PersonaMemento {
   _persistenceDetails: PersistenceDetailsMemento;
   _personaDetails: PersonaDetailsMemento;
   _email: string;
   _roles: RolesMemento;

   /**
    * Create a PersonMemento object
    * @param persistenceDetails - (from Persistence) for the database layer to use and assign. Cannot be null, may have null values.* 
    * @param personaDetails - agrregate of information to represent a Persona 
    * @param email - user email, can be null if not provided
    * @param roles - list of roles the Person plays
    * Design - all memento classes must depend only on base types, value types, or other Mementos
    */
   constructor(persistenceDetails: PersistenceDetailsMemento,
      personaDetails: PersonaDetailsMemento,
      email: string, roles: RolesMemento) {

      super(persistenceDetails, personaDetails);

      this._persistenceDetails = persistenceDetails; 
      this._personaDetails = personaDetails;
      this._email = email;
      this._roles = roles;
   }
}

export class Person extends Persona {
   private _email: string ;
   private _roles: Roles ;

/**
 * Create a Person object
 * @param persistenceDetails - details for the DB layer to save/load entities
 * @param personaDetails - plain text user name, profile picture.
 * @param email - user email
 * @param roles - list of roles the Person plays, can be null
 */
   public constructor(
      persistenceDetails: PersistenceDetails,
      personaDetails: PersonaDetails,
      email: string, roles: Roles);
   public constructor(memento: PersonMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {

         let memento: PersonMemento = params[0];

         super(new PersistenceDetails (memento._persistenceDetails), new PersonaDetails (memento._personaDetails));

         this._email = memento._email;
         this._roles = new Roles(memento._roles._roles);

      } else {

         super(params[0], params[1]);

         this._email = params[2];
         this._roles = params[3];
      }

      if (!Person.isValidEmailAddress(this._email)) {
         throw new InvalidParameterError("Email");
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get email(): string {
      return this._email;
   }

   get roles(): Roles {
      return this._roles;
   }
   set email(email: string) {
      this._email = email;
   }

   set roles(roles: Roles) {
      this._roles = roles;
   }

   /**
   * memento() returns a copy of internal state
   */
   memento(): PersonMemento {
      return new PersonMemento(super.persistenceDetails.memento(),
         super.personaDetails.memento(),
         this._email,
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
    * test if a person is a Member
    * @param role - the roles to check 
    */
   isMember(): boolean {

      return (this._roles.includesRole(ERoleType.Member));
   }

   /**
    * test if a person is a Coach
    * @param role - the roles to check 
    */
   isCoach(): boolean {

      return (this._roles.includesRole(ERoleType.Coach));
   }

   /**
    * test if a person is a Prospect
    * @param role - the roles to check 
    */
   isProspect (): boolean {

      return (this._roles.includesRole(ERoleType.Prospect));
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
    equals (rhs: Person) : boolean {

       return ((super.equals(rhs)) &&
         (this._email === rhs._email) &&
         (this._roles.equals(rhs._roles))
         );
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
}

export interface IPersonStore extends ILoaderFor<Person>, ISaverFor<Person>, IMultiLoaderFor<Person> {

}

export interface IMyPersonStore extends ILoaderFor<Person> {

}