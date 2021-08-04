/*! Copyright TXPCo, 2020, 2021 */


import * as IoTs from 'io-ts';
import * as E from "fp-ts/Either";
import { failure } from "io-ts/PathReporter";
import { pipe } from "fp-ts/pipeable";

import { PersistenceDetails } from './Persistence';
import { InvalidFormatError } from './error';

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
const persistenceCodecType = IoTs.type({
   id: IoTs.any, // name must be non-null
   schemaVersion: IoTs.number,
   sequenceNumber: IoTs.number
});

export class PersistenceDetailsCodec implements ICodec<PersistenceDetails> {

   decode(data: any): any {
      return decodeWith(persistenceCodecType)(data);
   }

   encode(data: PersistenceDetails): any {
      return encodeWith(persistenceCodecType)(data);
   }

   tryCreateFrom(data: any): PersistenceDetails  {
      let temp = decodeWith(persistenceCodecType)(data); // If types dont match an exception will be thrown here
      return new PersistenceDetails(temp.id, temp.schemaVersion, temp.sequenceNumber);
   }
}