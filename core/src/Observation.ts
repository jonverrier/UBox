/*! Copyright TXPCo, 2021 */

import { EBaseUnitDimension, BaseUnit } from './Unit';
import { QuantityMemento, Quantity } from "./Quantity";
import { RangeMemento, Range } from "./Range";
import { Persistence, PersistenceDetails, PersistenceDetailsMemento } from "./Persistence";
import { EMeasurementType, MeasurementType } from './ObservationType';
import { MeasurementTypes } from './ObservationTypeDictionary';



export class MeasurementMemento {
   readonly _persistenceDetails: PersistenceDetailsMemento;
   readonly _quantity: QuantityMemento;
   readonly _repeats: number;
   readonly _timestampRounded: number;
   readonly _measurementType: EMeasurementType;
   readonly _subjectKey: string;

   /**
    * Create a MeasurementMementoOf object - a quantity, with a range of validity, and a marker of the positive trend (is it good if quantity goes up, or down)
    * @param persistenceDetails - (from Persistence) for the database layer to use and assign
    * @param quantity - the value of the measurement (amount and units)
    * @param repeats - the number of reps (for weight), number of distance units (for time measurements)
    * @param timestampRounded - the period in which the measurement was taken. This is a timestamp in msecs rounded to nearest 15 minute interval
    * @param measurementType - key to the class that defines the type of measurement
    * @param subjectKey - reference to the entity to which the measurement applies  - usually a Person
    * Design - all memento classes must depend only on base types, value types, or other Mementos*
    */
   constructor(persistenceDetails: PersistenceDetailsMemento,
      quantity: QuantityMemento, repeats: number, timestampRounded: number,
      measurementType: EMeasurementType,
      subjectKey: string)
   {
      this._persistenceDetails = persistenceDetails;
      this._quantity = quantity;
      this._repeats = repeats;
      this._timestampRounded = timestampRounded;
      this._measurementType = measurementType;
      this._subjectKey = subjectKey;
   }
}

export class Measurement extends Persistence {
   private _quantity: Quantity
   private _repeats: number;
   private _timestampRounded: number;
   private _measurementType: MeasurementType;
   private _subjectKey: string; 

/**
 * Create a Measurement object - a quantity, with a range of validity, and a marker of the positive trend (is it good if quantity goes up, or down)
 * @param persistenceDetails - (from Persistence) for the database layer to use and assign
 * @param quantity - the value of the measurement (amount and units)
 * @param repeats - the number of reps (for weight), number of distance units (for time measurements)
 * @param timestampRounded - the period in which the measurement was taken. This is a timestamp in msecs rounded to nearest 15 minute interval
 * @param measurementType - reference to the class that defines the type of measurement
 * @param subjectKey - reference to the entity to which the measurement applies  - usually a Person
 */
   constructor(persistenceDetails: PersistenceDetails,
      quantity: Quantity, repeats: number, timestampRounded: number, measurementType: MeasurementType, subjectKey: string)
   public constructor(memento: MeasurementMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {

         let memento: MeasurementMemento = params[0];

         super(new PersistenceDetails(memento._persistenceDetails._key,
            memento._persistenceDetails._schemaVersion,
            memento._persistenceDetails._sequenceNumber));

         // Look up the measurement type from the enum
         let measurements: MeasurementTypes = new MeasurementTypes();
         let measurementType: MeasurementType = measurements.lookup(memento._measurementType);

         this._quantity = new Quantity(memento._quantity._amount,
            new BaseUnit(memento._quantity._unit));
         this._repeats = memento._repeats;
         this._timestampRounded = memento._timestampRounded;
         this._measurementType = measurementType;
         this._subjectKey = memento._subjectKey;

      } else {

         super(params[0]);

         if (!params[4].range.includes(params[1])) {
            throw RangeError();
         }
         this._quantity = params[1];
         this._repeats = params[2];
         this._timestampRounded = params[3];
         this._measurementType = params[4];
         this._subjectKey = params[5];
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get quantity(): Quantity {
      return this._quantity;
   }
   get repeats(): number {
      return this._repeats;
   }
   get timestampRounded(): number {
      return this._timestampRounded;
   }
   get measurementType(): MeasurementType {
      return this._measurementType;
   }
   get subjectKey(): string {
      return this._subjectKey;
   }

   /**
   * memento() returns a copy of internal state
   */
   memento(): MeasurementMemento  {
      return new MeasurementMemento(this.persistenceDetails.memento(),
         this._quantity.memento(),
         this._repeats, this._timestampRounded,
         this._measurementType.measurementType,
         this._subjectKey);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Measurement ) : boolean {

      return (super.equals (rhs) && 
         this._quantity.equals(rhs._quantity) &&
         this._repeats === rhs._repeats &&
         this._timestampRounded === rhs._timestampRounded &&
         this._measurementType.equals(rhs.measurementType) &&
         this._subjectKey === rhs._subjectKey);
   }

   // Returns a number that is timestamp rounded to nearest 15 mins
   // https://stackoverflow.com/questions/4968250/how-to-round-time-to-the-nearest-quarter-hour-in-javascript
   static timeStamp(now: Date): number {
      var minutes:number = now.getMinutes();
      var hours: number = now.getHours();

      // round to nearest 15 minutes
      var m: number = (((minutes + 7.5) / 15 | 0) * 15) % 60;
      var h: number = ((((minutes / 105) + .5) | 0) + hours) % 24;
      var date: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
      return date.getTime();
   }

   static timeStampNow(): number {
      return Measurement.timeStamp(new Date());
   }
}

export interface IMeasurementStore {
   loadOne (id: string): Promise<Measurement | null>;
   loadMany (ids: Array<string>): Promise<Array<Measurement>>;
   save (measurement: Measurement): Promise<Measurement | null>;
}