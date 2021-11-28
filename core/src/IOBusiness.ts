/*! Copyright TXPCo, 2020, 2021 */

import { Business } from "./Business";
import { decodeWith, encodeWith, ICodec, persistenceDetailsIoType} from '../src/IOCommon';
import { personaIoType} from '../src/IOPersona';
import { personIoType, } from '../src/IOPerson';

import * as IoTs from 'io-ts';

// Rule summary for a Persistent Object: 
// - derives from IPersistence, which contains a PersistentDetails member object. 
// - can save itself to a Memento object, which contains internal state. 
// - has a Codec class, which can transform to and from the Memento format. 
// - Memento versions are transmitted over the wire, and stored in the database.


// Business Codec
// ==========

export const businessIoType = IoTs.type({
   _persistenceDetails: persistenceDetailsIoType,
   _persona: personaIoType,
   _administrators: IoTs.array(personIoType),
   _members: IoTs.array(personIoType),
});

export class BusinessCodec implements ICodec<Business> {

   decode(data: any): any {

      return decodeWith(businessIoType)(data);
   }

   encode(data: Business): any {
      return encodeWith(businessIoType)(data.memento());
   }

   tryCreateFrom(data: any): Business {

      let temp = this.decode (data); // If types dont match an exception will be thrown here

      return new Business(temp);
   }
}
