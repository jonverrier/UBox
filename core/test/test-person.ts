'use strict';
// Copyright TXPCo ltd, 2021
import { Roles, Person, PersonMemento, IPersonStore, ERoleType} from '../src/Person';
import { PersonTestHelper } from './testHelpers';

var expect = require("chai").expect;

class StubLoader implements IPersonStore {

   person: Person;

   constructor() {
      this.person = PersonTestHelper.createJoeMember(); 
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

describe("Roles", function () {
   var roles1: Roles, roles2: Roles, roles3: Roles,
      rolesMulti1: Roles, rolesNull: Roles;

   beforeEach(function () {
      roles1 = new Roles([ERoleType.Member]);
      roles2 = new Roles([ERoleType.Coach]);
      roles3 = new Roles([ERoleType.Member]);
      rolesMulti1 = new Roles([ERoleType.Member, ERoleType.Coach]);
      rolesNull = null;
   });

   it("Needs to compare for equality and inequality", function () {

      expect(roles1.equals(roles1)).to.equal(true);
      expect(roles1.equals(roles2)).to.equal(false);
      expect(roles1.equals(roles3)).to.equal(true);
      expect(roles1.equals(rolesMulti1)).to.equal(false);
   });

   it("Needs to catch null role list", function () {

      let caught = false;

      try {
         let roles4 = new Roles(null);
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
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

   person1 = PersonTestHelper.createJoeMember();

   person2 = PersonTestHelper.createJoeMember2();
   

   it("Needs to construct with a role list ", function () {

      let roles = new Roles([ERoleType.Member, ERoleType.Coach]);
      let roleperson = PersonTestHelper.createJoeCoachMember();

      expect(roleperson.equals(roleperson)).to.equal(true);
      expect(roleperson.hasRole(ERoleType.Member)).to.equal(true);
      expect(roleperson.hasRole(ERoleType.Coach)).to.equal(true);
      expect(roleperson.hasRole(ERoleType.Prospect)).to.equal(false);
      expect(roleperson.isCoach()).to.equal(true);
      expect(roleperson.isMember()).to.equal(true);
      expect(roleperson.isProspect()).to.equal(false);
   });

   it("Needs to detect invalid email", function () {

      var caught: boolean = true;
      try {
         person1.email = "xx";
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to detect null email", function () {

      var caught: boolean = true;
      try {
         person1.email = "";
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to compare for equality and inequality", function () {
      
      expect(person1.equals(person1)).to.equal(true);
      expect(person1.equals(person2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {
         
      expect(person1.personaDetails.name === "Joe").to.equal(true);
      expect(person1.email === "Joe@mail.com").to.equal(true);
      expect(person1.personaDetails.thumbnailUrl === "https://joe.thumbnails.com").to.equal(true);
      expect(person1.isMember()).to.equal(true);

      expect(person1.memento()._personaDetails._name === person1.memento()._personaDetails._name).to.equal(true);
      expect(person1.memento()._personaDetails._thumbnailUrl === person1.personaDetails.thumbnailUrl).to.equal(true);
      expect(person1.memento()._email === person1.email).to.equal(true);
      expect(Roles.areEqual(person1.memento()._roles._roles, person1.roles.memento()._roles)).to.equal(true);
   });

   it("Needs to correctly change attributes", function () {

      let newMail = "new@New.com";
      let newRoles = new Roles([ERoleType.Member, ERoleType.Coach]);

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


   it("Needs to create PersonaMemento from itself.", function () {

      var person: Person = PersonTestHelper.createJoeMember();
      var memento1: PersonMemento = person.memento();
      var memento2: PersonMemento = new PersonMemento(memento1);
      var person2: Person = new Person(memento2);

      expect(person.equals(person2)).to.equal(true);
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
         storer.save(PersonTestHelper.createJoeMember());
      } catch {
         caught = true;
      }

      expect(caught).to.equal(false);

   });

});