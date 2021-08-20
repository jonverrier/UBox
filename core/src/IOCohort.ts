/*! Copyright TXPCo, 2020, 2021 */

import * as IoTs from 'io-ts';
import * as IoTsTypes from 'io-ts-types';

import { EWeightUnits, ETimeUnits, QuantityOf } from '../src/Quantity';
import { RangeOf } from '../src/Range';
import { Name, LoginDetails, EmailAddress, Url, Roles, Person } from '../src/Person';
import { MeasurementTypeOf } from '../src/Observation';
import { CohortName, CohortTimePeriod, ECohortPeriod, Cohort } from './Cohort';
import { PersistenceDetails } from './Persistence';
import { decodeWith, encodeWith, createEnumType, ICodec, persistenceDetailsIoType } from './IOCommon';
import { personIoType } from './IOPerson';
import { weightMeasurementTypeIoType, timeMeasurementTypeIoType } from './IOObservation';

// Rule summary for a Persistent Object: 
// - derives from IPersistence, which contains a PersistentDetails member object. 
// - can save itself to a Memento object, which contains internal state. 
// - has a Codec class, which can transform to and from the Memento format. 
// - Memento versions are transmitted over the wire, and stored in the database.

// CohortName Codec
// ==========
const cohortNameIoType = IoTs.type({
   _name: IoTs.string
});

export class CohortNameCodec implements ICodec<CohortName> {

   decode(data: any): any {
      return decodeWith(cohortNameIoType)(data);
   }

   encode(data: CohortName): any {
      return encodeWith(cohortNameIoType)(data.memento());
   }

   tryCreateFrom(data: any): CohortName {
      let temp = this.decode(data); // If types dont match an exception will be thrown here
      return new CohortName(temp._name);
   }
}

// CohortTimePeriod Codec
// ==========
const cohortPeriodIoType = IoTs.type({
   _startDate: IoTs.union ([IoTs.string, IoTsTypes.date]), // Mongoose seems to return dates as a string
   _period: createEnumType<ECohortPeriod>(ECohortPeriod, 'ECohortPeriod'),
   _numberOfPeriods: IoTs.number
});

export class CohortTimePeriodCodec implements ICodec<CohortTimePeriod> {

   decode(data: any): any {
      return decodeWith(cohortPeriodIoType)(data);
   }

   encode(data: CohortTimePeriod): any {
      return encodeWith(cohortPeriodIoType)(data.memento());
   }

   tryCreateFrom(data: any): CohortTimePeriod {
      let temp = this.decode(data); // If types dont match an exception will be thrown here
      return new CohortTimePeriod(temp._startDate, temp._period, temp._numberOfPeriods);
   }
}

// Cohort Codec
// ==========

const cohortIoType = IoTs.type({
   _persistenceDetails: persistenceDetailsIoType,
   _name: cohortNameIoType,
   _period: cohortPeriodIoType,
   _administrators: IoTs.array(personIoType),
   _members: IoTs.array(personIoType),
   _weightMeasurements: IoTs.array( weightMeasurementTypeIoType),
   _timeMeasurements: IoTs.array(timeMeasurementTypeIoType)
});

export class CohortCodec implements ICodec<Cohort> {

   decode(data: any): any {
      return decodeWith(cohortIoType)(data);
   }

   encode(data: Cohort): any {
      return encodeWith(cohortIoType)(data.memento());
   }

   tryCreateFrom(data: any): Cohort {
      let temp = this.decode (data); // If types dont match an exception will be thrown here
      var i: number;

      let administrators = new Array<Person>(temp._administrators.length);
      for (i = 0; i < administrators.length; i++)
         administrators[i] = new Person(temp._administrators[i]);

      let members = new Array<Person>(temp._members.length);
      for (i = 0; i < members.length; i++)
         members[i] = new Person(temp._members[i]);

      let weightMeasurements = new Array<MeasurementTypeOf<EWeightUnits>>(temp._weightMeasurements.length);
      for (i = 0; i < weightMeasurements.length; i++)
         weightMeasurements[i] = new MeasurementTypeOf<EWeightUnits>(temp._weightMeasurements[i]);

      let timeMeasurements = new Array<MeasurementTypeOf<ETimeUnits>>(temp._timeMeasurements.length);
      for (i = 0; i < timeMeasurements.length; i++)
         timeMeasurements[i] = new MeasurementTypeOf<ETimeUnits>(temp._timeMeasurements[i]);     

      return new Cohort(new PersistenceDetails(temp._persistenceDetails._id, temp._persistenceDetails._schemaVersion, temp._persistenceDetails._sequenceNumber),
         new CohortName(temp._name._name),
         new CohortTimePeriod(new Date(temp._period._startDate), temp._period._period, temp._period._numberOfPeriods),
         administrators,
         members,
         weightMeasurements,
         timeMeasurements);
   }
}