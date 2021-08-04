/*! Copyright TXPCo, 2020, 2021 */

import { PersistenceDetails } from './Persistence';
import { EmailAddress, Name, Url, Roles, Person, ERoleType } from "./Person";
import { decodeWith, encodeWith, createEnumType, ICodec, PersistenceDetailsCodec} from '../src/IOCommon';

import * as T from 'io-ts';



// Name Codec
// ==========
const nameCodecType = T.type({
   name: T.string, // name must be non-null
   surname: T.union([T.string, T.undefined, T.null])
});

export class NameCodec implements ICodec<Name> {

   decode(data: any): any {
      return decodeWith(nameCodecType)(data); 
   }

   encode(data: Name): any {
      return encodeWith(nameCodecType)(data);
   }

   tryCreateFrom(data: any): Name {
      let temp = decodeWith(nameCodecType)(data); // If types dont match an exception will be thrown here 
      return new Name(temp.name, temp.surname);
   }
}


// Email Codec
// ==========
const emailCodecType = T.type({
   email: T.string, // email must be non-null
   isEmailVerified: T.boolean
});

export class EmailAddressCodec implements ICodec<EmailAddress> {

   decode(data: any): any {
      return decodeWith(emailCodecType)(data);
   }

   encode(data: EmailAddress): any {
      return encodeWith(emailCodecType)(data);
   }

   tryCreateFrom(data: any): EmailAddress {
      let temp = decodeWith(emailCodecType)(data); // If types dont match an exception will be thrown here
      return new EmailAddress(temp.email, temp.isEmailVerified);
   }
}


// Url Codec
// ==========
export const urlCodecType = T.type({
   url: T.string, // URL must be non-null
   isUrlVerified: T.boolean
});

export class UrlCodec implements ICodec<Url> {

   decode(data: any): any {
      return decodeWith(urlCodecType)(data);
   }

   encode(data: Url): any {
      return encodeWith(urlCodecType)(data);
   }

   tryCreateFrom(data: any): Url {
      let temp = decodeWith(urlCodecType)(data); // If types dont match an exception will be thrown here
      return new Url(temp.url, temp.isUrlVerified);
   }
}



// Roles Codec
// ==========

const rolesCodecType = T.type({
   roles: T.union([T.array(createEnumType<ERoleType>(ERoleType, 'ERoleType')),
      T.undefined,
      T.null]) // Either an enum list, or null / undefined
});

export class RolesCodec implements ICodec<Roles> {

   decode(data: any): any {
      return decodeWith(rolesCodecType)(data);
   }

   encode(data: Roles): any {
      return encodeWith(rolesCodecType)(data);
   }

   tryCreateFrom(data: any): Roles {
      let temp = decodeWith(rolesCodecType)(data); // If types dont match an exception will be thrown here
      return new Roles(temp.roles);
   }
}

