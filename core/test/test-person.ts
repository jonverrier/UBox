'use strict';
// Copyright TXPCo ltd, 2021
import { PersistenceDetails } from "../src/Persistence";
import { Url, Name, UrlMemento, Persona } from "../src/Persona";
import { LoginDetails, EmailAddress, Roles, Person, PersonMemento, IPersonStore, ERoleType, ELoginProvider } from '../src/Person';

var expect = require("chai").expect;

class StubLoader implements IPersonStore {

   person: Person;

   constructor() {
      this.person = new Person(new PersistenceDetails(1, 1, 1),
         new LoginDetails(ELoginProvider.Apple, "123"),
         new Persona(new Name("Joe"), new Url("https://jo.pics.com", false)),
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

describe("Name", function () {
   var name1: Name, name2: Name, name3: Name;

   beforeEach(function () {
      name1 = new Name("Joe");
      name2 = new Name("Bill");
      name3 = new Name("Joe");
   });

   it("Needs to compare for equality and inequality", function () {

      expect(name1.equals(name1)).to.equal(true);
      expect(name1.equals(name2)).to.equal(false);
      expect(name1.equals(name3)).to.equal(true);
   });

   it("Needs to catch invalid name", function () {

      let caught = false;

      try {
         let name4 = new Name("");
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to correctly store attributes", function () {

      expect(name1.displayName).to.equal("Joe");
   });
});

describe("LoginDetails", function () {
   var login1: LoginDetails, login2: LoginDetails, login3: LoginDetails;

   beforeEach(function () {
      login1 = new LoginDetails(ELoginProvider.Apple, "xxx");
      login2 = new LoginDetails(ELoginProvider.Google, "xxx");
      login3 = new LoginDetails(ELoginProvider.Apple, "xxx");
   });

   it("Needs to compare for equality and inequality", function () {

      expect(login1.equals(login1)).to.equal(true);
      expect(login1.equals(login2)).to.equal(false);
      expect(login1.equals(login3)).to.equal(true);
   });

   it("Needs to catch invalid login", function () {

      let caught = false;

      try {
         let name4 = new LoginDetails (ELoginProvider.Apple, "");
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to correctly store attributes", function () {

      expect(login1.provider).to.equal(ELoginProvider.Apple);
      expect(login1.token).to.equal("xxx");
   });
});

describe("Url", function () {
   var url1: Url, url2: Url, url3: Url;

   beforeEach(function () {
      url1 = new Url("https://jo.pics.com", true);
      url2 = new Url("https://jo.pics.com", false);
      url3 = new Url("https://jo.pics.com", false);
   });

   it("Needs to compare for equality and inequality", function () {

      expect(url1.equals(url1)).to.equal(true);
      expect(url1.equals(url2)).to.equal(false);
      expect(url1.equals(url3)).to.equal(false);
   });

   it("Needs to catch invalid url", function () {

      let caught = false;

      try {
         let email4 = new Url("11", false);
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });


   it("Needs to catch empty url", function () {

      let caught = false;

      try {
         let email4 = new Url("", false);
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to correctly store attributes", function () {

      expect(url1.url).to.equal("https://jo.pics.com");
      expect(url1.isUrlVerified).to.equal(true);
   });

   it("Needs to convert to and from memento()", function () {

      let memento:UrlMemento = url1.memento();
      let newUrl = new Url(memento.url, memento.isUrlVerified);

      expect(url1.equals (newUrl)).to.equal(true);
   });
});

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
   var person1: Person, person2: Person;
   
   beforeEach(function () {
      person1 = new Person(new PersistenceDetails(1, 1, 1),
         new LoginDetails(ELoginProvider.Apple, "123"),
         new Persona(new Name("Joe"), new Url("https://jo.pics.com", false)),
         new EmailAddress("Joe@mail.com", true), null);

      person2 = new Person(new PersistenceDetails(1, 1, 1),
         new LoginDetails(ELoginProvider.Apple, "1234"),
         new Persona(new Name("Joe"), new Url("https://jo.pics.com", false)),
         new EmailAddress ("Joe@mail.com", true), null);
   });

   it("Needs to construct with null email", function () {

      let nullperson = new Person(new PersistenceDetails(1, 1, 1),
         new LoginDetails(ELoginProvider.Apple, "1234"),
         new Persona(new Name("Joe"), new Url("https://jo.pics.com", false)),
         null, null);

      expect(nullperson.email).to.equal(null);
      expect(nullperson.equals(nullperson)).to.equal(true);
   });

   it("Needs to construct with null Url ", function () {

      let nullperson = new Person(new PersistenceDetails(1, 1, 1),
         new LoginDetails(ELoginProvider.Apple, "1234"),
         new Persona (new Name("Joe"), null),
         new EmailAddress("Joe@mail.com", true), null);

      expect(nullperson.persona.thumbnailUrl).to.equal(null);
      expect(nullperson.equals(nullperson)).to.equal(true);
   });

   it("Needs to construct with a role list ", function () {

      let roles = new Roles([ERoleType.Member, ERoleType.Coach]);
      let roleperson = new Person(new PersistenceDetails(1, 1, 1),
         new LoginDetails(ELoginProvider.Apple, "1234"),
         new Persona (new Name("Joe"), null),
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
         
      expect(person1.loginDetails.equals(new LoginDetails(ELoginProvider.Apple, "123")) ).to.equal(true);
      expect(person1.persona.name.equals(new Name("Joe"))).to.equal(true);
      expect(person1.email.equals(new EmailAddress("Joe@mail.com", true))).to.equal(true);
      expect(person1.persona.thumbnailUrl.equals(new Url("https://jo.pics.com", false))).to.equal(true);
      expect(person1.roles).to.equal(null);

      expect(person1.memento()._loginDetails._provider === person1.loginDetails.memento()._provider).to.equal(true);
      expect(person1.memento()._persona._name._displayName === person1.persona.memento()._name._displayName).to.equal(true);
      expect(person1.memento()._persona._thumbnailUrl.url === person1.persona.thumbnailUrl.memento().url).to.equal(true);
      expect(person1.memento()._email._email === person1.email.memento()._email).to.equal(true);
      expect(person1.memento()._roles === null
         || Roles.rolesArraysAreEqual(person1.memento()._roles._roles, person1.roles.memento()._roles)).to.equal(true);
   });

   it("Needs to correctly change attributes", function () {

      let newMail = new EmailAddress("new@New.com", false);
      let newUrl = new Url("https://jo.newpics.com", false);
      let newName = new Name("NewJoe");
      let newRoles = new Roles([]);

      person1.email = newMail;
      person1.persona = new Persona(newName, newUrl);
      person1.roles = newRoles;

      expect(person1.email).to.equal(newMail);
      expect(person1.persona.thumbnailUrl).to.equal(newUrl);
      expect(person1.persona.name.equals(newName)).to.equal(true);
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
         storer.save(new Person(new PersistenceDetails(1, 1, 1),
            new LoginDetails(ELoginProvider.Apple, "123"),
            new Persona(new Name("Joe"), new Url("https://jo.pics.com", false)),
            new EmailAddress("Joe@mail.com", true), null));
      } catch {
         caught = true;
      }

      expect(caught).to.equal(false);

   });

});