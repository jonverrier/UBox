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
   readonly _cohortPeriod: number;
   readonly _measurementType: EMeasurementType;
   readonly _subjectKey: string;

   /**
    * Create a MeasurementMementoOf object - a quantity, with a range of validity, and a marker of the positive trend (is it good if quantity goes up, or down)
    * @param persistenceDetails - (from Persistence) for the database layer to use and assign
    * @param quantity - the value of the measurement (amount and units)
    * @param repeats - the number of reps (for weight), number of distance units (for time measurements)
    * @param cohortPeriod - the period in which the measurement was taken
    * @param measurementType - key to the class that defines the type of measurement
    * @param measurementTypeFactory - factory class to create an actual measurement type
    * @param subjectKey - reference to the entity to which the measurement applies  - usually a Person
    * Design - all memento classes must depend only on base types, value types, or other Mementos*
    */
   constructor(persistenceDetails: PersistenceDetailsMemento,
      quantity: QuantityMemento, repeats: number, cohortPeriod: number,
      measurementType: EMeasurementType,
      subjectKey: string)
   {
      this._persistenceDetails = persistenceDetails;
      this._quantity = quantity;
      this._repeats = repeats;
      this._cohortPeriod = cohortPeriod;
      this._measurementType = measurementType;
      this._subjectKey = subjectKey;
   }
}

export class Measurement extends Persistence {
   private _quantity: Quantity
   private _repeats: number;
   private _cohortPeriod: number;
   private _measurementType: MeasurementType;
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
      quantity: Quantity, repeats: number, cohortPeriod: number, measurementType: MeasurementType, subjectKey: string)
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
         this._cohortPeriod = memento._cohortPeriod;
         this._measurementType = measurementType;
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
   get quantity(): Quantity {
      return this._quantity;
   }
   get repeats(): number {
      return this._repeats;
   }
   get cohortPeriod(): number {
      return this._cohortPeriod;
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
         this._repeats, this._cohortPeriod,
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
         this._cohortPeriod === rhs._cohortPeriod &&
         this._measurementType.equals(rhs.measurementType) &&
         this._subjectKey === rhs._subjectKey);
   }
}

export interface IMeasurementStore {
   loadOne (id: string): Promise<Measurement | null>;
   loadMany (ids: Array<string>): Promise<Array<Measurement>>;
   save (measurement: Measurement): Promise<Measurement | null>;
}