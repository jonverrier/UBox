/*! Copyright TXPCo, 2021 */

import { WeightUnits, EWeightUnits, TimeUnits, ETimeUnits, QuantityOf } from "./Quantity";
import { RangeOf } from "./Range";
import { EMeasurementType, EPositiveTrend, MeasurementTypeOf} from './Observation';


// ====================
// Weight Measurements
// ====================
export class LiftMeasurementType extends MeasurementTypeOf<WeightUnits> {

   /**
    * Create a SnatchMeasurementType object - contains the static elements that characterise measurement of a snatch
    */
   constructor(lift: EMeasurementType, lowBar: number, highBar: number) {
      let lo = new QuantityOf<WeightUnits>(lowBar, EWeightUnits.Kg);
      let hi = new QuantityOf<WeightUnits>(highBar, EWeightUnits.Kg);
      let range = new RangeOf<WeightUnits>(lo, true, hi, true);

      super(lift, range, EPositiveTrend.Up);
   }

}

export class SnatchMeasurementType extends LiftMeasurementType {

   /**
    * Create a SnatchMeasurementType object - contains the static elements that characterise measurement of a snatch
    */
   constructor() {
      super(EMeasurementType.Snatch, 0, 250);
   }

}

export class CleanMeasurementType extends LiftMeasurementType {

   /**
    * Create a CleanMeasurementType object - contains the static elements that characterise measurement of a clean
    */
   constructor() {
      super(EMeasurementType.Clean, 0, 350);
   }

}

export class JerkMeasurementType extends LiftMeasurementType {

   /**
    * Create a JerkMeasurementType object - contains the static elements that characterise measurement of a jerk
    */
   constructor() {
      super(EMeasurementType.Jerk, 0, 300);
   }

}

export class CleanAndJerkMeasurementType extends LiftMeasurementType {

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
export class SpeedMeasurementType extends MeasurementTypeOf<TimeUnits> {

   /**
    * Create a RowDistanceMeasurementType object - contains the static elements that characterise measurement of a row distance
    */
   constructor(mono: EMeasurementType, lowBar: number, highBar: number, ) {
      let lo = new QuantityOf<TimeUnits>(lowBar, ETimeUnits.Seconds);
      let hi = new QuantityOf<TimeUnits>(highBar, ETimeUnits.Seconds);
      let range = new RangeOf<TimeUnits>(lo, true, hi, true);

      super(mono, range, EPositiveTrend.Down);
   }

}

export class Row250mMeasurementType extends SpeedMeasurementType {

   /**
    * Create a Row500mMeasurementType object - contains the static elements that characterise measurement of a 500m row
    */
   constructor() {
      super(EMeasurementType.Row250, 5, 500);
   }

}

export class Run100m extends SpeedMeasurementType {

   /**
    * Create a Row500mMeasurementType object - contains the static elements that characterise measurement of a 500m row
    */
   constructor() {
      super(EMeasurementType.Run250, 5, 500);
   }

}