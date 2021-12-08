/*! Copyright TXPCo, 2020, 2021 */

import { BusinessMemento, Business } from "./Business";
import { decodeWith, encodeWith, ICodec, persistenceDetailsIoType} from '../src/IOCommon';
import { personaDetailsIoType} from '../src/IOPersona';
import { peopleIoType, } from '../src/IOPerson';

import * as IoTs from 'io-ts';
import { Person } from "./Person";

// Rule summary for a Persistent Object: 
// - derives from IPersistence, which contains a PersistentDetails member object. 
// - can save itself to a Memento object, which contains internal state. 
// - has a Codec class, which can transform to and from the Memento format. 
// - Memento versions are transmitted over the wire, and stored in the database.


// Business Codec
// ==========

export const businessIoType = IoTs.type({
   _persistenceDetails: persistenceDetailsIoType,
   _personaDetails: personaDetailsIoType,
   _administrators: peopleIoType,
   _members: peopleIoType,
});

export class BusinessCodec implements ICodec<Business> {

   decode(data: any): any {

      return decodeWith(businessIoType)(data);
   }

   encode(data: Business): any {
      return encodeWith(businessIoType)(data.memento());
   }

   tryCreateFrom(data: any): Business {

      let temp: BusinessMemento = this.decode(data); // If types dont match an exception will be thrown here

      return new Business(temp);
   }
}

// Businesses (plural) Codec
// ==========

export const businessesIoType = IoTs.array(businessIoType);

export class BusinessesCodec implements ICodec<Array<Business>> {

   decode(data: any): any {

      return decodeWith(businessesIoType)(data);
   }

   encode(data: Array<Business>): any {
      var i: number;
      var mementos: Array<BusinessMemento> = new Array<BusinessMemento>();

      for (i = 0; i < data.length; i++) {
         mementos[i] = data[i].memento();
      }
      return encodeWith(businessesIoType)(mementos);
   }

   tryCreateFrom(data: any): Array<Business> {

      var i: number;
      var businesses: Array<Business> = new Array<Business>(data.length);
      let temp = this.decode(data); // If types dont match an exception will be thrown here

      for (i = 0; i < temp.length; i++) {

         businesses[i] = new Business(temp[i]);
      }

      return businesses;
   }
}