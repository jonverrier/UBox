/*! Copyright TXPCo, 2020, 2021 */

// Rule summary for a Persistent Object: 
// - derives from IPersistence, which contains a PersistentDetails member object. 
// - can save itself to a Memento object, which contains internal state. 
// - has a Codec class, which can transform to and from the Memento format. 
// - Memento versions are transmitted over the wire, and stored in the database. 

import * as IoTs from 'io-ts';
import * as E from "fp-ts/Either";
import { failure } from "io-ts/PathReporter";
import { pipe } from "fp-ts/pipeable";

import { PersistenceDetails } from './Persistence';
import { InvalidFormatError } from './CoreError';

/**
 * helper class to decode from JSON using a ts-io codec
 */
export const decodeWith = <
   ApplicationType = any,
   EncodeTo = ApplicationType,
   DecodeFrom = unknown
>(
   codec: IoTs.Type<ApplicationType, EncodeTo, DecodeFrom>
) => (input: DecodeFrom): ApplicationType =>
      pipe(
         codec.decode(input),
         E.getOrElseW((errors) => {
            throw new InvalidFormatError (failure(errors).join("\n"));
         })
      );

/**
 * helper class to encode to JSON using a ts-io codec
 */
export const encodeWith = <
   ApplicationType = any,
   EncodeTo = ApplicationType,
   DecodeFrom = unknown
>(
   codec: IoTs.Type<ApplicationType, EncodeTo, DecodeFrom>
) => (input: ApplicationType): any => {
   return codec.encode(input);
   }

// EnumType Class
export class EnumType<A> extends IoTs.Type<A> {
   public readonly _tag: 'EnumType' = 'EnumType'
   public enumObject!: object
   public constructor(e: object, name?: string) {
      super(
         name || 'enum',
         (u): u is A => {
            if (!Object.values(this.enumObject).find((v) => v === u)) {
               return false
            }
            // enum reverse mapping check
            if (typeof (this.enumObject as any)[u as string] === 'number') {
               return false
            }

            return true
         },
         (u, c) => (this.is(u) ? IoTs.success(u) : IoTs.failure(u, c)),
         IoTs.identity,
      )
      this.enumObject = e
   }
}

// simple helper function
export const createEnumType = <T>(e: object, name?: string) => new EnumType<T>(e, name)

/**
 * Interface to define a codec for input & output of classes to and from JSON
 */
export interface ICodec<Target> {
   decode(data: any): any;
   encode(data: Target): any;
   tryCreateFrom(data: any): Target;
}

// Persistence Codec
// ==========
export const persistenceDetailsIoType = IoTs.type({
   _key: IoTs.union([IoTs.null,IoTs.unknown]),
   _schemaVersion: IoTs.number,
   _sequenceNumber: IoTs.number
});

export class PersistenceDetailsCodec implements ICodec<PersistenceDetails> {

   decode(data: any): any {
      return decodeWith(persistenceDetailsIoType)(data);
   }

   encode(data: PersistenceDetails): any {
      return encodeWith(persistenceDetailsIoType)(data.memento());
   }

   tryCreateFrom(data: any): PersistenceDetails  {
      let temp = this.decode (data); // If types dont match an exception will be thrown here
      return new PersistenceDetails(temp._key, temp._schemaVersion, temp._sequenceNumber);
   }
}

// ID List - used to pass an array of parameters as a query string
// ==========
export class IdList {
   public _ids: Array<string>;

   constructor(ids: Array<string>) {
      this._ids = ids;
   }

   equals(list: IdList): boolean {

      var lhs: Array<string> = this._ids;
      var rhs = list._ids;

      // if we have mis-matched false values, return false
      if (lhs && !rhs || !lhs && rhs)
         return false;

      for (var i = 0; i < lhs.length; i++) {
         if (lhs[i] !== rhs[i]) {
            return false;
         }
      }
      return true;
   }
}

// ID List Codec - IDs are sent over wire as a list of strings
// ==========
export const idListIoType = IoTs.type({
   _ids: IoTs.array(IoTs.string)
});

export class IdListCodec implements ICodec<IdList> {

   decode(data: any): any {
      return decodeWith(idListIoType)(data);
   }

   encode(data: IdList): any {
      return encodeWith(idListIoType)(data);
   }

   tryCreateFrom(data: any): IdList {
      let temp = this.decode(data); // If types dont match an exception will be thrown here
      return new IdList (temp);
   }
}