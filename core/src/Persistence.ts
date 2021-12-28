/*! Copyright TXPCo, 2021 */
export class PersistenceDetailsMemento {
   readonly _key: string;
   readonly _schemaVersion: number;
   readonly _sequenceNumber: number;

   /**
    * Create a PersistenceDetailsMemento object 
    * @param id - for the database to use and assign
    * @param schemaVersion - schema version used - allows upgrades on the fly when loading old format data
    * @param sequenceNumber - used to allow idempotent queries (all objects in a sequence range)
    */
   constructor(id: string, schemaVersion: number, sequenceNumber: number) {
      this._key = id;
      this._schemaVersion = schemaVersion;
      this._sequenceNumber = sequenceNumber;
   }
}


// This value is used to indicate an object was created in memery. Once it is saved in the DB, the schema value is set from the DB layer.
const _newSchemaIndicator: number = -1;

export class PersistenceDetails {
   private _key: string; // Primary key for the stored object
   private _schemaVersion: number; // Schema version - allows the DB layer to patch objects stored before a schema upgrade. 
   private _sequenceNumber: number; // Object version - later sequenceNumbers override earlier onces in save conflicts. 

   /**
    * Create a PersistenceDetails object - all persistence objects derive from this.
    * @param id - for the database to use and assign
    * @param schemaVersion - schema version used - allows upgrades on the fly when loading old format data
    * @param sequenceNumber - used to allow idempotent queries (all objects in a sequence range)
    * Design - all memento classes must depend only on base types, value types, or other Mementos*
    */
   public constructor(id: string, schemaVersion: number, sequenceNumber: number);
   public constructor(memento: PersistenceDetailsMemento);
   public constructor(...paramArray: any[]) {

      if (paramArray.length === 1) {
         this._key = paramArray[0]._key;
         this._schemaVersion = paramArray[0]._schemaVersion;
         this._sequenceNumber = paramArray[0]._sequenceNumber;
      } else {
         this._key = paramArray[0];
         this._schemaVersion = paramArray[1];
         this._sequenceNumber = paramArray[2];
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get key(): string {
      return this._key;
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
      return new PersistenceDetailsMemento(this._key, this._schemaVersion, this._sequenceNumber);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: PersistenceDetails): boolean {

      return ((this._key === rhs._key) &&
         (this._schemaVersion === rhs._schemaVersion) &&
         (this._sequenceNumber === rhs._sequenceNumber));
   }

   /**
   * hasValidKey - checks the primray key is in non-null state
   * @returns boolean if object has a valid kep
   */
   hasValidKey(): boolean  {
      return this._key !== null;
   }

   /**
   * incrementSequence - call this if an object is amended to force saving in DB layer
   * @returns the new sequenceNumber
   */
   incrementSequence(): number {
      this._sequenceNumber = this._sequenceNumber + 1;
      return this._sequenceNumber;
   }

   static newSchemaIndicator(): number {

      return _newSchemaIndicator;
   }

   // Create persistenceDetails for a newly created object:
   // key is null, schema version is undefined, and sequence is 0 since it is new 
   static newPersistenceDetails(): PersistenceDetails {
      return new PersistenceDetails(null, _newSchemaIndicator, 0); 
   }

   // Create persistenceDetails for a newly created object:
   // key is null, schema version is undefined, and sequence is 0 since it is new 
   static incrementSequenceNo(old: PersistenceDetails): PersistenceDetails {
      return new PersistenceDetails(old.key, old.schemaVersion, old.sequenceNumber + 1);
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
   get persistenceDetails(): PersistenceDetails {
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

export interface ILoaderFor<T> {
   loadOne(id: string): Promise<T | null>;
}

export interface ISaverFor<T> {
   save(entity: T): Promise<T | null>;
}

export interface IMultiLoaderFor<T> {
   loadMany(ids: Array<string>): Promise<Array<T>>;
}

export interface IKeyMultiLoaderFor<T> {
   loadMany(id: string): Promise<Array<T>>;
}

export interface ISessionLoaderFor<T> {
   loadOne(): Promise<T | null>;
}

export interface ISessionMultiLoaderFor<T> {
   loadMany(): Promise<Array<T>>;
}