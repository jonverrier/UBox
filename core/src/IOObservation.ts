/*! Copyright TXPCo, 2020, 2021 */


import { WeightUnits, ERepUnits, TimeUnits } from './Quantity'; 
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
   _unit: IoTs.string
});

const timeQuantityIoType = IoTs.type({
   _amount: IoTs.number,
   _unit: IoTs.string
});

const repQuantityIoType = IoTs.type({
   _amount: IoTs.number,
   _unit: IoTs.string
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

export class WeightMeasurementTypeCodec implements ICodec<MeasurementTypeOf<WeightUnits>> {

   decode(data: any): any {
      return decodeWith(weightMeasurementTypeIoType)(data);
   }

   encode(data: MeasurementTypeOf<WeightUnits>): any {
      var memento: MeasurementTypeMementoOf<WeightUnits> = data.memento();

      return encodeWith(weightMeasurementTypeIoType)(memento);
   }

   tryCreateFrom(data: any): MeasurementTypeOf<WeightUnits> {
      let temp = this.decode (data); // If types dont match an exception will be thrown here

      return new MeasurementTypeOf<WeightUnits>(temp);
   }
}

// WeightMeasurement Codec
// ==========

export const weightMeasurementIoType = IoTs.type({
   _persistenceDetails: persistenceDetailsIoType,
   _quantity: weightQuantityIoType,
   _repeats: IoTs.number,
   _cohortPeriod: IoTs.number,
   _measurementType: weightMeasurementTypeIoType,
   _subjectExternalId: IoTs.string
});

export class WeightMeasurementCodec implements ICodec<MeasurementOf<WeightUnits>> {

   decode(data: any): any {
      return decodeWith(weightMeasurementIoType)(data);
   }

   encode(data: MeasurementOf<WeightUnits>): any {
      var memento: MeasurementMementoOf<WeightUnits> = data.memento();

      return encodeWith(weightMeasurementIoType)(memento);
   }

   tryCreateFrom(data: any): MeasurementOf<WeightUnits> {
      let temp = this.decode(data); // If types dont match an exception will be thrown here

      return new MeasurementOf<WeightUnits>(temp);
   }
}

// weightMeasurements (plural) Codec
// ==========

export const weightMeasurementsIoType = IoTs.array(weightMeasurementIoType);

export class WeightMeasurementsCodec implements ICodec<Array<MeasurementOf<WeightUnits>>> {

   decode(data: any): any {
      return decodeWith(weightMeasurementsIoType)(data);
   }

   encode(data: Array<MeasurementOf<WeightUnits>>): any {
      var i: number;
      var mementos: Array<MeasurementMementoOf<WeightUnits>> = new Array<MeasurementMementoOf<WeightUnits>>();

      for (i = 0; i < data.length; i++) {
         mementos[i] = data[i].memento();
      }
      return encodeWith(weightMeasurementsIoType)(mementos);
   }

   tryCreateFrom(data: any): Array<MeasurementOf<WeightUnits>> {

      var i: number;
      var measurements: Array<MeasurementOf<WeightUnits>> = new Array<MeasurementOf<WeightUnits>>();

      for (i = 0; i < data.length; i++) {

         let temp = this.decode(data[i]); // If types dont match an exception will be thrown here

         measurements[i] = new MeasurementOf<WeightUnits>(temp);
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

export class TimeMeasurementTypeCodec implements ICodec<MeasurementTypeOf<TimeUnits>> {

   decode(data: any): any {
      return decodeWith(timeMeasurementTypeIoType)(data);
   }

   encode(data: MeasurementTypeOf<TimeUnits>): any {
      var memento: MeasurementTypeMementoOf<TimeUnits> = data.memento();

      return encodeWith(timeMeasurementTypeIoType)(memento);
   }

   tryCreateFrom(data: any): MeasurementTypeOf<TimeUnits> {
      let temp = this.decode(data); // If types dont match an exception will be thrown here

      return new MeasurementTypeOf<TimeUnits>(temp);
   }
}

// TimeMeasurement Codec
// ==========

export const timeMeasurementIoType = IoTs.type({
   _persistenceDetails: persistenceDetailsIoType,
   _quantity: timeQuantityIoType,
   _repeats: IoTs.number,
   _cohortPeriod: IoTs.number,
   _measurementType: timeMeasurementTypeIoType,
   _subjectExternalId: IoTs.string
});

export class TimeMeasurementCodec implements ICodec<MeasurementOf<TimeUnits>> {

   decode(data: any): any {
      return decodeWith(timeMeasurementIoType)(data);
   }

   encode(data: MeasurementOf<TimeUnits>): any {
      var memento: MeasurementMementoOf<TimeUnits> = data.memento();

      return encodeWith(timeMeasurementIoType)(memento);
   }

   tryCreateFrom(data: any): MeasurementOf<TimeUnits> {
      let temp = this.decode(data); // If types dont match an exception will be thrown here

      return new MeasurementOf<TimeUnits>(temp);
   }
}