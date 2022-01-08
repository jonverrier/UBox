/*! Copyright TXPCo, 2020, 2021 */

import * as IoTs from 'io-ts';

import { CohortsPresenter, CohortsPresenterMemento} from './CohortsPresenter';
import { decodeWith, encodeWith, ICodec } from './IOCommon';
import { personaIoType, personasIoType} from './IOPersona';

// Rule summary for a Persistent Object: 
// - derives from IPersistence, which contains a PersistentDetails member object. 
// - can save itself to a Memento object, which contains internal state. 
// - has a Codec class, which can transform to and from the Memento format. 
// - Memento versions are transmitted over the wire, and stored in the database.

// CohortsPresenter Codec
// ==========

const cohortsPresenterIoType = IoTs.type({
   _persona: personaIoType,
   _isAdministrator: IoTs.boolean,
   _cohorts: personasIoType,
});

export class CohortsPresenterCodec implements ICodec<CohortsPresenter> {

   decode(data: any): any {
      return decodeWith(cohortsPresenterIoType)(data);
   }

   encode(data: CohortsPresenter): any {
      return encodeWith(cohortsPresenterIoType)(data.memento());
   }

   tryCreateFrom(data: any): CohortsPresenter {

      let temp: CohortsPresenterMemento = this.decode (data); // If types dont match an exception will be thrown here

      return new CohortsPresenter(temp);
   }
}

