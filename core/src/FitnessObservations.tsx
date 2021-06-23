/*! Copyright TXPCo, 2021 */

import { EWeightUnits, EDistanceUnits, Quantity } from "./Quantity";
import { Range } from "./Range";
import { EMeasurementType, EPositiveTrend, MeasurementType, Measurement } from './Observation';


export class SnatchMeasurementType extends MeasurementType<EWeightUnits> {

   /**
    * Create a SnatchMeasurementType object - contains the static elements that characterise measurement of a snatch
    */
   constructor() {
      let lo = new Quantity<EWeightUnits>(0, EWeightUnits.Kg);
      let hi = new Quantity<EWeightUnits>(250, EWeightUnits.Kg);
      let range = new Range<EWeightUnits>(lo, true, hi, true);

      super(EMeasurementType.Snatch, range, EPositiveTrend.Up);
   }

}

export class CleanMeasurementType extends MeasurementType<EWeightUnits> {

   /**
    * Create a CleanMeasurementType object - contains the static elements that characterise measurement of a clean
    */
   constructor() {
      let lo = new Quantity<EWeightUnits>(0, EWeightUnits.Kg);
      let hi = new Quantity<EWeightUnits>(350, EWeightUnits.Kg);
      let range = new Range<EWeightUnits>(lo, true, hi, true);

      super(EMeasurementType.Clean, range, EPositiveTrend.Up);
   }

}

export class CleanAndJerkMeasurementType extends MeasurementType<EWeightUnits> {

   /**
    * Create a CleanMeasurementType object - contains the static elements that characterise measurement of a clean & jerk
    */
   constructor() {
      let lo = new Quantity<EWeightUnits>(0, EWeightUnits.Kg);
      let hi = new Quantity<EWeightUnits>(300, EWeightUnits.Kg);
      let range = new Range<EWeightUnits>(lo, true, hi, true);

      super(EMeasurementType.CleanAndJerk, range, EPositiveTrend.Up);
   }

}

/*
export class RowDistanceMeasurementType extends MeasurementType<EWeightUnits> {

   /**
    * Create a RowDistanceMeasurementType object - contains the static elements that characterise measurement of a row distance
    
   constructor() {
      let lo = new Quantity<EDistanceUnits>(0, EDistanceUnits.Metres);
      let hi = new Quantity<EDistanceUnits>(300, EDistanceUnits.Metres);
      let range = new Range<EDistanceUnits>(lo, true, hi, true);

      super(EMeasurementType.RowDistance, range, EPositiveTrend.Up);
   }

}

*/