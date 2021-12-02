/*! Copyright TXPCo, 2020, 2021 */
import { InvalidParameterError } from './CoreError';
import { PersistenceDetails, PersistenceDetailsMemento, ILoaderFor, ISaverFor, IKeyMultiLoaderFor} from './Persistence';
import { Persona, PersonaDetails, PersonaMemento, PersonaDetailsMemento} from './Persona';
import { EmailAddress, Person, PersonMemento } from './Person';

// Design note - classes derived from persona should have the same layout for IO. This means Persona classes can be constructed from wire/Db representations of derived classes.
// This enables Personas to be used for Lists etc & saves duplicate classes/code for each derived type
export class BusinessMemento extends PersonaMemento {
   readonly _persistenceDetails: PersistenceDetailsMemento;
   readonly _personaDetails: PersonaDetailsMemento;
   _administrators: Array<PersonMemento>; // Not readonly as database needs to manually set
   _members: Array<PersonMemento>;        // Not readonly as database needs to manually set

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
      administrators: Array<PersonMemento>,
      members: Array<PersonMemento>) {

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
   private _administrators: Array<Person>;
   private _members: Array<Person>;

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
      administrators: Array<Person>,
      members: Array<Person>);
   public constructor(memento: BusinessMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {
         var i: number;
         let memento: BusinessMemento = params[0];

         super(new PersistenceDetails(memento._persistenceDetails), new PersonaDetails(memento._personaDetails));

         this._administrators = new Array<Person>(memento._administrators.length);
         for (i = 0; i < memento._administrators.length; i++)
            this._administrators[i] = new Person(memento._administrators[i]);

         this._members = new Array<Person>(memento._members.length);
         for (i = 0; i < memento._members.length; i++)
            this._members[i] = new Person(memento._members[i]);

         this._administratorIds = new Array<string>();
         this._memberIds = new Array<string>();

      } else {

         super(params[0], params[1]);

         this._administrators = params[2];
         this._members = params[3];

         this._administratorIds = new Array<string>();
         this._memberIds = new Array<string>();
      }
   }

   /**
   * set of 'getters' and setters for private variables
   */
   get administrators(): Array<Person> {
      return this._administrators;
   }
   get members(): Array<Person> {
      return this._members;
   }
   set administrators(people: Array<Person>) {
      this._administrators = people;
   }
   set members(people: Array<Person>) {
      this._members = people;
   }


   /**
   * memento() returns a copy of internal state
   */
   memento(): BusinessMemento {

      return new BusinessMemento(super.persistenceDetails.memento(),
         super.personaDetails.memento(),
         Person.mementos(this._administrators),
         Person.mementos(this._members));
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Business): boolean {

      return (super.equals(rhs) &&
         Person.areEqual(this._administrators, rhs._administrators) &&
         Person.areEqual(this._members, rhs._members));
   }

   /**
    * test if a business includes a person as an administrator 
    * @param person - the person to check
    */
   includesAdministrator(person: Person): boolean {

      return (this._administrators.includes(person));
   }

   /**
    * test if a cohort includes a person as an administrator 
    * @param email - the person to check
    */
   includesAdministratorEmail(email: EmailAddress): boolean {

      return this.includesEmail(email, this._administrators);
   }

   /**
    * test if a business includes a person as a member 
    * @param person - the person to check
    */
   includesMember(person: Person): boolean {

      return (this._members.includes(person));
   }

   /**
    * test if a business includes a person as a member 
    * @param email - the person to check
    */
   includesMemberEmail(email: EmailAddress): boolean {

      return this.includesEmail(email, this._members);
   }

   /**
    * internal function to test if array includes a person with the email.
    * @param email - the person to check
    * @param people - an array of person objects to look inside to see if email is present
    */
   private includesEmail(email: EmailAddress, people: Array<Person>): boolean {

      for (let item of people) {
         if (item.email.equals(email))
            return true;
      }
      return false;
   }
}

export interface IBusinessStore extends ILoaderFor<Business>, ISaverFor<Business> {

}

export interface IMyBusinessesStore extends IKeyMultiLoaderFor<Business> {
}