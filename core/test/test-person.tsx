'use strict';
// Copyright TXPCo ltd, 2021
import { EmailAddress, Url, Name, Roles, Person, personArraysAreEqual, IPersonLoader, IPersonStorer, ERoleType } from '../src/Person';

var expect = require("chai").expect;

class StubLoader implements IPersonLoader {
   load(): Person {
      return new Person(1, 1, 1, "123", new Name ("Joe"),
         new EmailAddress("Joe@mail.com", true), new Url("https://jo.pics.com", false), null);
   }
}

class StubStorer implements IPersonStorer {
   save(person: Person) {
   }
}

describe("Name", function () {
   var name1: Name, name2: Name, name3: Name;

   beforeEach(function () {
      name1 = new Name("Joe", "Smith");
      name2 = new Name("Bill");
      name3 = new Name("Joe", "Smith");
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

      expect(name1.name).to.equal("Joe");
      expect(name1.surname).to.equal("Smith");
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
   });
});

describe("Person", function () {
   var person1, person2;
   
   beforeEach(function () {
      person1 = new Person(1, 1, 1, "123", new Name("Joe"),
         new EmailAddress("Joe@mail.com", true), new Url ("https://jo.pics.com", false), null);

      person2 = new Person(1, 1, 1, "1234", new Name("Joe"),
         new EmailAddress ("Joe@mail.com", true), new Url ("https://jo.pics.com", false), null);
   });

   it("Needs to construct with null email", function () {

      let nullperson = new Person(1, 1, 1, "1234", new Name("Joe"),
         null, new Url("https://jo.pics.com", false), null);

      expect(nullperson.email).to.equal(null);
      expect(nullperson.equals(nullperson)).to.equal(true);
   });

   it("Needs to construct with null Url ", function () {

      let nullperson = new Person(1, 1, 1, "1234", new Name("Joe"),
         new EmailAddress("Joe@mail.com", true), null, null);

      expect(nullperson.thumbnailUrl).to.equal(null);
      expect(nullperson.equals(nullperson)).to.equal(true);
   });

   it("Needs to construct with a role list ", function () {

      let roles = new Roles([ERoleType.Member, ERoleType.Coach]);
      let roleperson = new Person(1, 1, 1, "1234", new Name("Joe"),
         new EmailAddress("Joe@mail.com", true), null, roles);

      expect(roleperson.equals(roleperson)).to.equal(true);
      expect(roleperson.hasRole(ERoleType.Member)).to.equal(true);
      expect(roleperson.hasRole(ERoleType.Prospect)).to.equal(false);
   });

   it("Needs to compare for equality and inequality", function () {
      
      expect(person1.equals(person1)).to.equal(true);
      expect(person1.equals(person2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {
         
      expect(person1.externalId).to.equal("123");
      expect(person1.name.equals(new Name("Joe"))).to.equal(true);
      expect(person1.email.equals(new EmailAddress("Joe@mail.com", true))).to.equal(true);
      expect(person1.thumbnailUrl.equals(new Url("https://jo.pics.com", false))).to.equal(true);
      expect(person1.roles).to.equal(null);
   });

   it("Needs to correctly change attributes", function () {

      let newMail = new EmailAddress("new@New.com", false);
      let newUrl = new Url("https://jo.newpics.com", false);
      let newName = new Name("NewJoe");
      let newRoles = new Roles([]);

      person1.email = newMail;
      person1.thumbnailUrl = newUrl;
      person1.name = newName;
      person1.roles = newRoles;

      expect(person1.email).to.equal(newMail);
      expect(person1.thumbnailUrl).to.equal(newUrl);
      expect(person1.name.equals(newName)).to.equal(true);
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

      expect(personArraysAreEqual(people, people)).to.equal(true);
      expect(personArraysAreEqual(people, null)).to.equal(false);
      expect(personArraysAreEqual(null, people)).to.equal(false);
      expect(personArraysAreEqual(people2, people)).to.equal(false);
      expect(personArraysAreEqual(people3, people)).to.equal(false);
   });
});

describe("PersonLoader", function () {

   it("Needs to load a Person.", function () {

      let loader = new StubLoader;

      let person = loader.load();

      expect(person).to.not.equal(null);
   });

});

describe("PersonStorer", function () {

   it("Needs to save a Person.", function () {

      let storer = new StubStorer;
      let caught = false;

      try {
         storer.save(new Person(1, 1, 1, "123", new Name("Joe"),
            new EmailAddress("Joe@mail.com", true), new Url("https://jo.pics.com", false), null));
      } catch {
         caught = true;
      }

      expect(caught).to.equal(false);

   });

});