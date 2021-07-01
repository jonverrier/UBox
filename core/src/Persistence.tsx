/*! Copyright TXPCo, 2021 */

export class Persistence {
   private _id: any; 
   private _schemaVersion: number;
   private _objectVersion: number;
   private _sequenceNumber: number;

/**
 * Create a Persistence object - all persistence objects derive from this. 
 * @param _id - for the database to use and assign
 * @param schemaVersion - schema version used - allows upgrades on the fly when loading old format data
 * @param objectVersion - used to manage concurrent updates, latest version wins, and used to optimise write operations - only save when amended
 * @param sequenceNumber - used to allow clients to specify the last object they have when re-synching with server
 */
   constructor(_id: any, schemaVersion: number, objectVersion: number, sequenceNumber: number) {
      this._id = _id;
      this._schemaVersion = schemaVersion;
      this._objectVersion = objectVersion;
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
   get objectVersion(): number {
      return this._objectVersion;
   }
   get sequenceNumber (): number {
      return this._sequenceNumber;
   }


   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
    equals (rhs: Persistence) : boolean {

      return ((this._id === rhs._id) &&
         (this._schemaVersion === rhs._schemaVersion) &&
         (this._objectVersion === rhs._objectVersion) &&
         (this._sequenceNumber === rhs._sequenceNumber));
   }
}

