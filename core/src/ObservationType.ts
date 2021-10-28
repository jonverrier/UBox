/*! Copyright TXPCo, 2021 */

import { EBaseUnitDimension, BaseUnit } from './Unit';
import { QuantityMemento, Quantity } from "./Quantity";
import { RangeMemento, Range } from "./Range";
import { Persistence, PersistenceDetails, PersistenceDetailsMemento } from "./Persistence";

// This enum is used to say which direction is 'better' for a measurement - quantity increasing or quantity decreasing 
// Whenever this is changed, the schema in ObservationDb must be changed to match
export enum EPositiveTrend { Up = "Up", Down = "Down"}

// Whenever this is changed, the schema in ObservationDb must be changed to match
export enum EMeasurementType {
   Snatch = "Snatch", Clean = "Clean", Jerk = "Jerk", CleanAndJerk = "Clean & Jerk",
   Row250="Row 250m", Run800="Run 800m"
}

export class MeasurementTypeMemento {
   readonly _measurementType: EMeasurementType;
   readonly _unitType: EBaseUnitDimension;
   readonly _range: RangeMemento;
   readonly _trend: EPositiveTrend;

   /**
    * Create a MeasurementTypeMementoFor object - contains the statis elements that characterise a measurement
    * @param measurementType - defines the type of the measurement 
    * @param measurementUnitType - unit typ (weight/time/reps)
    * @param range - acceptable range of values
    * @param trend - used to say which direction is 'better' for a measurement - quantity increasing or quantity decreasing
    * Design - all memento classes must depend only on base types, value types, or other Mementos
    */
   constructor(measurementType: EMeasurementType,
      unitType: EBaseUnitDimension,
      range: RangeMemento,
      trend: EPositiveTrend) {

      this._measurementType = measurementType;
      this._unitType = unitType;
      this._range = range;
      this._trend = trend;
   }
}

export class MeasurementType {
   private _measurementType: EMeasurementType;
   private _unitType: EBaseUnitDimension;
   private _range: Range;
   private _trend: EPositiveTrend;

   /**
    * Create a MeasurementType object - contains the statis elements that characterise a measurement 
    * @param measurementType - defines characteristics of what is being measured
    * @param measurementUnitType - unit typ (weight/time/reps)*
    * @param range - acceptable range of values
    * @param trend - used to say which direction is 'better' for a measurement - quantity increasing or quantity decreasing
    */
   constructor(measurementType: EMeasurementType,
      unitType: EBaseUnitDimension,
      range: Range,
      trend: EPositiveTrend);
   public constructor(memento: MeasurementTypeMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {

         let memento: MeasurementTypeMemento = params[0];
         this._measurementType = memento._measurementType;
         this._unitType = memento._unitType;
         this._range = new Range(new Quantity(memento._range._lo),
            memento._range._loInclEq,
            new Quantity(memento._range._hi),
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

   get unitType(): EBaseUnitDimension {
      return this._unitType;
   }

   get range(): Range {
      return this._range;
   }

   get trend(): EPositiveTrend {
      return this._trend;
   }

   /**
   * memento() returns a copy of internal state
   */
   memento(): MeasurementTypeMemento {
      return new MeasurementTypeMemento(this._measurementType, this._unitType, this._range.memento(), this._trend);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: MeasurementType): boolean {

      return (this._measurementType === rhs._measurementType &&
         this._unitType === rhs._unitType && 
         this._range.equals(rhs._range) &&
         this._trend === rhs._trend);
   }

   /**
   * can be used in IO to check validity of data
   */
   static isAllowedMeasurementUnitType(value: string): boolean {
      var allowedValues: Array<string> = Object.values(EBaseUnitDimension);

      return allowedValues.indexOf(value) !== -1;

   }
}

export function measurementTypeArraysAreEqual<Units>(lhs: Array<MeasurementType>,
   rhs: Array<MeasurementType>): boolean {

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
