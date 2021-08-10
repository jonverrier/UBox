/*! Copyright TXPCo, 2020, 2021 */

import { EWeightUnits, QuantityOf } from './Quantity'; // ETimeUnits, EDistanceUnits, ERepUnits;
import { RangeOf } from './Range';
import { EMeasurementType, EPositiveTrend, MeasurementTypeOf, MeasurementTypeMementoFor } from "./Observation";
import { decodeWith, encodeWith, createEnumType, ICodec} from '../src/IOCommon';

import * as IoTs from 'io-ts';

// Rule summary for a Persistent Object: 
// - derives from IPersistence, which contains a PersistentDetails member object. 
// - can save itself to a Memento object, which contains internal state. 
// - has a Codec class, which can transform to and from the Memento format. 
// - Memento versions are transmitted over the wire, and stored in the database.

// Quantity Codec - does not include Units, these gett added in by higher level Codecs depending on type of the higher object
// ==========
const quantityIoType = IoTs.type({
   _amount: IoTs.number,
   _unit: IoTs.unknown
});

const rangeIoType = IoTs.type({
   _lo: quantityIoType,
   _loInclEq: IoTs.boolean,
   _hi: quantityIoType,
   _hiInclEq: IoTs.boolean,
});

// WeightMeasurementType Codec
// ==========

const weightMeasurementTypeIoType = IoTs.type({
   _measurementType: createEnumType<EMeasurementType>(EMeasurementType, 'EMeasurementType'),
   _range: rangeIoType,
   _trend: createEnumType<EPositiveTrend>(EPositiveTrend, 'EPositiveTrend')
});

export class WeightMeasurementTypeCodec implements ICodec<MeasurementTypeOf<EWeightUnits>> {

   decode(data: any): any {
      return decodeWith(weightMeasurementTypeIoType)(data);
   }

   encode(data: MeasurementTypeOf<EWeightUnits>): any {
      var memento: MeasurementTypeMementoFor<EWeightUnits> = data.memento();

      return encodeWith(weightMeasurementTypeIoType)(memento);
   }

   tryCreateFrom(data: any): MeasurementTypeOf<EWeightUnits> {
      let temp = decodeWith(weightMeasurementTypeIoType)(data); // If types dont match an exception will be thrown here

      return new MeasurementTypeOf<EWeightUnits>(temp._measurementType,
         new RangeOf<EWeightUnits>(new QuantityOf<EWeightUnits>(temp._range._lo._amount, EWeightUnits.Kg), temp._range._loInclEq,
            new QuantityOf<EWeightUnits>(temp._range._hi._amount, EWeightUnits.Kg), temp._range._hiInclEq),
         temp._trend);
   }
}
