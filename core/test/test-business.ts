'use strict';
// Copyright TXPCo ltd, 2021
import { PersistenceDetails } from "../src/Persistence";
import { Url, Name, Persona } from "../src/Persona";
import { EmailAddress, Person } from '../src/Person';
import { Business, BusinessMemento } from '../src/Business';


var expect = require("chai").expect;


describe("Business", function () {
   let business1: Business, business2: Business;
   let url: Url = new Url("https://jo.pics.com", false);
   let initialName: Name = new Name("CrossFit Dulwich");
   let newName: Name = new Name("CrossFit Dulwich Garden Extension");

   let person = new Person(new PersistenceDetails(1, 1, 1),
      new Persona(new Name("Joe"), url),
      new EmailAddress("Joe@mail.com", true),
      null);

   let person2 = new Person(new PersistenceDetails(1, 1, 1),
      new Persona(new Name("Jenny"), url),
      new EmailAddress("Jenny@mail.com", true),
      null);

   beforeEach(function () {

      let people = new Array<Person>();
      people.push(person);

      business1 = new Business(new PersistenceDetails("id", 1, 1),
         new Persona (initialName, url),
         people,
         people);

      business2 = new Business(new PersistenceDetails("id2", 1, 1),
         new Persona(initialName, url),
         people, people);
   });
   
   it("Needs to compare for equality and inequality", function () {
      
      expect(business1.equals(business1)).to.equal(true);
      expect(business1.equals(business2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {

      expect(business1.persona.name.equals(initialName)).to.equal(true);
      expect(business1.persona.thumbnailUrl.equals(url)).to.equal(true);
      expect(Person.areEqual(business1.administrators, business2.administrators)).to.equal(true);
      expect(Person.areEqual(business1.members, business2.members)).to.equal(true);
   });

   it("Needs to correctly change attributes", function () {

      let newUrl: Url = new Url("https://newjo.pics.com", false);

      let people = new Array<Person>();
      people.push(person2);

      business1.persona = new Persona(newName, newUrl);
      business1.administrators = people;
      business1.members = people;

      expect(business1.persona.name.equals(newName)).to.equal(true);
      expect(business1.persona.thumbnailUrl.equals(newUrl)).to.equal(true);
      expect(Person.areEqual(business1.administrators, people)).to.equal(true);
      expect(Person.areEqual(business1.members, people)).to.equal(true);
   });

   it("Needs to test membership", function () {

      expect(business1.includesAdministrator(person)).to.equal(true);
      expect(business1.includesAdministrator(person2)).to.equal(false);
      expect(business1.includesAdministratorEmail(person.email)).to.equal(true);
      expect(business1.includesAdministratorEmail(person2.email)).to.equal(false);

      expect(business1.includesMember(person)).to.equal(true);
      expect(business1.includesMember(person2)).to.equal(false);
      expect(business1.includesMemberEmail(person.email)).to.equal(true);
      expect(business1.includesMemberEmail(person2.email)).to.equal(false);
   });

   it("Needs to convert to and from memento()", function () {

      let memento: BusinessMemento = business1.memento();
      let newBusiness = new Business (memento);

      expect(business1.equals(newBusiness)).to.equal(true);
   });
});

