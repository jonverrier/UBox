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

   static createXFitDulwichDetailsErr(): PersonaDetails {

      return new PersonaDetails("XFit Dulwich - Error Paths", "https://xfit.thumbnails.com");
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

      return new Person(PersistenceDetails.newPersistenceDetails(),
                        new PersonaDetails ("Joe", "https://joe.thumbnails.com"),
         "Joe@mail.com", roles);
   }

   static createJoeMember2(): Person {
      let roles = new Roles(new Array<ERoleType>(ERoleType.Member));

      return new Person(PersistenceDetails.newPersistenceDetails(),
            new PersonaDetails("Joe2", "https://joe2.thumbnails.com"),
         "Joe2@mail.com", roles);
   }

   static createJoeCoachMember(): Person {
      let roles = new Roles([ERoleType.Member, ERoleType.Coach]);

      return new Person(PersistenceDetails.newPersistenceDetails(),
            new PersonaDetails("Joe", "https://joe.thumbnails.com"),
         "Joe@mail.com", roles);
   }

   static createMeForInsert (): Person {
      let roles = new Roles(new Array<ERoleType>(ERoleType.Member, ERoleType.Coach));

      return new Person(
         PersistenceDetails.newPersistenceDetails(),
         new PersonaDetails("Jon V", "https://jonv.pics.com"),
         "jonathanverrier@hotmail.com",
         roles);
   }

   static createHarryForInsert(): Person {
      let roles = new Roles(new Array<ERoleType>(ERoleType.Member));

      return new Person(
         PersistenceDetails.newPersistenceDetails(),
         new PersonaDetails("Harry V", "https://harryv.pics.com"),
         "madeupmailforharry@gmail.com",
         roles);
   }

   static createAlexForInsert(): Person {
      let roles = new Roles(new Array<ERoleType>(ERoleType.Member));

      return new Person(
         PersistenceDetails.newPersistenceDetails(),
         new PersonaDetails("Alex V", "https://alexv.pics.com"),
         "madeupmailforalexvy@gmail.com",
         roles);
   }

   static createJoeForInsertRIError (): Person {
      let roles = new Roles(new Array<ERoleType>(ERoleType.Member));

      return new Person(new PersistenceDetails("61af3bcd0f1b01355cc36f2c", 0, 0),
         new PersonaDetails("Joe", "https://joe.thumbnails.com"),
         "Joe@mail.com", roles);
   }

   static createJoeForInsert(): Person {
      let roles = new Roles(new Array<ERoleType>(ERoleType.Member));

      return new Person(PersistenceDetails.newPersistenceDetails(),
         new PersonaDetails("Joe", "https://joe.thumbnails.com"),
         "Joe@mail.com", roles);
   }
}

