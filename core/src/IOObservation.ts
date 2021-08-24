/*! Copyright TXPCo, 2020, 2021 */

import { InvalidUnitError } from './CoreError';
import { WeightUnits, EWeightUnits, TimeUnits, ETimeUnits, ERepUnits} from './Quantity';
import { EMeasurementType, EMeasurementUnitType, EPositiveTrend, MeasurementUnitType, MeasurementTypeOf, MeasurementTypeMementoOf, MeasurementOf, MeasurementMementoOf} from "./Observation";
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
   _unitType: createEnumType<EMeasurementUnitType>(EMeasurementUnitType, 'EMeasurementUnitType'),
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
   _subjectKey: IoTs.string
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

      let temp: MeasurementMementoOf<WeightUnits> = this.decode(data); // If types dont match an exception will be thrown here

      // for later - can this be moved to the IO type ?
      if (! MeasurementUnitType.isWeightUnitType (temp._measurementType._unitType))
         throw new InvalidUnitError("Expected weight unit type.");

      return new MeasurementOf<WeightUnits>(temp);
   }
}

// TimeMeasurementType Codec
// ==========

export const timeMeasurementTypeIoType = IoTs.type({
   _measurementType: createEnumType<EMeasurementType>(EMeasurementType, 'EMeasurementType'),
   _unitType: createEnumType<EMeasurementUnitType>(EMeasurementUnitType, 'EMeasurementUnitType'),
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

      let temp: MeasurementTypeMementoOf<TimeUnits> = this.decode(data); // If types dont match an exception will be thrown here

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
   _subjectKey: IoTs.string
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

      let temp:MeasurementMementoOf<TimeUnits> = this.decode(data); // If types dont match an exception will be thrown here

      // for later - can this be moved to the IO type ?
      if (!MeasurementUnitType.isTimeUnitType(temp._measurementType._unitType))
         throw new InvalidUnitError("Expected time unit type.");

      return new MeasurementOf<TimeUnits>(temp);
   }
}

// measurements (plural) Codec
// ==========

export const measurementsIoType = IoTs.array(IoTs.union ([weightMeasurementIoType, timeMeasurementIoType]));

export class MeasurementsCodec implements ICodec<Array<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits>>> {

   decode(data: any): any {
      return decodeWith(measurementsIoType)(data);
   }

   encode(data: Array<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits>>): any {
      var i: number;
      var mementos: Array<MeasurementMementoOf<WeightUnits> | MeasurementMementoOf<TimeUnits>> =
         new Array<MeasurementMementoOf<WeightUnits> | MeasurementMementoOf<TimeUnits>>();

      for (i = 0; i < data.length; i++) {
         mementos[i] = data[i].memento();
      }
      return encodeWith(measurementsIoType)(mementos);
   }

   tryCreateFrom(data: any): Array<MeasurementOf<WeightUnits>> {

      var i: number;
      var measurements: Array<MeasurementOf<WeightUnits>> = new Array<MeasurementOf<WeightUnits>>();
      let temp: Array<MeasurementMementoOf<WeightUnits>> = this.decode(data); // If types dont match an exception will be thrown here

      for (i = 0; i < temp.length; i++) {

         if (MeasurementUnitType.isWeightUnitType(temp[i]._measurementType._unitType))
            measurements[i] = new MeasurementOf<WeightUnits>(temp[i]);
         else
            measurements[i] = new MeasurementOf<TimeUnits>(temp[i]);
      }

      return measurements;
   }
}