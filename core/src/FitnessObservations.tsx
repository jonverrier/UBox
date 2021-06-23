/*! Copyright TXPCo, 2021 */

import { EWeightUnits, EDistanceUnits, ETimeUnits, QuantityOf } from "./Quantity";
import { RangeOf } from "./Range";
import { EMeasurementType, EPositiveTrend, MeasurementTypeOf, MeasurementOf } from './Observation';


// ====================
// Weight Measurements
// ====================
export class LiftMeasurementType extends MeasurementTypeOf<EWeightUnits> {

   /**
    * Create a SnatchMeasurementType object - contains the static elements that characterise measurement of a snatch
    */
   constructor(lift: EMeasurementType, lowBar: number, highBar: number) {
      let lo = new QuantityOf<EWeightUnits>(lowBar, EWeightUnits.Kg);
      let hi = new QuantityOf<EWeightUnits>(highBar, EWeightUnits.Kg);
      let range = new RangeOf<EWeightUnits>(lo, true, hi, true);

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
export class SpeedMeasurementType extends MeasurementTypeOf<ETimeUnits> {

   /**
    * Create a RowDistanceMeasurementType object - contains the static elements that characterise measurement of a row distance
    */
   constructor(mono: EMeasurementType, lowBar: number, highBar: number, ) {
      let lo = new QuantityOf<ETimeUnits>(lowBar, ETimeUnits.Seconds);
      let hi = new QuantityOf<ETimeUnits>(highBar, ETimeUnits.Seconds);
      let range = new RangeOf<ETimeUnits>(lo, true, hi, true);

      super(mono, range, EPositiveTrend.Down);
   }

}

export class Row500mMeasurementType extends SpeedMeasurementType {

   /**
    * Create a Row500mMeasurementType object - contains the static elements that characterise measurement of a 500m row
    */
   constructor() {
      super(EMeasurementType.Row500m, 60, 300);
   }

}

export class Row1000mMeasurementType extends SpeedMeasurementType {

   /**
    * Create a Row500mMeasurementType object - contains the static elements that characterise measurement of a 1000m row
    */
   constructor() {
      super(EMeasurementType.Row1000m, 60, 300);
   }

}