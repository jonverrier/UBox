/*! Copyright TXPCo, 2020, 2021 */
import { EBaseUnitDimension, BaseUnits } from './Unit';
import { Quantity } from "./Quantity";
import { Range } from "./Range";
import { EMeasurementType, EPositiveTrend, MeasurementType } from './ObservationType';

// ====================
// Weight Measurements
// ====================
class LiftMeasurementType extends MeasurementType {

   /**
    * Create a LiftMeasurementType object - contains the static elements that characterise measurement of a weight lift
    */
   constructor(lift: EMeasurementType, lowBar: number, highBar: number) {
      let lo = new Quantity(lowBar, BaseUnits.kilogram);
      let hi = new Quantity(highBar, BaseUnits.kilogram);
      let range = new Range(lo, true, hi, true);

      super(lift, EBaseUnitDimension.Weight, range, EPositiveTrend.Up);
   }

}

class SnatchMeasurementType extends LiftMeasurementType {

   /**
    * Create a SnatchMeasurementType object - contains the static elements that characterise measurement of a snatch
    */
   constructor() {
      super(EMeasurementType.Snatch, 0, 250);
   }

}

class CleanMeasurementType extends LiftMeasurementType {

   /**
    * Create a CleanMeasurementType object - contains the static elements that characterise measurement of a clean
    */
   constructor() {
      super(EMeasurementType.Clean, 0, 350);
   }

}

class JerkMeasurementType extends LiftMeasurementType {

   /**
    * Create a JerkMeasurementType object - contains the static elements that characterise measurement of a jerk
    */
   constructor() {
      super(EMeasurementType.Jerk, 0, 300);
   }

}

class CleanAndJerkMeasurementType extends LiftMeasurementType {

   /**
    * Create a CleanMeasurementType object - contains the static elements that characterise measurement of a clean & jerk
    */
   constructor() {
      super(EMeasurementType.CleanAndJerk, 0, 300);
   }

}

// ====================
// Speed Measurements
// ====================
class SpeedMeasurementType extends MeasurementType {

   /**
    * Create a SpeedMeasurementType object - contains the static elements that characterise measurement of any movement measured by time
    */
   constructor(measurementTypemeasurementType: EMeasurementType, lowBar: number, highBar: number) {
      let lo = new Quantity(lowBar, BaseUnits.second);
      let hi = new Quantity(highBar, BaseUnits.second);
      let range = new Range(lo, true, hi, true);

      super(measurementTypemeasurementType, EBaseUnitDimension.Time, range, EPositiveTrend.Down);
   }

}

class Row250mMeasurementType extends SpeedMeasurementType {

   /**
    * Create a Row250mMeasurementType object - contains the static elements that characterise measurement of a 250m row
    */
   constructor() {
      super(EMeasurementType.Row250, 5, 500);
   }

}

class Run800mMeasurementType extends SpeedMeasurementType {

   /**
    * Create a Run800mMeasurementType object - contains the static elements that characterise measurement of a 800m run
    */
   constructor() {
      super(EMeasurementType.Run800, 120, 1000);
   }
}

export class MeasurementTypes {

   private _measurementTypes: Array<MeasurementType>;

   public static readonly _snatch: MeasurementType = new SnatchMeasurementType();
   public static readonly _clean: MeasurementType = new CleanMeasurementType();
   public static readonly _jerk: MeasurementType = new JerkMeasurementType();
   public static readonly _cleanAndJerk: MeasurementType = new CleanAndJerkMeasurementType();
   public static readonly _run800: MeasurementType = new Run800mMeasurementType();
   public static readonly _row250: MeasurementType = new Row250mMeasurementType();
   /**
    * Create a OlympicLiftMeasurementTypeFactory object
    */
   constructor() {

      this._measurementTypes = new Array<MeasurementType>();

      this.addOlympicObservationTypes();
      this.addConditioningObservationTypes();
   }

   static get snatch(): MeasurementType {
      return this._snatch;
   }

   static get clean(): MeasurementType {
      return this._clean;
   }

   static get jerk(): MeasurementType {
      return this._jerk;
   }

   static get cleanAndJerk(): MeasurementType {
      return this._cleanAndJerk;
   }

   static get run800(): MeasurementType {
      return this._run800;
   }

   static get row250(): MeasurementType {
      return this._row250;
   }

   lookup(measurementTypeName: string): MeasurementType | null {

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
      this._measurementTypes.push(MeasurementTypes._snatch);
      this._measurementTypes.push(MeasurementTypes._clean);
      this._measurementTypes.push(MeasurementTypes._jerk);
      this._measurementTypes.push(MeasurementTypes._cleanAndJerk);
   }
   private addConditioningObservationTypes(): void {
      this._measurementTypes.push(MeasurementTypes._run800);
      this._measurementTypes.push(MeasurementTypes._row250);
   }
}

