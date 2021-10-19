/*! Copyright TXPCo, 2020, 2021 */

import { Url, Name} from "./Party";
import { LoginDetails, EmailAddress, Roles, Person, PersonMemento, ERoleType, ELoginProvider } from "./Person";
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

      return new Person(temp);
   }
}

// People Codec
// ==========

export const peopleIoType = IoTs.array(personIoType);

export class PeopleCodec implements ICodec<Array<Person>> {

   decode(data: any): any {

      return decodeWith(peopleIoType)(data);
   }

   encode(data: Array<Person>): any {
      var i: number;
      var mementos: Array<PersonMemento> = new Array<PersonMemento>();

      for (i = 0; i < data.length; i++) {
         mementos[i] = data[i].memento();
      }
      return encodeWith(peopleIoType)(mementos);
   }

   tryCreateFrom(data: any): Array<Person> {

      var i: number;
      var people: Array<Person> = new Array<Person>();

      for (i = 0; i < data.length; i++) {

         let temp = this.decode(data[i]); // If types dont match an exception will be thrown here

         people[i] = new Person(temp); 
      }

      return people;
   }
}