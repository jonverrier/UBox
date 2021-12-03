'use strict';
// Copyright TXPCo ltd, 2021
import { PersistenceDetails } from "../src/Persistence";
import { Url, Name, Persona, PersonaDetails } from "../src/Persona";
import { EmailAddress, Roles, ERoleType, Person} from '../src/Person';

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

      return new PersonaDetails(new Name("Joe"), new Url("https://joe.thumbnails.com", false));
   }

   static createJoe2Details(): PersonaDetails {

      return new PersonaDetails(new Name("Joe2"), new Url("https://joe2.thumbnails.com", false));
   }

   static createXFitDulwichDetails(): PersonaDetails {

      return new PersonaDetails(new Name("XFit Dulwich"), new Url("https://xfit.thumbnails.com", false));
   }

   static createOlyLiftDetails(): PersonaDetails {

      return new PersonaDetails(new Name("Olympic Lifting"), new Url("https://xfit.thumbnails.com", false));
   }

   static createPowerLiftDetails(): PersonaDetails {

      return new PersonaDetails(new Name("Power Lifting"), new Url("https://xfit.thumbnails.com", false));
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
                        new PersonaDetails (new Name("Joe"), new Url("https://joe.thumbnails.com", false)),
         new EmailAddress("Joe@mail.com", true), roles);
   }

   static createJoeMember2(): Person {
      let roles = new Roles(new Array<ERoleType>(ERoleType.Member));

      return new Person(new PersistenceDetails("2", 1, 1),
            new PersonaDetails(new Name("Joe2"), new Url("https://joe2.thumbnails.com", false)),
         new EmailAddress("Joe2@mail.com", true), roles);
   }

   static createJoeCoachMember(): Person {
      let roles = new Roles([ERoleType.Member, ERoleType.Coach]);

      return new Person(new PersistenceDetails("1", 1, 1),
            new PersonaDetails(new Name("Joe"), new Url("https://joe.thumbnails.com", false)),
         new EmailAddress("Joe@mail.com", true), roles);
   }

   static createMeForInsert (): Person {
      let roles = new Roles(new Array<ERoleType>(ERoleType.Member));

      return new Person(
         new PersistenceDetails(null, 1, 1),
         new PersonaDetails(new Name("Jon V"), new Url("https://jonv.pics.com", false)),
         new EmailAddress("jonathanverrier@hotmail.com", true),
         new Roles(Array<ERoleType>(ERoleType.Member)));
   }

   static createJoeForInsert(): Person {
      let roles = new Roles(new Array<ERoleType>(ERoleType.Member));

      return new Person(new PersistenceDetails(null, 1, 1),
         new PersonaDetails(new Name("Joe"), new Url("https://joe.thumbnails.com", false)),
         new EmailAddress("Joe@mail.com", true), roles);
   }
}

