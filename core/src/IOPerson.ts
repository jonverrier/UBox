/*! Copyright TXPCo, 2020, 2021 */

import { PersistenceDetails } from './Persistence';
import { LoginDetails, EmailAddress, Url, Name, Roles, Person, ERoleType, ELoginProvider } from "./Person";
import { decodeWith, encodeWith, createEnumType, ICodec, persistenceDetailsIoType} from '../src/IOCommon';

import * as IoTs from 'io-ts';



// Name Codec
// ==========
const nameIoType = IoTs.type({
   _name: IoTs.string, // name must be non-null
   _surname: IoTs.union([IoTs.string, IoTs.undefined, IoTs.null])
});

export class NameCodec implements ICodec<Name> {

   decode(data: any): any {
      return decodeWith(nameIoType)(data); 
   }

   encode(data: Name): any {
      return encodeWith(nameIoType)(data.memento());
   }

   tryCreateFrom(data: any): Name {
      let temp = decodeWith(nameIoType)(data); // If types dont match an exception will be thrown here 
      return new Name(temp._name, temp._surname);
   }
}

// LoginDetails Codec
// ==========
const loginIoType = IoTs.type({
   provider: createEnumType<ELoginProvider>(ELoginProvider, 'ELoginProvider'),
   token: IoTs.string // token must be non-null
});

export class LoginDetailsCodec implements ICodec<LoginDetails> {

   decode(data: any): any {
      return decodeWith(loginIoType)(data);
   }

   encode(data: LoginDetails): any {
      return encodeWith(loginIoType)(data);
   }

   tryCreateFrom(data: any): LoginDetails {
      let temp = decodeWith(loginIoType)(data); // If types dont match an exception will be thrown here
      return new LoginDetails(temp.provider, temp.token);
   }
}

// Email Codec
// ==========
const emailIoType = IoTs.type({
   email: IoTs.string, // email must be non-null
   isEmailVerified: IoTs.boolean
});

export class EmailAddressCodec implements ICodec<EmailAddress> {

   decode(data: any): any {
      return decodeWith(emailIoType)(data);
   }

   encode(data: EmailAddress): any {
      return encodeWith(emailIoType)(data);
   }

   tryCreateFrom(data: any): EmailAddress {
      let temp = decodeWith(emailIoType)(data); // If types dont match an exception will be thrown here
      return new EmailAddress(temp.email, temp.isEmailVerified);
   }
}


// Url Codec
// ==========
export const urlIoType = IoTs.type({
   url: IoTs.string, // URL must be non-null
   isUrlVerified: IoTs.boolean
});

export class UrlCodec implements ICodec<Url> {

   decode(data: any): any {
      return decodeWith(urlIoType)(data);
   }

   encode(data: Url): any {
      return encodeWith(urlIoType)(data);
   }

   tryCreateFrom(data: any): Url {
      let temp = decodeWith(urlIoType)(data); // If types dont match an exception will be thrown here
      return new Url(temp.url, temp.isUrlVerified);
   }
}



// Roles Codec
// ==========

const rolesArrayIoType = IoTs.type({
   roles: IoTs.union([
      IoTs.null,
      IoTs.undefined,
      IoTs.array(createEnumType<ERoleType>(ERoleType, 'ERoleType'))]) // Either an enum list, or null / undefined
});

const rolesIoType = IoTs.union([IoTs.null, IoTs.undefined, rolesArrayIoType]);  // Either an enum list, or null / undefined

export class RolesCodec implements ICodec<Roles> {

   decode(data: any): any {
      return decodeWith(rolesIoType)(data);
   }

   encode(data: Roles): any {
      return encodeWith(rolesIoType)(data);
   }

   tryCreateFrom(data: any): Roles {
      let temp = decodeWith(rolesIoType)(data); // If types dont match an exception will be thrown here
      return new Roles(temp.roles);
   }
}

// Person Codec
// ==========

const personIoType = IoTs.type({
   persistenceDetails: persistenceDetailsIoType,
   loginDetails: loginIoType,
   name: nameIoType,
   email: emailIoType,
   thumbnailUrl: urlIoType,
   roles: rolesIoType
});

export class PersonCodec implements ICodec<Person> {

   decode(data: any): any {

      return decodeWith(personIoType)(data);
   }

   encode(data: Person): any {
      return encodeWith(personIoType)(data.memento());
   }

   tryCreateFrom(data: any): Person {

      let temp = decodeWith(personIoType)(data); // If types dont match an exception will be thrown here

      return new Person(new PersistenceDetails(temp.persistenceDetails.id, temp.persistenceDetails.schemaVersion, temp.persistenceDetails.sequenceNumber),
         new LoginDetails(temp.loginDetails.provider, temp.loginDetails.token),
         new Name(temp.name._name, temp.name._surname),
         temp.email ? new EmailAddress(temp.email.email, temp.email.isEmailVerified) : null,
         temp.thumbnailUrl ? new Url(temp.thumbnailUrl.url, temp.thumbnailUrl.isUrlVerified) : null,
         temp.roles ? new Roles(temp.roles.roles) : null);
   }
}