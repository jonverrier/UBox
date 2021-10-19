/*! Copyright TXPCo, 2020, 2021 */
import { Name, NameMemento, Url, UrlMemento } from './Party';
import { EmailAddress, Person, PersonMemento, personArraysAreEqual } from './Person';
import { PersistenceDetails, PersistenceDetailsMemento, Persistence } from "./Persistence";

export class BusinessMemento {
   _persistenceDetails: PersistenceDetailsMemento;
   _name: Name;
   _thumbnailUrl: UrlMemento;
   _administrators: Array<PersonMemento>;

   // These are used to allow the Db layer to switch object references to string Ids on save, and the reverse on load
   // so separate documents/tables can be used in the DB
   _administratorIds: Array<string>;

   /**
    * Create a BusinessMemento object
    * @param persistenceDetails - (from Persistence) for the database layer to use and assign
    * @param name - plain text name for the cohort
    * @param thumbnailUrl - Url to the thumbnail image
    * @param administrators - array of People, may be zero length // TODO - must have at least one adminsistrator
    */
   constructor(persistenceDetails: PersistenceDetails,
      name: Name,
      thumbnailUrl: Url,
      administrators: Array<Person>) {

      var i: number = 0;

      this._persistenceDetails = persistenceDetails.memento();
      this._name = name;
      this._thumbnailUrl = thumbnailUrl.memento();

      this._administrators = new Array<PersonMemento>(administrators.length);
      for (i = 0; i < administrators.length; i++)
         this._administrators[i] = administrators[i].memento();

      this._administratorIds = null;
   }

   /**
   * set of 'getters' and setters for private variables
   */
   get persistenceDetails(): PersistenceDetailsMemento {
      return this._persistenceDetails;
   }
   get name(): Name {
      return this._name;
   }
   get thumbnailUrl(): UrlMemento {
      return this._thumbnailUrl;
   }
   get administrators(): Array<PersonMemento> {
      return this._administrators;
   }
}

export class Business extends Persistence {
   private _name: Name;
   private _thumbnailUrl: Url;
   private _administrators: Array<Person>;

   // These are used to allow the Db layer to swizzle object references to string Ids on save, and the reverse on load
   // so separate documents/tables can be used in the DB
   private _administratorIds: Array<string>;

   /**
    * Create a Business object
    * @param persistenceDetails - (from Persistence) for the database layer to use and assign
    * @param name - plain text name for the business
    * @param thumbnailUrl - Url to the thumbnail image
    * @param administrators - array of People
    */
   constructor(persistenceDetails: PersistenceDetails,
      name: Name,
      thumbnailUrl: Url,
      administrators: Array<Person>);
   public constructor(memento: BusinessMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {
         var i: number;
         let memento: BusinessMemento = params[0];

         super(new PersistenceDetails(memento.persistenceDetails._key,
            memento.persistenceDetails._schemaVersion,
            memento.persistenceDetails._sequenceNumber));

         this._name = memento.name;
         this._thumbnailUrl = new Url(memento.thumbnailUrl.url, memento.thumbnailUrl.isUrlVerified);

         this._administrators = new Array<Person>(memento.administrators.length);
         for (i = 0; i < memento.administrators.length; i++)
            this._administrators[i] = new Person(memento.administrators[i]);
         
         this._administratorIds = null;

      } else {

         super(params[0]);

         this._name = params[1];
         this._thumbnailUrl = params[2];
         this._administrators = params[3];

         this._administratorIds = null;
      }
   }

   /**
   * set of 'getters' and setters for private variables
   */
   get name(): Name {
      return this._name;
   }
   get thumbnailUrl(): Url {
      return this._thumbnailUrl;
   }
   get administrators(): Array<Person> {
      return this._administrators;
   }
   set name(name: Name) {
      this._name = name;
   }
   set thumbnailUrl(thumbnailUrl: Url) {
      this._thumbnailUrl = thumbnailUrl;
   }
   set administrators(people: Array<Person>) {
      this._administrators = people;
   }


   /**
   * memento() returns a copy of internal state
   */
   memento(): BusinessMemento {
      return new BusinessMemento(this.persistenceDetails,
         this._name,
         this._thumbnailUrl,
         this._administrators);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Business): boolean {

      return (super.equals(rhs) &&
         (this._name.equals (rhs._name)) &&
         this._thumbnailUrl.equals(rhs._thumbnailUrl) &&
         personArraysAreEqual(this._administrators, rhs._administrators) );
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

      for (let i = 0; i < this._administrators.length; i++) {
         if (this._administrators[i].email.equals(email))
            return true;
      }
      return false;
   }
}

export interface IBusinessStore {
   load(id: string): Promise<Business | null>;
   save(business: Business): Promise<Business | null>;
}
