/*! Copyright TXPCo, 2020, 2021 */
import { WeightUnits, TimeUnits } from "./Quantity";
import { MeasurementTypeOf } from './Observation';
import {
   SnatchMeasurementType, CleanMeasurementType, JerkMeasurementType, CleanAndJerkMeasurementType,
   Row250mMeasurementType, Run800mMeasurementType
} from "./FitnessObservations";

export class ObservationDictionary {

   private _weightMeasurementTypes: Array<MeasurementTypeOf<WeightUnits>>;
   private _timeMeasurementTypes: Array<MeasurementTypeOf<TimeUnits>>;


   /**
    * Create a ObservationDictionary object
    */
   constructor() {

      this._weightMeasurementTypes = new Array<MeasurementTypeOf<WeightUnits>>();
      this._timeMeasurementTypes = new Array<MeasurementTypeOf<TimeUnits>>();

      this.addOlympicObservationTypes();
      this.addSpeedObservationTypes();
   }

   lookupWeightMeasurementType(measurementTypeName: string): MeasurementTypeOf<WeightUnits> | null {

      for (let i: number = 0; i < this._weightMeasurementTypes.length; i++) {
         if (this._weightMeasurementTypes[i].measurementType === measurementTypeName)
            return this._weightMeasurementTypes[i];
      }

      return null;
   }

   lookupTimeMeasurementType(measurementTypeName: string): MeasurementTypeOf<TimeUnits> | null {

      for (let i: number = 0; i < this._timeMeasurementTypes.length; i++) {
         if (this._timeMeasurementTypes[i].measurementType === measurementTypeName)
            return this._timeMeasurementTypes[i];
      }

      return null;
   }

   private addOlympicObservationTypes(): void {
      this._weightMeasurementTypes.push(new SnatchMeasurementType());
      this._weightMeasurementTypes.push(new CleanMeasurementType());
      this._weightMeasurementTypes.push(new JerkMeasurementType());
      this._weightMeasurementTypes.push(new CleanAndJerkMeasurementType());
   }


   private addSpeedObservationTypes(): void {
      this._timeMeasurementTypes.push(new Row250mMeasurementType());
      this._timeMeasurementTypes.push(new Run800mMeasurementType());
   }
}

