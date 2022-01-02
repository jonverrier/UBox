/*! Copyright TXPCo, 2020, 2021 */
import { InvalidParameterError } from './CoreError';
import { PersistenceDetails, PersistenceDetailsMemento, ILoaderFor, ISaverFor, IKeyMultiLoaderFor} from './Persistence';
import { Persona, PersonaDetails, PersonaMemento, PersonaDetailsMemento} from './Persona';
import { Person, PersonMemento } from './Person';

// Design note - classes derived from persona should have the same layout for IO. This means Persona classes can be constructed from wire/Db representations of derived classes.
// This enables Personas to be used for Lists etc & saves duplicate classes/code for each derived type
export class BusinessMemento extends PersonaMemento {
   readonly _persistenceDetails: PersistenceDetailsMemento;
   readonly _personaDetails: PersonaDetailsMemento;
   _administrators: Array<PersonaMemento>; // Not readonly as database needs to manually set
   _members: Array<PersonaMemento>;        // Not readonly as database needs to manually set

   // These are used to allow the Db layer to switch object references to string Ids on save, and the reverse on load
   // so separate documents/tables can be used in the DB
   _administratorIds: Array<string>;
   _memberIds: Array<string>;

   /**
    * Create a BusinessMemento object
    * @param persistenceDetails - (from Persistence) for the database layer to use and assign.
    * @param personaDetails - agrregate of information to represent a Persona 
    * @param administrators - array of People, may be zero length // TODO - must have at least one adminsistrator
    * @param members - array of People, may be zero length // TODO - must have at least one adminsistrator* 
    * Design - all memento classes must depend only on base types, value types, or other Mementos
    */
   constructor(persistenceDetails: PersistenceDetailsMemento,
      personaDetails: PersonaDetailsMemento,
      administrators: Array<PersonaMemento>,
      members: Array<PersonaMemento>) {

      super(persistenceDetails, personaDetails);

      var i: number = 0;

      this._persistenceDetails = persistenceDetails;
      this._personaDetails = personaDetails;

      this._administrators = new Array<PersonMemento>(administrators.length);
      for (i = 0; i < administrators.length; i++)
         this._administrators[i] = administrators[i];

      this._members = new Array<PersonMemento>(members.length);
      for (i = 0; i < members.length; i++)
         this._members[i] = members[i];

      this._administratorIds = new Array<string>();
      this._memberIds = new Array<string>();
   }
}

export class Business extends Persona {
   private _administrators: Array<Persona>;
   private _members: Array<Persona>;

   // These are used to allow the Db layer to swizzle object references to string Ids on save, and the reverse on load
   // so separate documents/tables can be used in the DB
   private _administratorIds: Array<string>;
   private _memberIds: Array<string>;

   /**
    * Create a Business object
    * @param persistenceDetails - details for the DB layer to save/load entities
    * @param personaDetails - plain text user name, profile picture.
    * @param administrators - array of People
    * @param members - array of People
    */
   constructor(persistenceDetails: PersistenceDetails,
      personaDetails: PersonaDetails,
      administrators: Array<Persona>,
      members: Array<Persona>);
   public constructor(memento: BusinessMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {
         var i: number;
         let memento: BusinessMemento = params[0];

         super(new PersistenceDetails(memento._persistenceDetails), new PersonaDetails(memento._personaDetails));

         this._administrators = new Array<Persona>(memento._administrators.length);
         for (i = 0; i < memento._administrators.length; i++)
            this._administrators[i] = new Persona(memento._administrators[i]);

         this._members = new Array<Persona>(memento._members.length);
         for (i = 0; i < memento._members.length; i++)
            this._members[i] = new Persona(memento._members[i]);

         this._administratorIds = new Array<string>();
         this._memberIds = new Array<string>();

      } else {

         super(params[0], params[1]);

         this._administrators = params[2];
         this._members = params[3];

         this._administratorIds = new Array<string>();
         this._memberIds = new Array<string>();
      }

      if (!Business.isValidAdministratorList(this._administrators)) {
         throw new InvalidParameterError("Administrators");
      }

      if (!Business.isValidMemberList(this._members)) {
         throw new InvalidParameterError("Members");
      }

   }

   /**
   * set of 'getters' and setters for private variables
   */
   get administrators(): Array<Persona> {
      return this._administrators;
   }
   get members(): Array<Persona> {
      return this._members;
   }
   set administrators(people: Array<Persona>) {
      this._administrators = people;
   }
   set members(people: Array<Persona>) {
      this._members = people;
   }


   /**
   * memento() returns a copy of internal state
   */
   memento(): BusinessMemento {

      return new BusinessMemento(super.persistenceDetails.memento(),
         super.personaDetails.memento(),
         Persona.mementos(this._administrators),
         Persona.mementos(this._members));
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Business): boolean {

      return (super.equals(rhs) &&
         Persona.areEqual(this._administrators, rhs._administrators) &&
         Persona.areEqual(this._members, rhs._members));
   }

   /**
    * test if a business includes a person as an administrator 
    * @param person - the person to check
    */
   includesAdministrator(person: Person): boolean {

      return (this._administrators.includes(person));
   }

   /**
    * test if a business includes a person as a member 
    * @param person - the person to check
    */
   includesMember(person: Persona): boolean {

      return (this._members.includes(person));
   }

   /**
    * test for valid list of people as Administrators
    * @param administrators - the list to test 
    */
   static isValidAdministratorList(administrators: Array<Persona>): boolean {
      if (!administrators || administrators.length === 0) // Must be non-zero length
         return false;

      return (true);
   }

   /**
    * test for valid list of people as Administrators
    * @param members - the list to test 
    */
   static isValidMemberList(members: Array<Persona>): boolean {
      if (!members) // Must be an array
         return false;

      return (true);
   }
}

export interface IBusinessStore extends ILoaderFor<Business>, ISaverFor<Business> {

}

export interface IBusinessesStoreById extends IKeyMultiLoaderFor<Business> {
}