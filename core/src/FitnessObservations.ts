/*! Copyright TXPCo, 2021 */

import { WeightUnits, EWeightUnits, TimeUnits, ETimeUnits, QuantityOf } from "./Quantity";
import { RangeOf } from "./Range";
import { EMeasurementType, EMeasurementUnitType, EPositiveTrend, MeasurementTypeOf, IMeasurementTypeFactoryFor} from './Observation';


// ====================
// Weight Measurements
// ====================
export class LiftMeasurementType extends MeasurementTypeOf<WeightUnits> {

   /**
    * Create a SnatchMeasurementType object - contains the static elements that characterise measurement of a snatch
    */
   constructor(lift: EMeasurementType, lowBar: number, highBar: number, measurementTypeFactory: IMeasurementTypeFactoryFor<WeightUnits>) {
      let lo = new QuantityOf<WeightUnits>(lowBar, EWeightUnits.Kg);
      let hi = new QuantityOf<WeightUnits>(highBar, EWeightUnits.Kg);
      let range = new RangeOf<WeightUnits>(lo, true, hi, true);

      super(lift, EMeasurementUnitType.Weight, range, EPositiveTrend.Up, measurementTypeFactory);
   }

}

export class SnatchMeasurementType extends LiftMeasurementType {

   /**
    * Create a SnatchMeasurementType object - contains the static elements that characterise measurement of a snatch
    */
   constructor(measurementTypeFactory: IMeasurementTypeFactoryFor<WeightUnits>) {
      super(EMeasurementType.Snatch, 0, 250, measurementTypeFactory);
   }

}

export class CleanMeasurementType extends LiftMeasurementType {

   /**
    * Create a CleanMeasurementType object - contains the static elements that characterise measurement of a clean
    */
   constructor(measurementTypeFactory: IMeasurementTypeFactoryFor<WeightUnits>) {
      super(EMeasurementType.Clean, 0, 350, measurementTypeFactory);
   }

}

export class JerkMeasurementType extends LiftMeasurementType {

   /**
    * Create a JerkMeasurementType object - contains the static elements that characterise measurement of a jerk
    */
   constructor(measurementTypeFactory: IMeasurementTypeFactoryFor<WeightUnits>) {
      super(EMeasurementType.Jerk, 0, 300, measurementTypeFactory);
   }

}

export class CleanAndJerkMeasurementType extends LiftMeasurementType {

   /**
    * Create a CleanMeasurementType object - contains the static elements that characterise measurement of a clean & jerk
    */
   constructor(measurementTypeFactory: IMeasurementTypeFactoryFor<WeightUnits>) {
      super(EMeasurementType.CleanAndJerk, 0, 300, measurementTypeFactory);
   }

}

// ====================
// Speed Measurements
// ====================
export class SpeedMeasurementType extends MeasurementTypeOf<TimeUnits> {

   /**
    * Create a SpeedMeasurementType object - contains the static elements that characterise measurement of any movement measured by time
    */
   constructor(measurementTypemeasurementType: EMeasurementType, lowBar: number, highBar: number, measurementTypeFactory:IMeasurementTypeFactoryFor<TimeUnits>) {
      let lo = new QuantityOf<TimeUnits>(lowBar, ETimeUnits.Seconds);
      let hi = new QuantityOf<TimeUnits>(highBar, ETimeUnits.Seconds);
      let range = new RangeOf<TimeUnits>(lo, true, hi, true);

      super(measurementTypemeasurementType, EMeasurementUnitType.Time, range, EPositiveTrend.Down, measurementTypeFactory);
   }

}

export class Row250mMeasurementType extends SpeedMeasurementType {

   /**
    * Create a Row250mMeasurementType object - contains the static elements that characterise measurement of a 250m row
    */
   constructor(measurementTypeFactory: IMeasurementTypeFactoryFor<TimeUnits>) {
      super(EMeasurementType.Row250, 5, 500, measurementTypeFactory);
   }

}

export class Run800mMeasurementType extends SpeedMeasurementType {

   /**
    * Create a Run800mMeasurementType object - contains the static elements that characterise measurement of a 800m run
    */
   constructor(measurementTypeFactory: IMeasurementTypeFactoryFor<TimeUnits>) {
      super(EMeasurementType.Run800, 120, 1000, measurementTypeFactory);
   }

}