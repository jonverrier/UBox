/*! Copyright TXPCo, 2020, 2021 */


import * as T from 'io-ts';
import * as E from "fp-ts/Either";
import { failure } from "io-ts/PathReporter";
import { pipe } from "fp-ts/pipeable";

import { InvalidFormatError } from './error';

export const decodeWith = <
   ApplicationType = any,
   EncodeTo = ApplicationType,
   DecodeFrom = unknown
>(
   codec: T.Type<ApplicationType, EncodeTo, DecodeFrom>
) => (input: DecodeFrom): ApplicationType =>
      pipe(
         codec.decode(input),
         E.getOrElseW((errors) => {
            throw new InvalidFormatError (failure(errors).join("\n"));
         })
      );

export const encodeWith = <
   ApplicationType = any,
   EncodeTo = ApplicationType,
   DecodeFrom = unknown
>(
   codec: T.Type<ApplicationType, EncodeTo, DecodeFrom>
) => (input: ApplicationType): any => {
   return codec.encode(input);
   }

// EnumType Class
export class EnumType<A> extends T.Type<A> {
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
         (u, c) => (this.is(u) ? T.success(u) : T.failure(u, c)),
         T.identity,
      )
      this.enumObject = e
   }
}

// simple helper function
export const createEnumType = <T>(e: object, name?: string) => new EnumType<T>(e, name)
