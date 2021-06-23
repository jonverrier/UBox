/*! Copyright TXPCo, 2021 */

import { EWeightUnits, EDistanceUnits, QuantityOf } from "./Quantity";
import { RangeOf } from "./Range";
import { EMeasurementType, EPositiveTrend, MeasurementTypeOf, MeasurementOf } from './Observation';


export class SnatchMeasurementType extends MeasurementTypeOf<EWeightUnits> {

   /**
    * Create a SnatchMeasurementType object - contains the static elements that characterise measurement of a snatch
    */
   constructor() {
      let lo = new QuantityOf<EWeightUnits>(0, EWeightUnits.Kg);
      let hi = new QuantityOf<EWeightUnits>(250, EWeightUnits.Kg);
      let range = new RangeOf<EWeightUnits>(lo, true, hi, true);

      super(EMeasurementType.Snatch, range, EPositiveTrend.Up);
   }

}

export class CleanMeasurementType extends MeasurementTypeOf<EWeightUnits> {

   /**
    * Create a CleanMeasurementType object - contains the static elements that characterise measurement of a clean
    */
   constructor() {
      let lo = new QuantityOf<EWeightUnits>(0, EWeightUnits.Kg);
      let hi = new QuantityOf<EWeightUnits>(350, EWeightUnits.Kg);
      let range = new RangeOf<EWeightUnits>(lo, true, hi, true);

      super(EMeasurementType.Clean, range, EPositiveTrend.Up);
   }

}

export class CleanAndJerkMeasurementType extends MeasurementTypeOf<EWeightUnits> {

   /**
    * Create a CleanMeasurementType object - contains the static elements that characterise measurement of a clean & jerk
    */
   constructor() {
      let lo = new QuantityOf<EWeightUnits>(0, EWeightUnits.Kg);
      let hi = new QuantityOf<EWeightUnits>(300, EWeightUnits.Kg);
      let range = new RangeOf<EWeightUnits>(lo, true, hi, true);

      super(EMeasurementType.CleanAndJerk, range, EPositiveTrend.Up);
   }

}


export class RowDistanceMeasurementType extends MeasurementTypeOf<EDistanceUnits> {

   /**
    * Create a RowDistanceMeasurementType object - contains the static elements that characterise measurement of a row distance
    */
   constructor() {
      let lo = new QuantityOf<EDistanceUnits>(0, EDistanceUnits.Metres);
      let hi = new QuantityOf<EDistanceUnits>(300, EDistanceUnits.Metres);
      let range = new RangeOf<EDistanceUnits>(lo, true, hi, true);

      super(EMeasurementType.RowDistance, range, EPositiveTrend.Up);
   }

}

