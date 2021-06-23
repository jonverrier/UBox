/*! Copyright TXPCo, 2021 */

import { QuantityOf } from "./Quantity";
import { RangeOf } from "./Range";
import { Persistence } from "./Persistence";

// This enum is used to say which direction is 'better' for a measurement - quantity increasing or quantity decreasing 
export enum EPositiveTrend { Up, Down }

export enum EMeasurementType {
   Snatch, Clean, Jerk, CleanAndJerk,
   RowDistance, RowCalories,
   SkiDistance, SkiCalories,
   RunDistance
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

export class MeasurementOf<Unit> extends Persistence {
   private _quantity: QuantityOf<Unit>;
   private _cohortPeriod: number;
   private _measurementType: MeasurementTypeOf<Unit>;

/**
 * Create a Measurement object - a quantity, with a range of validity, and a marker of the positive trend (is it good if quantity goes up, or down)
 * @param _id - (from Persistence) for the database to use and assign
 * @param schemaVersion - (from Persistence)  schema version used - allows upgrades on the fly when loading old format data
 * @param objectVersion - (from Persistence)  used to manage concurrent updates, latest version wins, and used to optimise write operations - only save when amended
 * @param quantity - the value of the measurement (amount and units)
 * @param cohortPeriod - the period in which the measurement was taken
 * @param measurementType - reference to the class that defines the type of measurement
 */
   constructor(_id: any, schemaVersion: number, objectVersion: number,
      quantity: QuantityOf<Unit>, cohortPeriod: number, measurementType: MeasurementTypeOf<Unit>) {

      super(_id, schemaVersion, objectVersion);

      if (!measurementType.range.includes(quantity)) {
         console.log(measurementType);
         console.log(quantity);
         throw RangeError();
      }
      this._quantity = quantity;
      this._cohortPeriod = cohortPeriod;
      this._measurementType = measurementType;
   }

   /**
   * set of 'getters' for private variables
   */

   get quantity(): QuantityOf<Unit> {
      return this._quantity;
   }

   get cohortPeriod(): number {
      return this._cohortPeriod;
   }

   get measurementType(): MeasurementTypeOf<Unit> {
      return this._measurementType;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: MeasurementOf<Unit> ) : boolean {

      return (super.equals (rhs) && 
         this._quantity.equals(rhs._quantity) &&
         this._cohortPeriod === rhs._cohortPeriod &&
         this._measurementType.equals(rhs.measurementType));
   }
}

