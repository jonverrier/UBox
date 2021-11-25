/*! Copyright TXPCo, 2020, 2021 */

import * as IoTs from 'io-ts';
import * as IoTsTypes from 'io-ts-types';

import { Name } from './Party';
import { Business } from './Business';
import { ECohortType, Cohort } from './Cohort';
import { PersistenceDetails } from './Persistence';
import { decodeWith, encodeWith, createEnumType, ICodec, persistenceDetailsIoType } from './IOCommon';
import { nameIoType } from './IOParty';
import { businessIoType } from './IOBusiness';

// Rule summary for a Persistent Object: 
// - derives from IPersistence, which contains a PersistentDetails member object. 
// - can save itself to a Memento object, which contains internal state. 
// - has a Codec class, which can transform to and from the Memento format. 
// - Memento versions are transmitted over the wire, and stored in the database.


// Cohort Codec
// ==========

const cohortIoType = IoTs.type({
   _persistenceDetails: persistenceDetailsIoType,
   _business: businessIoType,
   _name: nameIoType,
   _creationTimestamp: IoTs.number,
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

      return new Cohort(new PersistenceDetails(temp._persistenceDetails._key, temp._persistenceDetails._schemaVersion, temp._persistenceDetails._sequenceNumber),
         new Business (temp._business),
         new Name(temp._name._displayName),
         temp._creationTimestamp,
         temp._cohortType);
   }
}