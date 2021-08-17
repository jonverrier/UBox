/*! Copyright TXPCo, 2021 */

import { ETimeUnits, EWeightUnits, ERepUnits, QuantityOf, QuantityMementoOf } from "./Quantity";
import { RangeOf, RangeMementoOf } from "./Range";
import { PersistenceDetails, Persistence, PersistenceDetailsMemento } from "./Persistence";

// This enum is used to say which direction is 'better' for a measurement - quantity increasing or quantity decreasing 
export enum EPositiveTrend { Up = "Up", Down = "Down"}

export enum EMeasurementType {
   Snatch = "Snatch", Clean = "Clean", Jerk = "Jerk", CleanAndJerk = "CleanAndJerk",
   Row="Row", Run="Run"
}

export class MeasurementTypeMementoOf<Unit> {
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
   get measurementType(): EMeasurementType {
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
   private _measurementType: EMeasurementType;
   private _range: RangeOf<Unit>;
   private _trend: EPositiveTrend;

   /**
    * Create a MeasurementType object - contains the statis elements that characterise a measurement 
    * @param measurementType - enum to say what is being measured
    * @param range - acceptable range of values
    * @param trend - used to say which direction is 'better' for a measurement - quantity increasing or quantity decreasing
    */
   constructor(measurementType: EMeasurementType, range: RangeOf<Unit>, trend: EPositiveTrend);
   public constructor(memento: MeasurementTypeMementoOf<Unit>);
   public constructor(...paramArray: any[]) {

      if (paramArray.length === 1) {
         this._measurementType = paramArray[0]._measurementType;
         this._range = new RangeOf<Unit>(new QuantityOf<Unit>(paramArray[0]._range._lo._amount, paramArray[0]._range._lo._unit),
            paramArray[0]._range._loInclEq,
            new QuantityOf<Unit>(paramArray[0]._range._hi._amount, paramArray[0]._range._hi._unit),
            paramArray[0]._range._hiInclEq);
         this._trend = paramArray[0]._trend;
      } else {

         this._measurementType = paramArray[0];
         this._range = paramArray[1];
         this._trend = paramArray[2];
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get measurementType(): EMeasurementType {
      return this._measurementType;
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
      return new MeasurementTypeMementoOf<Unit>(this._measurementType, this._range.memento(), this._trend);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: MeasurementTypeOf<Unit>): boolean {

      return (this._measurementType === rhs._measurementType && 
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

export class MeasurementMementoOf<MeasuredUnit> {
   _persistenceDetails: PersistenceDetailsMemento;
   _quantity: QuantityMementoOf<MeasuredUnit>;
   _repeats: QuantityMementoOf<ERepUnits>;
   _cohortPeriod: number;
   _measurementType: MeasurementTypeMementoOf<MeasuredUnit>;
   _subjectExternalId: string;

   /**
    * Create a MeasurementMementoOf object - a quantity, with a range of validity, and a marker of the positive trend (is it good if quantity goes up, or down)
    * @param persistenceDetails - (from Persistence) for the database layer to use and assign
    * @param quantity - the value of the measurement (amount and units)
    * @param repeats - the number of reps (for weight), number of distance units (for time measurements)
    * @param cohortPeriod - the period in which the measurement was taken
    * @param measurementType - reference to the class that defines the type of measurement
    * @param subjectExternalId - reference to the entity to which the measurement applies  - usually a Person
    */
   constructor(persistenceDetails: PersistenceDetails,
      quantity: QuantityOf<MeasuredUnit>, repeats: QuantityOf<ERepUnits>, cohortPeriod: number, measurementType: MeasurementTypeOf<MeasuredUnit>, subjectExternalId: string)
   {


      this._persistenceDetails = persistenceDetails.memento();
      this._quantity = quantity.memento();
      this._repeats = repeats.memento();
      this._cohortPeriod = cohortPeriod;
      this._measurementType = measurementType.memento();
      this._subjectExternalId = subjectExternalId;
   }

   /**
   * set of 'getters' for private variables
   */
   get persistenceDetails(): PersistenceDetailsMemento {
      return this._persistenceDetails;
   }
   get quantity(): QuantityMementoOf<MeasuredUnit> {
      return this._quantity;
   }
   get repeats(): QuantityMementoOf<ERepUnits> {
      return this._repeats;
   }
   get cohortPeriod(): number {
      return this._cohortPeriod;
   }
   get measurementType(): MeasurementTypeMementoOf<MeasuredUnit> {
      return this._measurementType;
   }
   get subjectExternalId(): string {
      return this._subjectExternalId;
   }
}

export class MeasurementOf<MeasuredUnit> extends Persistence {
   private _quantity: QuantityOf<MeasuredUnit>;
   private _repeats: QuantityOf<ERepUnits>;
   private _cohortPeriod: number;
   private _measurementType: MeasurementTypeOf<MeasuredUnit>;
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
      quantity: QuantityOf<MeasuredUnit>, repeats: QuantityOf<ERepUnits>, cohortPeriod: number, measurementType: MeasurementTypeOf<MeasuredUnit>, subjectExternalId: string)
   public constructor(memento: MeasurementMementoOf<MeasuredUnit>);
   public constructor(...paramArray: any[]) {

      if (paramArray.length === 1) {

         super(new PersistenceDetails(paramArray[0]._persistenceDetails._id,
            paramArray[0]._persistenceDetails._schemaVersion,
            paramArray[0]._persistenceDetails._sequenceNumber));

         this._quantity = new QuantityOf<MeasuredUnit>(paramArray[0]._quantity._amount,
            paramArray[0]._quantity._unit);
         this._repeats = new QuantityOf<ERepUnits>(paramArray[0]._repeats._amount,
            paramArray[0]._repeats._unit);
         this._cohortPeriod = paramArray[0]._cohortPeriod;
         this._measurementType = new MeasurementTypeOf<MeasuredUnit>(paramArray[0]._measurementType._measurementType,
            paramArray[0]._measurementType._range,
            paramArray[0]._measurementType._trend);
         this._subjectExternalId = paramArray[0]._subjectExternalId;

      } else {

         super(paramArray[0]);

         if (!paramArray[4].range.includes(paramArray[1])) {
            throw RangeError();
         }
         this._quantity = paramArray[1];
         this._repeats = paramArray[2];
         this._cohortPeriod = paramArray[3];
         this._measurementType = paramArray[4];
         this._subjectExternalId = paramArray[5];
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get quantity(): QuantityOf<MeasuredUnit> {
      return this._quantity;
   }
   get repeats(): QuantityOf<ERepUnits> {
      return this._repeats;
   }
   get cohortPeriod(): number {
      return this._cohortPeriod;
   }
   get measurementType(): MeasurementTypeOf<MeasuredUnit> {
      return this._measurementType;
   }
   get subjectExternalId(): string {
      return this._subjectExternalId;
   }

   /**
   * memento() returns a copy of internal state
   */
   memento(): MeasurementMementoOf<MeasuredUnit>  {
      return new MeasurementMementoOf(this.persistenceDetails, this._quantity, this._repeats, this._cohortPeriod, this._measurementType, this._subjectExternalId);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: MeasurementOf<MeasuredUnit> ) : boolean {

      return (super.equals (rhs) && 
         this._quantity.equals(rhs._quantity) &&
         this._repeats.equals(rhs._repeats) &&
         this._cohortPeriod === rhs._cohortPeriod &&
         this._measurementType.equals(rhs.measurementType) &&
         this._subjectExternalId === rhs._subjectExternalId);
   }
}

export interface IWeightMeasurementStore {
   load(id: any): Promise<MeasurementOf<EWeightUnits> | null>;
   save(measurement: MeasurementOf<EWeightUnits>): Promise<MeasurementOf<EWeightUnits> | null>;
}