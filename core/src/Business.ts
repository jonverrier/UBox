/*! Copyright TXPCo, 2020, 2021 */
import { InvalidParameterError } from './CoreError';
import { Persona, PersonaMemento } from './Persona';
import { EmailAddress, Person, PersonMemento } from './Person';
import { PersistenceDetails, PersistenceDetailsMemento, Persistence } from "./Persistence";

export class BusinessMemento {
   readonly _persistenceDetails: PersistenceDetailsMemento;
   readonly _persona: PersonaMemento;
   _administrators: Array<PersonMemento>; // Not readonly as database needs to manually set
   _members: Array<PersonMemento>;        // Not readonly as database needs to manually set

   // These are used to allow the Db layer to switch object references to string Ids on save, and the reverse on load
   // so separate documents/tables can be used in the DB
   _administratorIds: Array<string>;
   _memberIds: Array<string>;

   /**
    * Create a BusinessMemento object
    * @param persistenceDetailsMemento - (from Persistence) for the database layer to use and assign
    * @param persona - persona for the business (display name and URL)
    * @param thumbnailUrl - Url to the thumbnail image
    * @param administrators - array of People, may be zero length // TODO - must have at least one adminsistrator
    * @param members - array of People, may be zero length // TODO - must have at least one adminsistrator* 
    * Design - all memento classes must depend only on base types, value types, or other Mementos
    */
   constructor(persistenceDetails: PersistenceDetailsMemento,
      persona: PersonaMemento,
      administrators: Array<PersonMemento>,
      members: Array<PersonMemento>) {

      if ((!administrators) || administrators.length < 1)
         throw new InvalidParameterError("Business must have at least one Administrator");

      var i: number = 0;

      this._persistenceDetails = persistenceDetails;
      this._persona = persona;

      this._administrators = new Array<PersonMemento>(administrators.length);
      for (i = 0; i < administrators.length; i++)
         this._administrators[i] = administrators[i];

      this._members = new Array<PersonMemento>(members.length);
      for (i = 0; i < members.length; i++)
         this._members[i] = members[i];

      this._administratorIds = null;
      this._memberIds = null;
   }
}

export class Business extends Persistence {
   private _persona: Persona;
   private _administrators: Array<Person>;
   private _members: Array<Person>;

   // These are used to allow the Db layer to swizzle object references to string Ids on save, and the reverse on load
   // so separate documents/tables can be used in the DB
   private _administratorIds: Array<string>;
   private _memberIds: Array<string>;

   /**
    * Create a Business object
    * @param persistenceDetails - (from Persistence) for the database layer to use and assign
    * @param persona - persona for the business
    * @param administrators - array of People
    * @param members - array of People
    */
   constructor(persistenceDetails: PersistenceDetails,
      persona: Persona,
      administrators: Array<Person>,
      members: Array<Person>);
   public constructor(memento: BusinessMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {
         var i: number;
         let memento: BusinessMemento = params[0];

         super(new PersistenceDetails(memento._persistenceDetails._key,
            memento._persistenceDetails._schemaVersion,
            memento._persistenceDetails._sequenceNumber));

         this._persona = new Persona(memento._persona);

         this._administrators = new Array<Person>(memento._administrators.length);
         for (i = 0; i < memento._administrators.length; i++)
            this._administrators[i] = new Person(memento._administrators[i]);

         this._members = new Array<Person>(memento._members.length);
         for (i = 0; i < memento._members.length; i++)
            this._members[i] = new Person(memento._members[i]);

         this._administratorIds = null;
         this._memberIds = null;

      } else {

         super(params[0]);

         this._persona = params[1];
         this._administrators = params[2];
         this._members = params[3];

         this._administratorIds = null;
         this._memberIds = null;
      }
   }

   /**
   * set of 'getters' and setters for private variables
   */
   get persona(): Persona {
      return this._persona;
   }
   get administrators(): Array<Person> {
      return this._administrators;
   }
   get members(): Array<Person> {
      return this._members;
   }
   set persona(persona: Persona) {
      this._persona = persona;
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

      return new BusinessMemento(this.persistenceDetails.memento(),
         this._persona.memento(),
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
         (this._persona.equals (rhs._persona)) &&
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

export interface IBusinessStore {
   loadOne(id: string): Promise<Business | null>;
   save(business: Business): Promise<Business | null>;
}
