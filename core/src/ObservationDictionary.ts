/*! Copyright TXPCo, 2020, 2021 */
import { WeightUnits, TimeUnits } from "./Quantity";
import { MeasurementTypeOf, IMeasurementTypeFactoryFor } from './Observation';
import {
   SnatchMeasurementType, CleanMeasurementType, JerkMeasurementType, CleanAndJerkMeasurementType,
   Row250mMeasurementType, Run800mMeasurementType
} from "./FitnessObservations";

export class OlympicLiftMeasurementTypeFactory implements IMeasurementTypeFactoryFor<WeightUnits> {

   private _measurementTypes: Array<MeasurementTypeOf<WeightUnits>>;

   /**
    * Create a OlympicLiftMeasurementTypeFactory object
    */
   constructor() {

      this._measurementTypes = new Array<MeasurementTypeOf<WeightUnits>>();

      this.addOlympicObservationTypes();
   }

   lookup (measurementTypeName: string): MeasurementTypeOf<WeightUnits> | null {

      for (var item of this._measurementTypes) {
         if (item.measurementType === measurementTypeName)
            return item;
      }

      return null;
   }

   isValid(measurementTypeName: string): boolean {
      for (var item of this._measurementTypes) {
         if (item.measurementType === measurementTypeName)
            return true;
      }

      return false;
   }

   private addOlympicObservationTypes(): void {
      this._measurementTypes.push(new SnatchMeasurementType(this));
      this._measurementTypes.push(new CleanMeasurementType(this));
      this._measurementTypes.push(new JerkMeasurementType(this));
      this._measurementTypes.push(new CleanAndJerkMeasurementType(this));
   }
}

export class SpeedMeasurementTypeFactory implements IMeasurementTypeFactoryFor<TimeUnits> {

   private _measurementTypes: Array<MeasurementTypeOf<TimeUnits>>;

   /**
    * Create a SpeedMeasurementTypeFactory object
    */
   constructor() {

      this._measurementTypes = new Array<MeasurementTypeOf<TimeUnits>>();

      this.addSpeedObservationTypes();
   }

   lookup(measurementTypeName: string): MeasurementTypeOf<TimeUnits> | null {

      for (var item of this._measurementTypes) {
         if (item.measurementType === measurementTypeName)
            return item;
      }

      return null;
   }

   isValid(measurementTypeName: string): boolean {
      for (var item of this._measurementTypes) {
         if (item.measurementType === measurementTypeName)
            return true;
      }

      return false;
   }

   private addSpeedObservationTypes(): void {
      this._measurementTypes.push(new Run800mMeasurementType(this));
      this._measurementTypes.push(new Row250mMeasurementType(this));
   }
}