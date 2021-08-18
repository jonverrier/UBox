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

      return new MeasurementTypeOf<EWeightUnits>(temp);
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

      return new MeasurementOf<EWeightUnits>(temp);
   }
}

// weightMeasurements (plural) Codec
// ==========

export const weightMeasurementsIoType = IoTs.array(weightMeasurementIoType);

export class WeightMeasurementsCodec implements ICodec<Array<MeasurementOf<EWeightUnits>>> {

   decode(data: any): any {
      return decodeWith(weightMeasurementsIoType)(data);
   }

   encode(data: Array<MeasurementOf<EWeightUnits>>): any {
      var i: number;
      var mementos: Array<MeasurementMementoOf<EWeightUnits>> = new Array<MeasurementMementoOf<EWeightUnits>>();

      for (i = 0; i < data.length; i++) {
         mementos[i] = data[i].memento();
      }
      return encodeWith(weightMeasurementsIoType)(mementos);
   }

   tryCreateFrom(data: any): Array<MeasurementOf<EWeightUnits>> {

      var i: number;
      var measurements: Array<MeasurementOf<EWeightUnits>> = new Array<MeasurementOf<EWeightUnits>>();

      for (i = 0; i < data.length; i++) {

         let temp = this.decode(data[i]); // If types dont match an exception will be thrown here

         measurements[i] = new MeasurementOf<EWeightUnits>(temp);
      }

      return measurements;
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

      return new MeasurementTypeOf<ETimeUnits>(temp);
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

      return new MeasurementOf<ETimeUnits>(temp);
   }
}