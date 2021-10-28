/*! Copyright TXPCo, 2020, 2021 */

import { Url, Name} from "./Party";
import { decodeWith, encodeWith, createEnumType, ICodec, persistenceDetailsIoType} from '../src/IOCommon';

import * as IoTs from 'io-ts';

// Rule summary for a Persistent Object: 
// - derives from IPersistence, which contains a PersistentDetails member object. 
// - can save itself to a Memento object, which contains internal state. 
// - has a Codec class, which can transform to and from the Memento format. 
// - Memento versions are transmitted over the wire, and stored in the database.

// Name Codec
// ==========
export const nameIoType = IoTs.type({
   _displayName: IoTs.string // name must be non-null
});

export class NameCodec implements ICodec<Name> {

   decode(data: any): any {
      return decodeWith(nameIoType)(data); 
   }

   encode(data: Name): any {
      return encodeWith(nameIoType)(data.memento());
   }

   tryCreateFrom(data: any): Name {
      let temp = this.decode (data); // If types dont match an exception will be thrown here 
      return new Name(temp._displayName);
   }
}

// Url Codec
// ==========
export const urlIoType = IoTs.type({
   _url: IoTs.string, // URL must be non-null
   _isUrlVerified: IoTs.boolean
});

export class UrlCodec implements ICodec<Url> {

   decode(data: any): any {
      return decodeWith(urlIoType)(data);
   }

   encode(data: Url): any {
      return encodeWith(urlIoType)(data.memento());
   }

   tryCreateFrom(data: any): Url {
      let temp = this.decode(data); // If types dont match an exception will be thrown here
      return new Url(temp._url, temp._isUrlVerified);
   }
}

