/*! Copyright TXPCo, 2020, 2021 */

import * as IoTs from 'io-ts';
import * as IoTsTypes from 'io-ts-types';

import { Name } from './Party';
import { Person } from '../src/Person';
import { ECohortType, CohortTimePeriod, ECohortPeriod, Cohort } from './Cohort';
import { PersistenceDetails } from './Persistence';
import { decodeWith, encodeWith, createEnumType, ICodec, persistenceDetailsIoType } from './IOCommon';
import { nameIoType } from './IOParty';
import { personIoType } from './IOPerson';

// Rule summary for a Persistent Object: 
// - derives from IPersistence, which contains a PersistentDetails member object. 
// - can save itself to a Memento object, which contains internal state. 
// - has a Codec class, which can transform to and from the Memento format. 
// - Memento versions are transmitted over the wire, and stored in the database.


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
   _name: nameIoType,
   _period: cohortPeriodIoType,
   _administrators: IoTs.array(personIoType),
   _members: IoTs.array(personIoType),
   _cohortType: createEnumType<ECohortType>(ECohortType, 'ECohortType')
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

      return new Cohort(new PersistenceDetails(temp._persistenceDetails._key, temp._persistenceDetails._schemaVersion, temp._persistenceDetails._sequenceNumber),
         new Name(temp._name._displayName),
         new CohortTimePeriod(new Date(temp._period._startDate), temp._period._period, temp._period._numberOfPeriods),
         administrators,
         members,
         temp._cohortType);
   }
}