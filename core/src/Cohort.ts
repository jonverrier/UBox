/*! Copyright TXPCo, 2020, 2021 */

import { PersistenceDetailsMemento, PersistenceDetails, Persistence } from "./Persistence";
import { Name, NameMemento } from "./Persona";
import { Business, BusinessMemento } from './Business';

export enum ECohortPeriod { Week = "One Week", TwoWeeks = "Two Weeks", ThreeWeeks = "Three Weeks", FourWeeks = "Four Weeks", Month = "One Month" }

export enum ECohortType {
    OlympicLifting = "Olympic Lifting", Powerlifting = "Power Lifting", Conditioning = "Conditioning",
    WorkoutForReps = "Workout for Reps", WorkoutForTime = "Workout for Time", WorkoutForWeight = "Workout for Weight"
}

export class CohortMemento {
   readonly _persistenceDetails: PersistenceDetailsMemento;
   _business: BusinessMemento; // Not readonly as database needs to manually set
   readonly _name: NameMemento;   
   readonly _creationTimestamp: number;
   readonly _cohortType: ECohortType;

   // These are used to allow the Db layer to swizzle object references to string Ids on save, and the reverse on load
   // so separate documents/tables can be used in the DB
   _businessId: string;

   /**
    * Create a CohortMemento object
    * @param persistenceDetails - (from Persistence) for the database layer to use and assign
    * @param business - the business that set up the Cohort
    * @param name - plain text name for the cohort
    * @param creationTimestamp - the time at which the cohort was created. This is a timestamp in msecs rounded to nearest 15 minute interval
    * @param cohortType - purpose of the cohort (Oly, Power, Conditioning, ...)
    * Design - all memento classes must depend only on base types, value types, or other Mementos
    */
   constructor(persistenceDetails: PersistenceDetailsMemento,
      business: BusinessMemento,
      name: NameMemento, 
      creationTimestamp: number,
      cohortType: ECohortType) {

      var i: number = 0;

      this._persistenceDetails = persistenceDetails;
      this._business = business;
      this._name = name;
      this._creationTimestamp = creationTimestamp;
      this._cohortType = cohortType;
   }
}

export class Cohort extends Persistence {
   private _business: Business; 
   private _name: Name;
   private _creationTimestamp: number;

   private _cohortType: ECohortType;

/**
 * Create a Cohort object
 * @param persistenceDetails - (from Persistence) for the database layer to use and assign
 * @param business - the business that set up the Cohort. Note - this may be a dubious but of modelling.
 * A Business creates Cohorts, but we have the Cohort holding the reference. 
 * Should probably be businessId, but that would then mean another query to pull back the most used data for current cohort. 
 * @param name - plain text name for the cohort
 * @param creationTimestamp - the time at which the cohort was created. This is a timestamp in msecs rounded to nearest 15 minute interval
 * @param cohortType - purpose of the cohort (Oly, Power, Conditioning, ...)
 */
   constructor(persistenceDetails: PersistenceDetails,
      business: Business,
      name: Name,
      creationTimestamp: number,
      cohortType: ECohortType);
   public constructor(memento: CohortMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {
         var i: number;
         let memento: CohortMemento = params[0];

         super(new PersistenceDetails(memento._persistenceDetails._key,
            memento._persistenceDetails._schemaVersion,
            memento._persistenceDetails._sequenceNumber));

         this._business = new Business (memento._business);
         this._name = new Name(memento._name._displayName);
         this._creationTimestamp = memento._creationTimestamp;

         this._cohortType = memento._cohortType;

      } else {

         super(params[0]);

         this._business = params[1];
         this._name = params[2];
         this._creationTimestamp = params[3];
         this._cohortType = params[4];
      }
   }

   /**
   * set of 'getters' and setters for private variables
   */
   get business(): Business {
      return this._business;
   }
   get name(): Name {
      return this._name;
   }
   get creationTimestamp(): number {
      return this._creationTimestamp;
   }
   get cohortType(): ECohortType {
      return this._cohortType;
   }

   set business(business: Business) {
      this._business = business;
   }
   set name(name: Name) {
      this._name = name;
   }
   set creationTimestamp(creationTimestamp: number) {
      this._creationTimestamp = creationTimestamp;
   }
   set cohortType(cohortType: ECohortType)  {
      this._cohortType = cohortType;
   }


   /**
   * memento() returns a copy of internal state
   */
   memento(): CohortMemento {

      return new CohortMemento(this.persistenceDetails.memento(),
         this._business.memento(),
         this._name.memento(),
         this._creationTimestamp,
         this._cohortType);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Cohort): boolean {

      return (super.equals(rhs) &&
         this._business.equals (rhs._business) &&
         this._name.equals(rhs._name) &&
         this._cohortType === rhs._cohortType &&
         this._creationTimestamp === rhs._creationTimestamp);
   }
}

export interface ICohortStore {
   loadOne(id: string): Promise<Cohort | null>;
   save(cohort: Cohort): Promise<Cohort | null>;
}
