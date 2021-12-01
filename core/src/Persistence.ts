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

export class PersistenceDetails {
   private _key: string;
   private _schemaVersion: number;
   private _sequenceNumber: number;

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