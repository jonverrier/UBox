'use strict';
// Copyright TXPCo ltd, 2021
import { PersistenceDetails } from "../src/Persistence";
import { Persona, PersonaDetails } from "../src/Persona";
import { Roles, ERoleType, Person} from '../src/Person';

export class PersistenceTestHelper {

   static createKey1(): PersistenceDetails {

      return new PersistenceDetails("1", 0, 0);
   }

   static createKey2(): PersistenceDetails {

      return new PersistenceDetails("2", 0, 0);
   }
}

export class PersonaTestHelper {


   static createJoeDetails(): PersonaDetails {

      return new PersonaDetails("Joe", "https://joe.thumbnails.com");
   }

   static createJoe2Details(): PersonaDetails {

      return new PersonaDetails("Joe2", "https://joe2.thumbnails.com");
   }

   static createXFitDulwichDetails(): PersonaDetails {

      return new PersonaDetails("XFit Dulwich", "https://xfit.thumbnails.com");
   }

   static createOlyLiftDetails(): PersonaDetails {

      return new PersonaDetails("Olympic Lifting", "https://xfit.thumbnails.com");
   }

   static createPowerLiftDetails(): PersonaDetails {

      return new PersonaDetails("Power Lifting", "https://xfit.thumbnails.com");
   }

   static createJoe(): Persona {

      return new Persona(PersistenceTestHelper.createKey1(), PersonaTestHelper.createJoeDetails());
   }

   static createJoe2(): Persona {

      return new Persona(PersistenceTestHelper.createKey2(), PersonaTestHelper.createJoe2Details());
   }

   static createXFitDulwich(): Persona {

      return new Persona(PersistenceTestHelper.createKey1(), PersonaTestHelper.createXFitDulwichDetails());
   }
}

export class PersonTestHelper {


   static createJoeMember(): Person {
      let roles = new Roles(new Array<ERoleType>(ERoleType.Member));

      return new Person(new PersistenceDetails("1", 1, 1),
                        new PersonaDetails ("Joe", "https://joe.thumbnails.com"),
         "Joe@mail.com", roles);
   }

   static createJoeMember2(): Person {
      let roles = new Roles(new Array<ERoleType>(ERoleType.Member));

      return new Person(new PersistenceDetails("2", 1, 1),
            new PersonaDetails("Joe2", "https://joe2.thumbnails.com"),
         "Joe2@mail.com", roles);
   }

   static createJoeCoachMember(): Person {
      let roles = new Roles([ERoleType.Member, ERoleType.Coach]);

      return new Person(new PersistenceDetails("1", 1, 1),
            new PersonaDetails("Joe", "https://joe.thumbnails.com"),
         "Joe@mail.com", roles);
   }

   static createMeForInsert (): Person {
      let roles = new Roles(new Array<ERoleType>(ERoleType.Member));

      return new Person(
         new PersistenceDetails(null, 1, 1),
         new PersonaDetails("Jon V", "https://jonv.pics.com"),
         "jonathanverrier@hotmail.com",
         new Roles(Array<ERoleType>(ERoleType.Member)));
   }

   static createJoeForInsert(): Person {
      let roles = new Roles(new Array<ERoleType>(ERoleType.Member));

      return new Person(new PersistenceDetails(null, 1, 1),
         new PersonaDetails("Joe", "https://joe.thumbnails.com"),
         "Joe@mail.com", roles);
   }
}

