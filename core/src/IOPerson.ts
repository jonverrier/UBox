/*! Copyright TXPCo, 2020, 2021 */

import { EmailAddress, Roles, Person, PersonMemento, ERoleType } from "./Person";
import { decodeWith, encodeWith, createEnumType, ICodec, persistenceDetailsIoType} from '../src/IOCommon';
import { personaIoType } from '../src/IOPersona';

import * as IoTs from 'io-ts';

// Rule summary for a Persistent Object:
// - derives from IPersistence, which contains a PersistentDetails member object.
// - can save itself to a Memento object, which contains internal state.
// - has a Codec class, which can transform to and from the Memento format.
// - Memento versions are transmitted over the wire, and stored in the database.


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

const rolesIoType = IoTs.type({
   _roles: IoTs.array(createEnumType<ERoleType>(ERoleType, 'ERoleType')) 
});

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
   _persona: personaIoType,
   _email: emailIoType,
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
      var people: Array<Person> = new Array<Person>(data.length);
      let temp = this.decode(data); // If types dont match an exception will be thrown here

      for (i = 0; i < temp.length; i++) {

         people[i] = new Person(temp[i]); 
      }

      return people;
   }
}