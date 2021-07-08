/*! Copyright TXPCo, 2020, 2021 */

import { InvalidParameterError } from './error';
import { Persistence } from "./Persistence";
import { Person, personArraysAreEqual } from "./Person";
import { MeasurementTypeOf, weightMeasurementTypeArraysAreEqual, timeMeasurementTypeArraysAreEqual } from "./Observation";
import { EWeightUnits, ETimeUnits } from '../src/Quantity';

export enum ECohortPeriod { Week, TwoWeeks, ThreeWeeks, FourWeeks, Month };

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

export class CohortTimePeriod {
   private _startDate: Date;
   private _period: ECohortPeriod;
   private _numberOfPeriods: number;

   /**
    * Create a CohortTimePeriod object
    * @param startDate - when the cohort starts
    * @param period - what is the time period for measurements (week, twoweeks etc)
    * @param numberOfPeriods - how many periods does the cohort run for
    */
   constructor(startDate: Date, period: ECohortPeriod, numberOfPeriods: number) {
      if (!CohortTimePeriod.isValidTimePeriod(startDate, period, numberOfPeriods)) {
         throw new InvalidParameterError();
      }

      this._startDate = startDate;
      this._period = period;
      this._numberOfPeriods = numberOfPeriods;
   }

   /**
   * set of 'getters' for private variables
   */
   get startDate(): Date {
      return this._startDate;
   }
   get period(): ECohortPeriod {
      return this._period;
   }
   get numberOfPeriods(): number {
      return this._numberOfPeriods;
   }

   /**
 * test for equality - checks all fields are the same. 
 * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
 * @param rhs - the object to compare this one to.  
 */
   equals(rhs: CohortTimePeriod): boolean {

      return (this._startDate === rhs._startDate &&
         this._period === rhs._period &&
         this._numberOfPeriods === rhs._numberOfPeriods);
   }

   /**
    * test for valid time period  
    * @param startDate - when the cohort starts - currently only superficial validation, in case user wants to amend something in the past
    * @param period - what is the time period for measurements (week, twoweeks etc) - dont need to validate this as its an Enum
    * @param numberOfPeriods - how many periods does the cohort run for
    */
   static isValidTimePeriod(startDate: Date, period: ECohortPeriod, numberOfPeriods: number): boolean {

      // number of periods must be > 0
      if (numberOfPeriods <= 0)
         return false;

      // check the proposed start year is >= current year
      let now = new Date();
      let yr = startDate.getFullYear();
      let yrNow = now.getFullYear();
      if (yr < yrNow)
         return false;

      // check the proposed start month is >= current month
      let mth = startDate.getMonth();
      let mthNow = now.getMonth();
      if (mth < mthNow)
         return false;

      return (true);
   }
}

export class Cohort extends Persistence {
   private _name: CohortName;
   private _people: Array<Person>;
   private _weightMeasurements: Array<MeasurementTypeOf<EWeightUnits>>;
   private _timeMeasurements: Array<MeasurementTypeOf<ETimeUnits>>;
   private _isActive: boolean;
   private _period: CohortTimePeriod;

/**
 * Create a Cohort object
 * @param _id - (from Persistence) for the database to use and assign
 * @param schemaVersion - (from Persistence)  schema version used - allows upgrades on the fly when loading old format data
 * @param sequenceNumber - (from Persistence) used to allow clients to specify the last object they have when re-synching with server
 * @param name - plain text name for the cohort
 * @param people - array of People
 * @param period - CohortTimePeriod to specifiy start date, period, number of period
 * @param isActive - true if the cohort is active, false if it is closed. we dont delete cohorts, just close then archive them. *
 * @param weightMeasurements - array of weight measurements
 * @param timeMeasurements - array of time measurements
 */
   constructor(_id: any, schemaVersion: number, sequenceNumber: number,
      name: CohortName, people: Array<Person>,
      period: CohortTimePeriod, isActive: boolean,
      weightMeasurements: Array<MeasurementTypeOf<EWeightUnits>>, timeMeasurements: Array<MeasurementTypeOf<ETimeUnits>>) {

      super(_id, schemaVersion, sequenceNumber);

      this._name = name;
      this._people = people;
      this._period = period;
      this._isActive = isActive;
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
   get period(): CohortTimePeriod {
      return this._period;
   }
   get isActive(): boolean {
      return this._isActive;
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
   set period(period: CohortTimePeriod) {
      this._period = period;
   }
   set isActive(isActive: boolean) {
      this._isActive = isActive;
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
          timeMeasurementTypeArraysAreEqual(this._timeMeasurements, rhs._timeMeasurements) &&
          this._period.equals(rhs._period) &&
          this._isActive === rhs._isActive);
   };
};


export interface ICohortLoader {
   load(): Cohort;
}

export interface ICohortStorer {
   save(cohort: Cohort);
}