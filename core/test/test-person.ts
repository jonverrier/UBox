'use strict';
// Copyright TXPCo ltd, 2021
import { PersistenceDetails } from "../src/Persistence";
import { Url, Name, UrlMemento, Persona } from "../src/Persona";
import { EmailAddress, Roles, Person, PersonMemento, IPersonStore, ERoleType} from '../src/Person';

var expect = require("chai").expect;

class StubLoader implements IPersonStore {

   person: Person;

   constructor() {
      this.person = new Person(
         new Persona(new PersistenceDetails("1", 1, 1), new Name("Joe"), new Url("https://jo.pics.com", false)),
         new EmailAddress("Joe@mail.com", true), null);
   }

   async loadOne(id: any): Promise<Person | null> {
      return this.person;
   }

   async loadMany(ids: Array<string>): Promise<Array<Person>> | null {
      return new Array<Person> (this.person, this.person);
   }

   async save(person: Person): Promise<Person | null> {
      return person;
   }
}

describe("EmailAddress", function () {
   var email1: EmailAddress, email2: EmailAddress, email3: EmailAddress;

   beforeEach(function () {
      email1 = new EmailAddress("Joe@mail.com", true);
      email2 = new EmailAddress("Joe@mail.com", false);
      email3 = new EmailAddress("Joe@mail.com", false);
   });

   it("Needs to compare for equality and inequality", function () {

      expect(email1.equals(email1)).to.equal(true);
      expect(email1.equals(email2)).to.equal(false);
      expect(email1.equals(email3)).to.equal(false);
   });

   it("Needs to catch invalid email address", function () {

      let caught = false;

      try {
         let email4 = new EmailAddress("Joe", false);
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to catch empty email address", function () {

      let caught = false;

      try {
         let email4 = new EmailAddress("", false);
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to correctly store attributes", function () {

      expect(email1.email).to.equal("Joe@mail.com");
      expect(email1.isEmailVerified).to.equal(true);
      expect(email1.memento()._email).to.equal(email1.email);
      expect(email1.memento()._isEmailVerified).to.equal(email1.isEmailVerified);
   });
});

describe("Roles", function () {
   var roles1: Roles, roles2: Roles, roles3: Roles,
      rolesMulti1: Roles, rolesNull: Roles;

   beforeEach(function () {
      roles1 = new Roles([ERoleType.Member]);
      roles2 = new Roles([ERoleType.Coach]);
      roles3 = new Roles([ERoleType.Member]);
      rolesMulti1 = new Roles([ERoleType.Member, ERoleType.Coach]);
      rolesNull = new Roles([]);
   });

   it("Needs to compare for equality and inequality", function () {

      expect(roles1.equals(roles1)).to.equal(true);
      expect(roles1.equals(roles2)).to.equal(false);
      expect(roles1.equals(roles3)).to.equal(true);
      expect(roles1.equals(rolesMulti1)).to.equal(false);
      expect(roles1.equals(rolesNull)).to.equal(false);
   });

   it("Needs to catch invalid role list", function () {

      let caught = false;

      try {
         let roles4 = new Roles(new Array<ERoleType>(ERoleType.Member, ERoleType.Member));
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });


   it("Needs to catch empty role list", function () {

      let caught = false;

      try {
         let roles4 = new Roles (null);
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to correctly store attributes", function () {

      expect(roles1.roles).to.equal(roles1.roles);
      expect(roles1.memento()._roles).to.equal(roles1.roles);
   });
});

describe("Person", function () {
   let roles = new Roles(new Array<ERoleType>(ERoleType.Member));

   var person1: Person, person2: Person;

   person1 = new Person(
      new Persona(new PersistenceDetails("1", 1, 1), new Name("Joe"), new Url("https://jo.pics.com", false)),
      new EmailAddress("Joe@mail.com", true), roles);

   person2 = new Person(
      new Persona(new PersistenceDetails("2", 1, 1), new Name("Joe"), new Url("https://jo.pics.com", false)),
      new EmailAddress("Joe@mail.com", true), roles);
   

   it("Needs to construct with a role list ", function () {

      let roles = new Roles([ERoleType.Member, ERoleType.Coach]);
      let roleperson = new Person(
         new Persona(new PersistenceDetails("1", 1, 1), new Name("Joe"), new Url("https://jo.pics.com", false)),
         new EmailAddress("Joe@mail.com", true), roles);

      expect(roleperson.equals(roleperson)).to.equal(true);
      expect(roleperson.hasRole(ERoleType.Member)).to.equal(true);
      expect(roleperson.hasRole(ERoleType.Prospect)).to.equal(false);
   });

   it("Needs to compare for equality and inequality", function () {
      
      expect(person1.equals(person1)).to.equal(true);
      expect(person1.equals(person2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {
         
      expect(person1.name.equals(new Name("Joe"))).to.equal(true);
      expect(person1.email.equals(new EmailAddress("Joe@mail.com", true))).to.equal(true);
      expect(person1.thumbnailUrl.equals(new Url("https://jo.pics.com", false))).to.equal(true);
      expect(person1.roles).to.equal(roles);

      expect(person1.memento()._persona._name._displayName === person1.memento()._name._displayName).to.equal(true);
      expect(person1.memento()._persona._thumbnailUrl.url === person1.thumbnailUrl.memento().url).to.equal(true);
      expect(person1.memento()._email._email === person1.email.memento()._email).to.equal(true);
      expect(Roles.areEqual(person1.memento()._roles._roles, person1.roles.memento()._roles)).to.equal(true);
   });

   it("Needs to correctly change attributes", function () {

      let newMail = new EmailAddress("new@New.com", false);
      let newUrl = new Url("https://jo.newpics.com", false);
      let newName = new Name("NewJoe");
      let newRoles = new Roles([]);

      person1.email = newMail;
      person1.roles = newRoles;

      expect(person1.email).to.equal(newMail);
      expect(person1.roles.equals(newRoles)).to.equal(true);
   });

   it("Needs to compare arrays", function () {

      let people = new Array<Person>();
      people.push(person1);
      let people2 = new Array<Person>();
      people2.push(person2);
      let people3 = new Array<Person>();
      people3.push(person2);
      people3.push(person2);

      expect(Person.areEqual(people, people)).to.equal(true);
      expect(Person.areEqual(people, null)).to.equal(false);
      expect(Person.areEqual(null, people)).to.equal(false);
      expect(Person.areEqual(people2, people)).to.equal(false);
      expect(Person.areEqual(people3, people)).to.equal(false);
   });

   it("Needs to convert to and from memento()", function () {

      let memento: PersonMemento = person1.memento();
      let newPerson = new Person (memento);

      expect(person1.equals(newPerson)).to.equal(true);
   });

});

describe("PersonLoader", function () {

   it("Needs to load a Person.", function () {

      let loader = new StubLoader;

      let person = loader.loadOne('dummy');

      expect(person).to.not.equal(null);
   });

   it("Needs to load People.", function () {

      let loader = new StubLoader;

      let people = loader.loadMany(new Array<string> ('dummy1', 'dummy2'));

      expect(people).to.not.equal(null);
   });

});

describe("PersonStorer", function () {

   it("Needs to save a Person.", function () {

      let storer = new StubLoader;
      let caught = false;

      try {
         storer.save(new Person(
            new Persona(new PersistenceDetails("1", 1, 1), new Name("Joe"), new Url("https://jo.pics.com", false)),
            new EmailAddress("Joe@mail.com", true), null));
      } catch {
         caught = true;
      }

      expect(caught).to.equal(false);

   });

});