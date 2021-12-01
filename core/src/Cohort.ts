/*! Copyright TXPCo, 2020, 2021 */

import { PersistenceDetailsMemento, PersistenceDetails, Persistence } from "./Persistence";
import { Name, NameMemento } from "./Persona";
import { Business, BusinessMemento } from './Business';
import { Persona, PersonaDetails, PersonaMemento, PersonaDetailsMemento } from './Persona'

export enum ECohortPeriod { Week = "One Week", TwoWeeks = "Two Weeks", ThreeWeeks = "Three Weeks", FourWeeks = "Four Weeks", Month = "One Month" }

export enum ECohortType {
    OlympicLifting = "Olympic Lifting", Powerlifting = "Power Lifting", Conditioning = "Conditioning",
    WorkoutForReps = "Workout for Reps", WorkoutForTime = "Workout for Time", WorkoutForWeight = "Workout for Weight"
}

// Design note - classes derived from persona should have the same layout for IO. This means Persona classes can be constructed from wire/Db representations of derived classes.
// This enables Personas to be used for Lists etc & saves duplicate classes/code for each derived type
export class CohortMemento extends PersonaMemento {
   readonly _persistenceDetails: PersistenceDetailsMemento;
   readonly _personaDetails: PersonaDetailsMemento;
   _business: BusinessMemento; // Not readonly as database needs to manually set
   readonly _name: NameMemento;   
   readonly _creationTimestamp: number;
   readonly _cohortType: ECohortType;

   // These are used to allow the Db layer to swizzle object references to string Ids on save, and the reverse on load
   // so separate documents/tables can be used in the DB
   _businessId: string;

   /**
    * Create a CohortMemento object
    * @param persistenceDetails - (from Persistence) for the database layer to use and assign.
    * @param personaDetails - agrregate of information to represent a Persona 
    * @param business - the business that set up the Cohort
    * @param name - plain text name for the cohort
    * @param creationTimestamp - the time at which the cohort was created. This is a timestamp in msecs rounded to nearest 15 minute interval
    * @param cohortType - purpose of the cohort (Oly, Power, Conditioning, ...)
    * Design - all memento classes must depend only on base types, value types, or other Mementos
    */
   constructor(persistenceDetails: PersistenceDetailsMemento,
      personaDetails: PersonaDetailsMemento,
      business: BusinessMemento,
      name: NameMemento, 
      creationTimestamp: number,
      cohortType: ECohortType) {

      super(persistenceDetails, personaDetails);

      var i: number = 0;

      this._persistenceDetails = persistenceDetails;
      this._business = business;
      this._name = name;
      this._creationTimestamp = creationTimestamp;
      this._cohortType = cohortType;
   }
}

export class Cohort extends Persona {
   private _business: Business; 
   private _name: Name;
   private _creationTimestamp: number;

   private _cohortType: ECohortType;

/**
 * Create a Cohort object
 * @param persistenceDetails - details for the DB layer to save/load entities
 * @param personaDetails - plain text user name, profile picture.
 * @param business - the business that set up the Cohort. Note - this may be a dubious but of modelling.
 * A Business creates Cohorts, but we have the Cohort holding the reference. 
 * Should probably be businessId, but that would then mean another query to pull back the most used data for current cohort. 
 * @param name - plain text name for the cohort
 * @param creationTimestamp - the time at which the cohort was created. This is a timestamp in msecs rounded to nearest 15 minute interval
 * @param cohortType - purpose of the cohort (Oly, Power, Conditioning, ...)
 */
   constructor(persistenceDetails: PersistenceDetails,
      personaDetails: PersonaDetails,
      business: Business,
      name: Name,
      creationTimestamp: number,
      cohortType: ECohortType);
   public constructor(memento: CohortMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {
         var i: number;
         let memento: CohortMemento = params[0];

         super(new PersistenceDetails(memento._persistenceDetails), new PersonaDetails(memento._personaDetails));

         this._business = new Business (memento._business);
         this._name = new Name(memento._name._displayName);
         this._creationTimestamp = memento._creationTimestamp;

         this._cohortType = memento._cohortType;

      } else {

         super(params[0], params[1]);

         this._business = params[2];
         this._name = params[3];
         this._creationTimestamp = params[4];
         this._cohortType = params[5];
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
         this.personaDetails.memento(),
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
