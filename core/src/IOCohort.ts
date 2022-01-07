/*! Copyright TXPCo, 2020, 2021 */

import * as IoTs from 'io-ts';

import { PersonaDetails } from './Persona';
import { Business } from './Business';
import { ECohortType, Cohort, CohortMemento} from './Cohort';
import { PersistenceDetails } from './Persistence';
import { decodeWith, encodeWith, createEnumType, ICodec, persistenceDetailsIoType } from './IOCommon';
import { personaDetailsIoType} from './IOPersona';
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
   _personaDetails: personaDetailsIoType,
   _business: businessIoType,
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

      let temp: CohortMemento = this.decode (data); // If types dont match an exception will be thrown here

      return new Cohort(new PersistenceDetails(temp._persistenceDetails._key, temp._persistenceDetails._schemaVersion, temp._persistenceDetails._sequenceNumber),
         new PersonaDetails(temp._personaDetails._name, temp._personaDetails._thumbnailUrl, temp._personaDetails._bio),
         new Business (temp._business),
         temp._creationTimestamp,
         temp._cohortType);
   }
}

// Cohorts (plural) Codec
// ==========

export const cohortsIoType = IoTs.array(cohortIoType);

export class CohortsCodec implements ICodec<Array<Cohort>> {

   decode(data: any): any {

      return decodeWith(cohortsIoType)(data);
   }

   encode(data: Array<Cohort>): any {
      var i: number;
      var mementos: Array<CohortMemento> = new Array<CohortMemento>();

      for (i = 0; i < data.length; i++) {
         mementos[i] = data[i].memento();
      }
      return encodeWith(cohortsIoType)(mementos);
   }

   tryCreateFrom(data: any): Array<Cohort> {

      var i: number;
      var cohorts: Array<Cohort> = new Array<Cohort>(data.length);
      let temp = this.decode(data); // If types dont match an exception will be thrown here

      for (i = 0; i < temp.length; i++) {

         cohorts[i] = new Cohort(temp[i]);
      }

      return cohorts;
   }
}