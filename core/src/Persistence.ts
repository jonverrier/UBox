/*! Copyright TXPCo, 2021 */
export class PersistenceDetailsMemento {
   _id: any;
   _schemaVersion: number;
   _sequenceNumber: number;

   /**
    * Create a PersistenceDetailsMemento object 
    * @param id - for the database to use and assign
    * @param schemaVersion - schema version used - allows upgrades on the fly when loading old format data
    * @param sequenceNumber - used to allow idempotent queries (all objects in a sequence range)
    */
   constructor(id: any, schemaVersion: number, sequenceNumber: number) {
      this._id = id;
      this._schemaVersion = schemaVersion;
      this._sequenceNumber = sequenceNumber;
   }

   /**
   * set of 'getters' for private variables
   */
   get id(): any {
      return this._id;
   }
   get schemaVersion(): number {
      return this._schemaVersion;
   }
   get sequenceNumber(): number {
      return this._sequenceNumber;
   }
}

export class PersistenceDetails {
   private _id: any;
   private _schemaVersion: number;
   private _sequenceNumber: number;

   /**
    * Create a PersistenceDetails object - all persistence objects derive from this.
    * @param id - for the database to use and assign
    * @param schemaVersion - schema version used - allows upgrades on the fly when loading old format data
    * @param sequenceNumber - used to allow idempotent queries (all objects in a sequence range)
    */
   constructor(id: any, schemaVersion: number, sequenceNumber: number) {
      this._id = id;
      this._schemaVersion = schemaVersion;
      this._sequenceNumber = sequenceNumber;
   }

   /**
   * set of 'getters' for private variables
   */
   get id(): any {
      return this._id;
   }
   get schemaVersion(): number {
      return this._schemaVersion;
   }
   get sequenceNumber(): number {
      return this._sequenceNumber;
   }

   /**
   * memento() returns a copy of internal state
   */
   memento(): PersistenceDetailsMemento {
      return new PersistenceDetailsMemento(this._id, this._schemaVersion, this._sequenceNumber);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: PersistenceDetails): boolean {

      return ((this._id === rhs._id) &&
         (this._schemaVersion === rhs._schemaVersion) &&
         (this._sequenceNumber === rhs._sequenceNumber));
   }
}

export class Persistence {
   private _persistenceDetails: PersistenceDetails;

/**
 * Create a Persistence object - all persistence objects derive from this. 
 * @param persistenceDetails - database ID, schema ID, sequence number
 */
   constructor(persistenceDetails: PersistenceDetails) {
      this._persistenceDetails = persistenceDetails;
   }

   /**
   * set of 'getters' for private variables
   */
   get persistenceDetails(): any {
      return this._persistenceDetails;
   }


   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
    equals (rhs: Persistence) : boolean {

       return (this._persistenceDetails.equals (rhs._persistenceDetails));
   }
}

