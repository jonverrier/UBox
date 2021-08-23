/*! Copyright TXPCo, 2021 */

import { Persistence, PersistenceDetails, PersistenceDetailsMemento } from "./Persistence";
import { ERepUnits, TimeUnits, WeightUnits, QuantityMementoOf, QuantityOf } from "./Quantity";
import { RangeMementoOf, RangeOf } from "./Range";

// This enum is used to say which direction is 'better' for a measurement - quantity increasing or quantity decreasing 
// Whenever this is changed, the schema in ObservationDb must be changed to match
export enum EPositiveTrend { Up = "Up", Down = "Down"}

export enum EMeasurementUnitType { Weight = "Weight", Time = "Time", Reps = "Reps" };

// Whenever this is changed, the schema in ObservationDb must be changed to match
export enum EMeasurementType {
   Snatch = "Snatch", Clean = "Clean", Jerk = "Jerk", CleanAndJerk = "CleanAndJerk",
   Row250="Row250", Run250="Run250"
}

export class MeasurementTypeMementoOf<Unit> {
   _measurementType: EMeasurementType;
   _unitType: EMeasurementUnitType;
   _range: RangeMementoOf<Unit>;
   _trend: EPositiveTrend;

   /**
    * Create a MeasurementTypeMementoFor object - contains the statis elements that characterise a measurement
    * @param measurementType - defines the type of the measurement 
    * @param measurementUnitType - unit typ (weight/time/reps)
    * @param range - acceptable range of values
    * @param trend - used to say which direction is 'better' for a measurement - quantity increasing or quantity decreasing
    */
   constructor(measurementType: EMeasurementType, unitType: EMeasurementUnitType, range: RangeMementoOf<Unit>, trend: EPositiveTrend) {

      this._measurementType = measurementType;
      this._unitType = unitType;
      this._range = range;
      this._trend = trend;
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

   get range(): RangeMementoOf<Unit> {
      return this._range;
   }

   get trend(): EPositiveTrend {
      return this._trend;
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
   _persistenceDetails: PersistenceDetailsMemento;
   _quantity: QuantityMementoOf<MeasuredUnit>;
   _repeats: number;
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
      quantity: QuantityOf<MeasuredUnit>, repeats: number, cohortPeriod: number, measurementType: MeasurementTypeOf<MeasuredUnit>, subjectExternalId: string)
   {
      this._persistenceDetails = persistenceDetails.memento();
      this._quantity = quantity.memento();
      this._repeats = repeats;
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
   get repeats(): number {
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
   private _repeats: number;
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
      quantity: QuantityOf<MeasuredUnit>, repeats: number, cohortPeriod: number, measurementType: MeasurementTypeOf<MeasuredUnit>, subjectExternalId: string)
   public constructor(memento: MeasurementMementoOf<MeasuredUnit>);
   public constructor(...params: any[]) {

      if (params.length === 1) {

         let memento: MeasurementMementoOf<MeasuredUnit> = params[0];

         super(new PersistenceDetails(memento._persistenceDetails._id,
            memento._persistenceDetails._schemaVersion,
            memento._persistenceDetails._sequenceNumber));

         this._quantity = new QuantityOf<MeasuredUnit>(memento._quantity._amount,
            memento._quantity._unit);
         this._repeats = memento._repeats;
         this._cohortPeriod = memento._cohortPeriod;
         this._measurementType = new MeasurementTypeOf<MeasuredUnit>(memento._measurementType);
         this._subjectExternalId = memento._subjectExternalId;

      } else {

         super(params[0]);

         if (!params[4].range.includes(params[1])) {
            throw RangeError();
         }
         this._quantity = params[1];
         this._repeats = params[2];
         this._cohortPeriod = params[3];
         this._measurementType = params[4];
         this._subjectExternalId = params[5];
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
         this._repeats === rhs._repeats &&
         this._cohortPeriod === rhs._cohortPeriod &&
         this._measurementType.equals(rhs.measurementType) &&
         this._subjectExternalId === rhs._subjectExternalId);
   }
}

export interface IMeasurementStore {
   load(id: any): Promise<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits> | null>;
   loadMany(ids: Array<any>): Promise<Array<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits>>>;
   save(measurement: MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits>): Promise<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits> | null>;
}