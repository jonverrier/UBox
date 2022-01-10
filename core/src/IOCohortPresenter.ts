/*! Copyright TXPCo, 2020, 2021 */

import * as IoTs from 'io-ts';

import { CohortPresenter, CohortPresenterMemento} from './CohortPresenter';
import { decodeWith, encodeWith, ICodec } from './IOCommon';
import { personaIoType, personasIoType} from './IOPersona';
import { cohortIoType } from './IOCohort';
import { measurementsIoType } from './IOObservation';

// Rule summary for a Persistent Object: 
// - derives from IPersistence, which contains a PersistentDetails member object. 
// - can save itself to a Memento object, which contains internal state. 
// - has a Codec class, which can transform to and from the Memento format. 
// - Memento versions are transmitted over the wire, and stored in the database.

// CohortsPresenter Codec
// ==========

const cohortPresenterIoType = IoTs.type({
   _persona: personaIoType,
   _isAdministrator: IoTs.boolean,
   _cohort: cohortIoType,
   _measurements: measurementsIoType
});

export class CohortPresenterCodec implements ICodec<CohortPresenter> {

   decode(data: any): any {
      return decodeWith(cohortPresenterIoType)(data);
   }

   encode(data: CohortPresenter): any {
      return encodeWith(cohortPresenterIoType)(data.memento());
   }

   tryCreateFrom(data: any): CohortPresenter {

      let temp: CohortPresenterMemento = this.decode (data); // If types dont match an exception will be thrown here

      return new CohortPresenter(temp);
   }
}

