/*! Copyright TXPCo, 2020, 2021 */

import { InvalidParameterError } from './error';
import { Persistence } from "./Persistence";
import { Person, personArraysAreEqual } from "./Person";
import { MeasurementTypeOf, weightMeasurementTypeArraysAreEqual, timeMeasurementTypeArraysAreEqual } from "./Observation";
import { EWeightUnits, ETimeUnits } from '../src/Quantity';

export class CohortName {
   private _name: string;

   /**
    * Create a CohortName object
    * @param name - name for the Cohort
    */
   constructor(name: string) {
      if (!CohortName.isValidName (name)) {
         throw new InvalidParameterError();
      }

      this._name = name;
   }

   /**
   * set of 'getters' for private variables
   */
   get name(): string {
      return this._name;
   }


   /**
 * test for equality - checks all fields are the same. 
 * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
 * @param rhs - the object to compare this one to.  
 */
   equals(rhs: CohortName): boolean {

      return (this._name === rhs._name);
   }

   /**
    * test for valid name 
    * @param name - the string to test
    */
   static isValidName(name: string): boolean {
      if (name === null || name.length === 0)
         return false;

      return (true);
   }
}

export class Cohort extends Persistence {
   private _name: CohortName;
   private _people: Array<Person>;
   private _weightMeasurements: Array<MeasurementTypeOf<EWeightUnits>>;
   private _timeMeasurements: Array<MeasurementTypeOf<ETimeUnits>>;

/**
 * Create a Cohort object
 * @param _id - (from Persistence) for the database to use and assign
 * @param schemaVersion - (from Persistence)  schema version used - allows upgrades on the fly when loading old format data
 * @param sequenceNumber - (from Persistence) used to allow clients to specify the last object they have when re-synching with server
 * @param name - plain text name for the cohort
 * @param people - array of People
 * @param weightMeasurements - array of weight measurements
 * @param timeMeasurements - array of time measurements
 */
   constructor(_id: any, schemaVersion: number, sequenceNumber: number,
      name: CohortName, people: Array<Person>,
      weightMeasurements: Array<MeasurementTypeOf<EWeightUnits>>, timeMeasurements: Array<MeasurementTypeOf<ETimeUnits>>) {

      super(_id, schemaVersion, sequenceNumber);

      this._name = name;
      this._people = people;
      this._weightMeasurements = weightMeasurements;
      this._timeMeasurements = timeMeasurements;
   }

   /**
   * set of 'getters' and setters for private variables
   */
   get name(): CohortName {
      return this._name;
   }
   get people(): Array<Person> {
      return this._people;
   }
   get weightMeasurements(): Array<MeasurementTypeOf<EWeightUnits>> {
      return this._weightMeasurements;
   }
   get timeMeasurements(): Array<MeasurementTypeOf<ETimeUnits>> {
      return this._timeMeasurements;
   }
   set name(name: CohortName) {
      this._name = name;
   }
   set people(people: Array<Person>) {
      this._people = people;
   }
   set weightMeasurements(weightMeasurements: Array<MeasurementTypeOf<EWeightUnits>>)  {
      this._weightMeasurements = weightMeasurements;
   }
   set timeMeasurements(timeMeasurements: Array<MeasurementTypeOf<ETimeUnits>>) {
      this._timeMeasurements = timeMeasurements;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Cohort) : boolean {

       return ((super.equals(rhs)) &&
         (this._name.equals (rhs._name)) &&
          personArraysAreEqual (this.people, rhs.people) &&
          weightMeasurementTypeArraysAreEqual (this._weightMeasurements, rhs._weightMeasurements) &&
          timeMeasurementTypeArraysAreEqual (this._timeMeasurements, rhs._timeMeasurements));
   };
};


export interface ICohortLoader {
   load(): Cohort;
}

export interface ICohortStorer {
   save(cohort: Cohort);
}