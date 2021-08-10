/*! Copyright TXPCo, 2021 */

import { ETimeUnits, EWeightUnits, QuantityOf } from "./Quantity";
import { RangeOf, RangeMementoOf } from "./Range";
import { PersistenceDetails, Persistence } from "./Persistence";

// This enum is used to say which direction is 'better' for a measurement - quantity increasing or quantity decreasing 
export enum EPositiveTrend { Up, Down }

export enum EMeasurementType {
   Snatch, Clean, Jerk, CleanAndJerk,
   Row, Run
}

export class MeasurementTypeMementoFor<Unit> {
   _measurementType: EMeasurementType;
   _range: RangeMementoOf<Unit>;
   _trend: EPositiveTrend;

   /**
    * Create a MeasurementTypeMementoFor object - contains the statis elements that characterise a measurement
    * @param measurementType - enum to say what is being measured
    * @param range - acceptable range of values
    * @param trend - used to say which direction is 'better' for a measurement - quantity increasing or quantity decreasing
    */
   constructor(measurementType: EMeasurementType, range: RangeMementoOf<Unit>, trend: EPositiveTrend) {

      this._measurementType = measurementType;
      this._range = range;
      this._trend = trend;
   }

   /**
   * set of 'getters' for private variables
   */
   get measurmentType(): EMeasurementType {
      return this._measurementType;
   }

   get range(): RangeMementoOf<Unit> {
      return this._range;
   }

   get trend(): EPositiveTrend {
      return this._trend;
   }
}


export class MeasurementTypeOf<Unit> {
   private _measurmentType: EMeasurementType;
   private _range: RangeOf<Unit>;
   private _trend: EPositiveTrend;

   /**
    * Create a MeasurementType object - contains the statis elements that characterise a measurement 
    * @param measurementType - enum to say what is being measured
    * @param range - acceptable range of values
    * @param trend - used to say which direction is 'better' for a measurement - quantity increasing or quantity decreasing
    */
   constructor(measurementType: EMeasurementType, range: RangeOf<Unit>, trend: EPositiveTrend) {

      this._measurmentType = measurementType;
      this._range = range;
      this._trend = trend;
   }

   /**
   * set of 'getters' for private variables
   */
   get measurmentType(): EMeasurementType {
      return this._measurmentType;
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
   memento(): MeasurementTypeMementoFor<Unit> {
      return new MeasurementTypeMementoFor<Unit>(this._measurmentType, this._range.memento(), this._trend);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: MeasurementTypeOf<Unit>): boolean {

      return (this._measurmentType === rhs._measurmentType && 
         this._range.equals(rhs._range) &&
         this._trend === rhs._trend);
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

export function weightMeasurementTypeArraysAreEqual(lhs: Array<MeasurementTypeOf<EWeightUnits>>,
   rhs: Array<MeasurementTypeOf<EWeightUnits>>): boolean {

   return measurementTypeArraysAreEqual(lhs, rhs);
}

export function timeMeasurementTypeArraysAreEqual(lhs: Array<MeasurementTypeOf<ETimeUnits>>,
   rhs: Array<MeasurementTypeOf<ETimeUnits>>): boolean {

   return  measurementTypeArraysAreEqual(lhs, rhs);;
}

export class MeasurementOf<measuredUnit, repeatUnit> extends Persistence {
   private _quantity: QuantityOf<measuredUnit>;
   private _repeats: QuantityOf<repeatUnit>;
   private _cohortPeriod: number;
   private _measurementType: MeasurementTypeOf<measuredUnit>;
   private _subjectExternalId: string; 

/**
 * Create a Measurement object - a quantity, with a range of validity, and a marker of the positive trend (is it good if quantity goes up, or down)
 * @param persistenceDetails - (from Persistence) for the database layer to use and assign
 * @param quantity - the value of the measurement (amount and units)
 * @param repeats - the number of reps (for weight), number of distance units (for time measurements)
 * @param cohortPeriod - the period in which the measurement was taken
 * @param measurementType - reference to the class that defines the type of measurement
 * @param subjectExternalId - reference to the entity to which the measurement applies  - usually a Person
 */
   constructor(persistenceDetails: PersistenceDetails,
      quantity: QuantityOf<measuredUnit>, repeats: QuantityOf<repeatUnit>, cohortPeriod: number, measurementType: MeasurementTypeOf<measuredUnit>, subjectExternalId: string) {

      super(persistenceDetails);

      if (!measurementType.range.includes(quantity)) {
         throw RangeError();
      }
      this._quantity = quantity;
      this._repeats = repeats;
      this._cohortPeriod = cohortPeriod;
      this._measurementType = measurementType;
      this._subjectExternalId = subjectExternalId;
   }

   /**
   * set of 'getters' for private variables
   */
   get quantity(): QuantityOf<measuredUnit> {
      return this._quantity;
   }
   get repeats(): QuantityOf<repeatUnit> {
      return this._repeats;
   }
   get cohortPeriod(): number {
      return this._cohortPeriod;
   }
   get measurementType(): MeasurementTypeOf<measuredUnit> {
      return this._measurementType;
   }
   get subjectExternalId(): string {
      return this._subjectExternalId;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: MeasurementOf<measuredUnit, repeatUnit> ) : boolean {

      return (super.equals (rhs) && 
         this._quantity.equals(rhs._quantity) &&
         this._repeats === rhs._repeats &&
         this._cohortPeriod === rhs._cohortPeriod &&
         this._measurementType.equals(rhs.measurementType) &&
         this._subjectExternalId === rhs._subjectExternalId);
   }
}

export interface IMeasurementLoaderFor<measuredUnit, repeatUnit> {
   load(): MeasurementOf<measuredUnit, repeatUnit>;
}

export interface IMeasurementStorerFor<measuredUnit, repeatUnit> {
   save(measurement: MeasurementOf<measuredUnit, repeatUnit>);
}