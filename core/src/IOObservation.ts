/*! Copyright TXPCo, 2020, 2021 */


import { EWeightUnits, ERepUnits, QuantityOf, ETimeUnits } from './Quantity'; // ETimeUnits, EDistanceUnits, ERepUnits;
import { RangeOf } from './Range';
import { PersistenceDetails } from './Persistence';
import { EMeasurementType, EPositiveTrend, MeasurementTypeOf, MeasurementTypeMementoOf, MeasurementOf, MeasurementMementoOf} from "./Observation";
import { decodeWith, encodeWith, createEnumType, ICodec, persistenceDetailsIoType } from '../src/IOCommon';

import * as IoTs from 'io-ts';

// Rule summary for a Persistent Object: 
// - derives from IPersistence, which contains a PersistentDetails member object. 
// - can save itself to a Memento object, which contains internal state. 
// - has a Codec class, which can transform to and from the Memento format. 
// - Memento versions are transmitted over the wire, and stored in the database.

// Quantity Codecs
// ==========
const weightQuantityIoType = IoTs.type({
   _amount: IoTs.number,
   _unit: createEnumType<EWeightUnits>(EWeightUnits, 'EWeightUnits')
});

const timeQuantityIoType = IoTs.type({
   _amount: IoTs.number,
   _unit: createEnumType<ETimeUnits>(ETimeUnits, 'ETimeUnits')
});

const repQuantityIoType = IoTs.type({
   _amount: IoTs.number,
   _unit: createEnumType<ERepUnits>(ERepUnits, 'ERepUnits')
});

const weightRangeIoType = IoTs.type({
   _lo: weightQuantityIoType,
   _loInclEq: IoTs.boolean,
   _hi: weightQuantityIoType,
   _hiInclEq: IoTs.boolean,
});

const timeRangeIoType = IoTs.type({
   _lo: timeQuantityIoType,
   _loInclEq: IoTs.boolean,
   _hi: timeQuantityIoType,
   _hiInclEq: IoTs.boolean,
});

// WeightMeasurementType Codec
// ==========

export const weightMeasurementTypeIoType = IoTs.type({
   _measurementType: createEnumType<EMeasurementType>(EMeasurementType, 'EMeasurementType'),
   _range: weightRangeIoType,
   _trend: createEnumType<EPositiveTrend>(EPositiveTrend, 'EPositiveTrend')
});

export class WeightMeasurementTypeCodec implements ICodec<MeasurementTypeOf<EWeightUnits>> {

   decode(data: any): any {
      return decodeWith(weightMeasurementTypeIoType)(data);
   }

   encode(data: MeasurementTypeOf<EWeightUnits>): any {
      var memento: MeasurementTypeMementoOf<EWeightUnits> = data.memento();

      return encodeWith(weightMeasurementTypeIoType)(memento);
   }

   tryCreateFrom(data: any): MeasurementTypeOf<EWeightUnits> {
      let temp = this.decode (data); // If types dont match an exception will be thrown here

      return new MeasurementTypeOf<EWeightUnits>(temp._measurementType,
         new RangeOf<EWeightUnits>(new QuantityOf<EWeightUnits>(temp._range._lo._amount, EWeightUnits.Kg), temp._range._loInclEq,
            new QuantityOf<EWeightUnits>(temp._range._hi._amount, EWeightUnits.Kg), temp._range._hiInclEq),
         temp._trend);
   }
}

// WeightMeasurement Codec
// ==========

export const weightMeasurementIoType = IoTs.type({
   _persistenceDetails: persistenceDetailsIoType,
   _quantity: weightQuantityIoType,
   _repeats: repQuantityIoType,
   _cohortPeriod: IoTs.number,
   _measurementType: weightMeasurementTypeIoType,
   _subjectExternalId: IoTs.string
});

export class WeightMeasurementCodec implements ICodec<MeasurementOf<EWeightUnits>> {

   decode(data: any): any {
      return decodeWith(weightMeasurementIoType)(data);
   }

   encode(data: MeasurementOf<EWeightUnits>): any {
      var memento: MeasurementMementoOf<EWeightUnits> = data.memento();

      return encodeWith(weightMeasurementIoType)(memento);
   }

   tryCreateFrom(data: any): MeasurementOf<EWeightUnits> {
      let temp = this.decode(data); // If types dont match an exception will be thrown here

      return new MeasurementOf<EWeightUnits>(
         new PersistenceDetails(temp._persistenceDetails._id, temp._persistenceDetails._schemaVersion, temp._persistenceDetails._sequenceNumber),
         new QuantityOf<EWeightUnits>(temp._quantity._amount, EWeightUnits.Kg),
         new QuantityOf<ERepUnits>(temp._repeats._amount, ERepUnits.Reps),
         temp._cohortPeriod,
         new MeasurementTypeOf<EWeightUnits>(
            temp._measurementType._measurementType,
            new RangeOf<EWeightUnits>(
               new QuantityOf<EWeightUnits>(temp._measurementType._range._lo._amount, EWeightUnits.Kg), temp._measurementType._range._loInclEq,
               new QuantityOf<EWeightUnits>(temp._measurementType._range._hi._amount, EWeightUnits.Kg), temp._measurementType._range._hiInclEq),
            temp._measurementType._trend),
         temp._subjectExternalId);
   }
}

// TimeMeasurementType Codec
// ==========

export const timeMeasurementTypeIoType = IoTs.type({
   _measurementType: createEnumType<EMeasurementType>(EMeasurementType, 'EMeasurementType'),
   _range: timeRangeIoType,
   _trend: createEnumType<EPositiveTrend>(EPositiveTrend, 'EPositiveTrend')
});

export class TimeMeasurementTypeCodec implements ICodec<MeasurementTypeOf<ETimeUnits>> {

   decode(data: any): any {
      return decodeWith(timeMeasurementTypeIoType)(data);
   }

   encode(data: MeasurementTypeOf<ETimeUnits>): any {
      var memento: MeasurementTypeMementoOf<ETimeUnits> = data.memento();

      return encodeWith(timeMeasurementTypeIoType)(memento);
   }

   tryCreateFrom(data: any): MeasurementTypeOf<ETimeUnits> {
      let temp = this.decode(data); // If types dont match an exception will be thrown here

      return new MeasurementTypeOf<ETimeUnits>(temp._measurementType,
         new RangeOf<ETimeUnits>(new QuantityOf<ETimeUnits>(temp._range._lo._amount, ETimeUnits.Seconds), temp._range._loInclEq,
            new QuantityOf<ETimeUnits>(temp._range._hi._amount, ETimeUnits.Seconds), temp._range._hiInclEq),
         temp._trend);
   }
}

// TimeMeasurement Codec
// ==========

export const timeMeasurementIoType = IoTs.type({
   _persistenceDetails: persistenceDetailsIoType,
   _quantity: timeQuantityIoType,
   _repeats: repQuantityIoType,
   _cohortPeriod: IoTs.number,
   _measurementType: timeMeasurementTypeIoType,
   _subjectExternalId: IoTs.string
});

export class TimeMeasurementCodec implements ICodec<MeasurementOf<ETimeUnits>> {

   decode(data: any): any {
      return decodeWith(timeMeasurementIoType)(data);
   }

   encode(data: MeasurementOf<ETimeUnits>): any {
      var memento: MeasurementMementoOf<ETimeUnits> = data.memento();

      return encodeWith(timeMeasurementIoType)(memento);
   }

   tryCreateFrom(data: any): MeasurementOf<ETimeUnits> {
      let temp = this.decode(data); // If types dont match an exception will be thrown here

      return new MeasurementOf<ETimeUnits>(
         new PersistenceDetails(temp._persistenceDetails._id, temp._persistenceDetails._schemaVersion, temp._persistenceDetails._sequenceNumber),
         new QuantityOf<ETimeUnits>(temp._quantity._amount, ETimeUnits.Seconds),
         new QuantityOf<ERepUnits>(temp._repeats._amount, ERepUnits.Reps),
         temp._cohortPeriod,
         new MeasurementTypeOf<ETimeUnits>(
            temp._measurementType._measurementType,
            new RangeOf<ETimeUnits>(
               new QuantityOf<ETimeUnits>(temp._measurementType._range._lo._amount, ETimeUnits.Seconds), temp._measurementType._range._loInclEq,
               new QuantityOf<ETimeUnits>(temp._measurementType._range._hi._amount, ETimeUnits.Seconds), temp._measurementType._range._hiInclEq),
            temp._measurementType._trend),
         temp._subjectExternalId);
   }
}