/*! Copyright TXPCo, 2020, 2021 */

import { PersistenceDetails } from './Persistence';
import { LoginDetails, EmailAddress, Url, Name, Roles, Person, ERoleType, ELoginProvider } from "./Person";
import { decodeWith, encodeWith, createEnumType, ICodec, persistenceDetailsIoType} from '../src/IOCommon';

import * as IoTs from 'io-ts';

// Rule summary for a Persistent Object: 
// - derives from IPersistence, which contains a PersistentDetails member object. 
// - can save itself to a Memento object, which contains internal state. 
// - has a Codec class, which can transform to and from the Memento format. 
// - Memento versions are transmitted over the wire, and stored in the database.

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
      let temp = this.decode (data); // If types dont match an exception will be thrown here 
      return new Name(temp._name, temp._surname);
   }
}

// LoginDetails Codec
// ==========
const loginIoType = IoTs.type({
   _provider: createEnumType<ELoginProvider>(ELoginProvider, 'ELoginProvider'),
   _token: IoTs.string // token must be non-null
});

export class LoginDetailsCodec implements ICodec<LoginDetails> {

   decode(data: any): any {
      return decodeWith(loginIoType)(data);
   }

   encode(data: LoginDetails): any {
      return encodeWith(loginIoType)(data.memento());
   }

   tryCreateFrom(data: any): LoginDetails {
      let temp = this.decode (data); // If types dont match an exception will be thrown here
      return new LoginDetails(temp._provider, temp._token);
   }
}

// Email Codec
// ==========
const emailIoType = IoTs.type({
   _email: IoTs.string, // email must be non-null
   _isEmailVerified: IoTs.boolean
});

export class EmailAddressCodec implements ICodec<EmailAddress> {

   decode(data: any): any {
      return decodeWith(emailIoType)(data);
   }

   encode(data: EmailAddress): any {
      return encodeWith(emailIoType)(data.memento());
   }

   tryCreateFrom(data: any): EmailAddress {
      let temp = this.decode(data); // If types dont match an exception will be thrown here
      return new EmailAddress(temp._email, temp._isEmailVerified);
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



// Roles Codec
// ==========

const rolesArrayIoType = IoTs.type({
   _roles: IoTs.union([
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
      return encodeWith(rolesIoType)(data.memento());
   }

   tryCreateFrom(data: any): Roles {
      let temp = this.decode (data); // If types dont match an exception will be thrown here
      return new Roles(temp._roles);
   }
}

// Person Codec
// ==========

export const personIoType = IoTs.type({
   _persistenceDetails: persistenceDetailsIoType,
   _loginDetails: loginIoType,
   _name: nameIoType,
   _email: emailIoType,
   _thumbnailUrl: urlIoType,
   _roles: rolesIoType
});

export class PersonCodec implements ICodec<Person> {

   decode(data: any): any {

      return decodeWith(personIoType)(data);
   }

   encode(data: Person): any {
      return encodeWith(personIoType)(data.memento());
   }

   tryCreateFrom(data: any): Person {

      let temp = this.decode (data); // If types dont match an exception will be thrown here

      return new Person(new PersistenceDetails(temp._persistenceDetails._id, temp._persistenceDetails._schemaVersion, temp._persistenceDetails._sequenceNumber),
         new LoginDetails(temp._loginDetails._provider, temp._loginDetails._token),
         new Name(temp._name._name, temp._name._surname),
         temp._email ? new EmailAddress(temp._email._email, temp._email._isEmailVerified) : null,
         temp._thumbnailUrl ? new Url(temp._thumbnailUrl._url, temp._thumbnailUrl._isUrlVerified) : null,
         temp._roles ? new Roles(temp._roles._roles) : null);
   }
}