/*! Copyright TXPCo, 2020, 2021 */

import { Persona, PersonaMemento} from "./Persona";
import { decodeWith, encodeWith, createEnumType, ICodec, persistenceDetailsIoType} from '../src/IOCommon';

import * as IoTs from 'io-ts';

// Rule summary for a Persistent Object: 
// - derives from IPersistence, which contains a PersistentDetails member object. 
// - can save itself to a Memento object, which contains internal state. 
// - has a Codec class, which can transform to and from the Memento format. 
// - Memento versions are transmitted over the wire, and stored in the database.

// Persona Codec
// ==========

// PersonaDetails Codec
// ==========

export const personaDetailsIoType = IoTs.type({
   _name: IoTs.string,
   _thumbnailUrl: IoTs.string,
   _bio: IoTs.string
})

export const personaIoType = IoTs.type({
   _persistenceDetails: persistenceDetailsIoType,
   _personaDetails: personaDetailsIoType
});

export class PersonaCodec implements ICodec<Persona> {

   decode(data: any): any {
      return decodeWith(personaIoType)(data);
   }

   encode(data: Persona): any {
      return encodeWith(personaIoType)(data.memento());
   }

   tryCreateFrom(data: any): Persona {
      let temp = this.decode(data); // If types dont match an exception will be thrown here
      return new Persona(temp);
   }
}

// Personas Codec
// ==========

export const personasIoType = IoTs.array(personaIoType);

export class PersonasCodec implements ICodec<Array<Persona>> {

   decode(data: any): any {

      return decodeWith(personasIoType)(data);
   }

   encode(data: Array<Persona>): any {
      var i: number;
      var mementos: Array<PersonaMemento> = new Array<PersonaMemento>();

      for (i = 0; i < data.length; i++) {
         mementos[i] = data[i].memento();
      }
      return encodeWith(personasIoType)(mementos);
   }

   tryCreateFrom(data: any): Array<Persona> {

      var i: number;
      var people: Array<Persona> = new Array<Persona>(data.length);
      let temp = this.decode(data); // If types dont match an exception will be thrown here

      for (i = 0; i < temp.length; i++) {

         people[i] = new Persona(temp[i]);
      }

      return people;
   }
}