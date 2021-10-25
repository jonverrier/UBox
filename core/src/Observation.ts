/*! Copyright TXPCo, 2021 */

import { Persistence, PersistenceDetails, PersistenceDetailsMemento } from "./Persistence";
import { TimeUnits, WeightUnits, QuantityMementoOf, QuantityOf } from "./Quantity";
import { RangeMementoOf, RangeOf } from "./Range";

// This enum is used to say which direction is 'better' for a measurement - quantity increasing or quantity decreasing 
// Whenever this is changed, the schema in ObservationDb must be changed to match
export enum EPositiveTrend { Up = "Up", Down = "Down"}

export enum EMeasurementUnitType { Weight = "Weight", Time = "Time", Reps = "Reps" }

// Whenever this is changed, the schema in ObservationDb must be changed to match
export enum EMeasurementType {
   Snatch = "Snatch", Clean = "Clean", Jerk = "Jerk", CleanAndJerk = "Clean & Jerk",
   Row250="Row 250m", Run800="Run 800m"
}

export class MeasurementUnitType {
   static isTimeUnitType(value: string): boolean {
      return (value === EMeasurementUnitType[EMeasurementUnitType.Time]);
   }

   static isWeightUnitType(value: string): boolean {
      return (value === EMeasurementUnitType[EMeasurementUnitType.Weight]);
   }
}
export class MeasurementTypeMementoOf<Unit> {
   readonly _measurementType: EMeasurementType;
   readonly _unitType: EMeasurementUnitType;
   readonly _range: RangeMementoOf<Unit>;
   readonly _trend: EPositiveTrend;

   /**
    * Create a MeasurementTypeMementoFor object - contains the statis elements that characterise a measurement
    * @param measurementType - defines the type of the measurement 
    * @param measurementUnitType - unit typ (weight/time/reps)
    * @param range - acceptable range of values
    * @param trend - used to say which direction is 'better' for a measurement - quantity increasing or quantity decreasing
    * Design - all memento classes must depend only on base types, value types, or other Mementos
    */
   constructor(measurementType: EMeasurementType, unitType: EMeasurementUnitType, range: RangeMementoOf<Unit>, trend: EPositiveTrend) {

      this._measurementType = measurementType;
      this._unitType = unitType;
      this._range = range;
      this._trend = trend;
   }
}

export class MeasurementTypeOf<Unit> {
   private _measurementType: EMeasurementType;
   private _unitType: EMeasurementUnitType;
   private _range: RangeOf<Unit>;
   private _trend: EPositiveTrend;

   /**
    * Create a MeasurementType object - contains the statis elements that characterise a measurement 
    * @param measurementType - defines characteristics of what is being measured
    * @param measurementUnitType - unit typ (weight/time/reps)*
    * @param range - acceptable range of values
    * @param trend - used to say which direction is 'better' for a measurement - quantity increasing or quantity decreasing
    */
   constructor(measurementType: EMeasurementType, unitType: EMeasurementUnitType, range: RangeOf<Unit>, trend: EPositiveTrend);
   public constructor(memento: MeasurementTypeMementoOf<Unit>);
   public constructor(...params: any[]) {

      if (params.length === 1) {

         let memento: MeasurementTypeMementoOf<Unit> = params[0];
         this._measurementType = memento._measurementType;
         this._unitType = memento._unitType;
         this._range = new RangeOf<Unit>(new QuantityOf<Unit>(memento._range._lo._amount, memento._range._lo._unit),
            memento._range._loInclEq,
            new QuantityOf<Unit>(memento._range._hi._amount, memento._range._hi._unit),
            memento._range._hiInclEq);
         this._trend = memento._trend;
      } else {

         this._measurementType = params[0];
         this._unitType = params[1];
         this._range = params[2];
         this._trend = params[3];
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get measurementType(): EMeasurementType {
      return this._measurementType;
   }

   get unitType(): EMeasurementUnitType {
      return this._unitType;
   }

   get range(): RangeOf<Unit> {
      return this._range;
   }

   get trend(): EPositiveTrend {
      return this._trend;
   }

   /**
   * memento() returns a copy of internal state
   */
   memento(): MeasurementTypeMementoOf<Unit> {
      return new MeasurementTypeMementoOf<Unit>(this._measurementType, this._unitType, this._range.memento(), this._trend);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: MeasurementTypeOf<Unit>): boolean {

      return (this._measurementType === rhs._measurementType &&
         this._unitType === rhs._unitType && 
         this._range.equals(rhs._range) &&
         this._trend === rhs._trend);
   }

   /**
   * can be used in IO to check validity of data
   */
   static isAllowedMeasurementUnitType(value: string): boolean {
      var allowedValues: Array<string> = Object.values(EMeasurementUnitType);

      return allowedValues.indexOf(value) !== -1;

   }
}

function measurementTypeArraysAreEqual<Units>(lhs: Array<MeasurementTypeOf<Units>>,
   rhs: Array<MeasurementTypeOf<Units>>): boolean {

   // if we have mis-matched false values, return false
   if (lhs && !rhs || !lhs && rhs)
      return false;

   // compare lengths - can save a lot of time 
   if (lhs.length != rhs.length)
      return false;

   for (var i = 0; i < lhs.length; i++) {
      if (! (lhs[i].equals(rhs[i]))) {
         return false;
      }
   }
   return true;
}

export function weightMeasurementTypeArraysAreEqual(lhs: Array<MeasurementTypeOf<WeightUnits>>,
   rhs: Array<MeasurementTypeOf<WeightUnits>>): boolean {

   return measurementTypeArraysAreEqual(lhs, rhs);
}

export function timeMeasurementTypeArraysAreEqual(lhs: Array<MeasurementTypeOf<TimeUnits>>,
   rhs: Array<MeasurementTypeOf<TimeUnits>>): boolean {

   return  measurementTypeArraysAreEqual(lhs, rhs);;
}

export class MeasurementMementoOf<MeasuredUnit> {
   readonly _persistenceDetails: PersistenceDetailsMemento;
   readonly _quantity: QuantityMementoOf<MeasuredUnit>;
   readonly _repeats: number;
   readonly _cohortPeriod: number;
   readonly _measurementType: MeasurementTypeMementoOf<MeasuredUnit>;
   readonly _subjectKey: string;

   /**
    * Create a MeasurementMementoOf object - a quantity, with a range of validity, and a marker of the positive trend (is it good if quantity goes up, or down)
    * @param persistenceDetails - (from Persistence) for the database layer to use and assign
    * @param quantity - the value of the measurement (amount and units)
    * @param repeats - the number of reps (for weight), number of distance units (for time measurements)
    * @param cohortPeriod - the period in which the measurement was taken
    * @param measurementType - reference to the class that defines the type of measurement
    * @param subjectKey - reference to the entity to which the measurement applies  - usually a Person
    * Design - all memento classes must depend only on base types, value types, or other Mementos*
    */
   constructor(persistenceDetails: PersistenceDetailsMemento,
      quantity: QuantityMementoOf<MeasuredUnit>, repeats: number, cohortPeriod: number, measurementType: MeasurementTypeMementoOf<MeasuredUnit>, subjectKey: string)
   {
      this._persistenceDetails = persistenceDetails;
      this._quantity = quantity;
      this._repeats = repeats;
      this._cohortPeriod = cohortPeriod;
      this._measurementType = measurementType;
      this._subjectKey = subjectKey;
   }
}

export class MeasurementOf<MeasuredUnit> extends Persistence {
   private _quantity: QuantityOf<MeasuredUnit>;
   private _repeats: number;
   private _cohortPeriod: number;
   private _measurementType: MeasurementTypeOf<MeasuredUnit>;
   private _subjectKey: string; 

/**
 * Create a Measurement object - a quantity, with a range of validity, and a marker of the positive trend (is it good if quantity goes up, or down)
 * @param persistenceDetails - (from Persistence) for the database layer to use and assign
 * @param quantity - the value of the measurement (amount and units)
 * @param repeats - the number of reps (for weight), number of distance units (for time measurements)
 * @param cohortPeriod - the period in which the measurement was taken
 * @param measurementType - reference to the class that defines the type of measurement
 * @param subjectKey - reference to the entity to which the measurement applies  - usually a Person
 */
   constructor(persistenceDetails: PersistenceDetails,
      quantity: QuantityOf<MeasuredUnit>, repeats: number, cohortPeriod: number, measurementType: MeasurementTypeOf<MeasuredUnit>, subjectKey: string)
   public constructor(memento: MeasurementMementoOf<MeasuredUnit>);
   public constructor(...params: any[]) {

      if (params.length === 1) {

         let memento: MeasurementMementoOf<MeasuredUnit> = params[0];

         super(new PersistenceDetails(memento._persistenceDetails._key,
            memento._persistenceDetails._schemaVersion,
            memento._persistenceDetails._sequenceNumber));

         this._quantity = new QuantityOf<MeasuredUnit>(memento._quantity._amount,
            memento._quantity._unit);
         this._repeats = memento._repeats;
         this._cohortPeriod = memento._cohortPeriod;
         this._measurementType = new MeasurementTypeOf<MeasuredUnit>(memento._measurementType);
         this._subjectKey = memento._subjectKey;

      } else {

         super(params[0]);

         if (!params[4].range.includes(params[1])) {
            throw RangeError();
         }
         this._quantity = params[1];
         this._repeats = params[2];
         this._cohortPeriod = params[3];
         this._measurementType = params[4];
         this._subjectKey = params[5];
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get quantity(): QuantityOf<MeasuredUnit> {
      return this._quantity;
   }
   get repeats(): number {
      return this._repeats;
   }
   get cohortPeriod(): number {
      return this._cohortPeriod;
   }
   get measurementType(): MeasurementTypeOf<MeasuredUnit> {
      return this._measurementType;
   }
   get subjectKey(): string {
      return this._subjectKey;
   }

   /**
   * memento() returns a copy of internal state
   */
   memento(): MeasurementMementoOf<MeasuredUnit>  {
      return new MeasurementMementoOf(this.persistenceDetails.memento(),
         this._quantity.memento(),
         this._repeats, this._cohortPeriod,
         this._measurementType.memento(), this._subjectKey);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: MeasurementOf<MeasuredUnit> ) : boolean {

      return (super.equals (rhs) && 
         this._quantity.equals(rhs._quantity) &&
         this._repeats === rhs._repeats &&
         this._cohortPeriod === rhs._cohortPeriod &&
         this._measurementType.equals(rhs.measurementType) &&
         this._subjectKey === rhs._subjectKey);
   }
}

export interface IMeasurementStore {
   loadOne (id: string): Promise<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits> | null>;
   loadMany (ids: Array<string>): Promise<Array<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits>>>;
   save (measurement: MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits>): Promise<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits> | null>;
}