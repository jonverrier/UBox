/*! Copyright TXPCo, 2020, 2021 */

import { InvalidUnitError } from './CoreError';
import { EBaseUnitDimension } from './Unit';
import { EMeasurementType, EPositiveTrend, MeasurementType, MeasurementTypeMemento} from "./ObservationType";
import { MeasurementTypes } from "./ObservationTypeDictionary";
import { Measurement, MeasurementMemento } from "./Observation";
import { decodeWith, encodeWith, createEnumType, ICodec, persistenceDetailsIoType } from '../src/IOCommon';

import * as IoTs from 'io-ts';

// Rule summary for a Persistent Object: 
// - derives from IPersistence, which contains a PersistentDetails member object. 
// - can save itself to a Memento object, which contains internal state. 
// - has a Codec class, which can transform to and from the Memento format. 
// - Memento versions are transmitted over the wire, and stored in the database.

// Quantity Codecs
// ==========
const unitIoType = IoTs.type({
   _dimension: IoTs.string,
   _name: IoTs.string
});

const quantityIoType = IoTs.type({
   _amount: IoTs.number,
   _unit: unitIoType
});

const rangeIoType = IoTs.type({
   _lo: quantityIoType,
   _loInclEq: IoTs.boolean,
   _hi: quantityIoType,
   _hiInclEq: IoTs.boolean,
});


// MeasurementType Codec
// ==========

export const measurementTypeIoType = IoTs.type({
   _measurementType: createEnumType<EMeasurementType>(EMeasurementType, 'EMeasurementType'),
   _unitType: createEnumType<EBaseUnitDimension>(EBaseUnitDimension, 'EBaseUnitDimension'),
   _range: rangeIoType,
   _trend: createEnumType<EPositiveTrend>(EPositiveTrend, 'EPositiveTrend')
});

export class MeasurementTypeCodec implements ICodec<MeasurementType> {

   decode(data: any): any {
      return decodeWith(measurementTypeIoType)(data);
   }

   encode(data: MeasurementType): any {
      var memento: MeasurementTypeMemento = data.memento();

      return encodeWith(measurementTypeIoType)(memento);
   }

   tryCreateFrom(data: any): MeasurementType {
      let temp = this.decode (data); // If types dont match an exception will be thrown here

      if (!(MeasurementType.isAllowedMeasurementUnitType(temp._unitType)))
         throw new InvalidUnitError("Expected valid unit type.");

      return new MeasurementType(temp);
   }
}

// Measurement Codec
// ==========

export const measurementIoType = IoTs.type({
   _persistenceDetails: persistenceDetailsIoType,
   _quantity: quantityIoType,
   _repeats: IoTs.number,
   _timestamp: IoTs.number,
   _measurementType: IoTs.string,
   _subjectKey: IoTs.string,
   _cohortKey: IoTs.string
});

export class MeasurementCodec implements ICodec<Measurement> {

   decode(data: any): any {
      return decodeWith(measurementIoType)(data);
   }

   encode(data: Measurement): any {
      var memento: MeasurementMemento = data.memento();

      return encodeWith(measurementIoType)(memento);
   }

   tryCreateFrom(data: any): Measurement {

      let temp: MeasurementMemento = this.decode(data); // If types dont match an exception will be thrown here
      let dictionary: MeasurementTypes = new MeasurementTypes();

      // for later - can this be moved to the IoTS type ?
      if (!dictionary.isValid (temp._measurementType))
         throw new InvalidUnitError("Expected valid measurement type.");

      return new Measurement(temp);
   }
}


// measurements (plural) Codec
// ==========

export const measurementsIoType = IoTs.array(measurementIoType);

export class MeasurementsCodec implements ICodec<Array<Measurement>> {

   decode(data: any): any {
      return decodeWith(measurementsIoType)(data);
   }

   encode(data: Array<Measurement>): any {
      var i: number;
      var mementos: Array<MeasurementMemento> =
         new Array<MeasurementMemento>();

      for (i = 0; i < data.length; i++) {
         mementos[i] = data[i].memento();
      }
      return encodeWith(measurementsIoType)(mementos);
   }

   tryCreateFrom(data: any): Array<Measurement> {

      var i: number;
      var measurements: Array<Measurement> = new Array<Measurement>();
      let temp: Array<MeasurementMemento> = this.decode(data); // If types dont match an exception will be thrown here

      let measurementTypes: MeasurementTypes = new MeasurementTypes();

      for (i = 0; i < temp.length; i++) {

         if (measurementTypes.isValid(temp[i]._measurementType)) {
            measurements[i] = new Measurement(temp[i]);
         } else {
            throw new InvalidUnitError("Expected valid measurement type.");
         }
      }

      return measurements;
   }
}