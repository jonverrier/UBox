'use strict';
// Copyright TXPCo ltd, 2021
import { PersistenceDetails } from "../src/Persistence";
import { Url, Name } from "../src/Party";
import { LoginDetails, EmailAddress, Person, ELoginProvider } from '../src/Person';
import { Business, BusinessMemento } from '../src/Business';


var expect = require("chai").expect;


describe("Business", function () {
   let business1: Business, business2: Business;
   let url: Url = new Url("https://jo.pics.com", false);
   let initialName: Name = new Name("CrossFit Dulwich");
   let newName: Name = new Name("CrossFit Dulwich Garden Extension");

   let person = new Person(new PersistenceDetails(1, 1, 1),
      new LoginDetails(ELoginProvider.Apple, "xxx"),
      new Name("Joe"),
      new EmailAddress("Joe@mail.com", true),
      url, null);

   let person2 = new Person(new PersistenceDetails(1, 1, 1),
      new LoginDetails(ELoginProvider.Apple, "xxx"),
      new Name("Jenny"),
      new EmailAddress("Jenny@mail.com", true),
      url,
      null);

   beforeEach(function () {

      let people = new Array<Person>();
      people.push(person);

      business1 = new Business(new PersistenceDetails("id", 1, 1),
         initialName,
         url,
         people);

      business2 = new Business(new PersistenceDetails("id", 1, 1),
         newName,
         url,
         people);
   });
   
   it("Needs to compare for equality and inequality", function () {
      
      expect(business1.equals(business1)).to.equal(true);
      expect(business1.equals(business2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {

      expect(business1.name.equals (initialName)).to.equal(true);
      expect(business1.thumbnailUrl.equals(url)).to.equal(true);
      expect(Person.peopleAreEqual(business1.administrators, business2.administrators)).to.equal(true);
   });

   it("Needs to correctly change attributes", function () {

      let newUrl: Url = new Url("https://newjo.pics.com", false);

      let people = new Array<Person>();
      people.push(person2);

      business1.name = newName;
      business1.thumbnailUrl = newUrl;
      business1.administrators = people;

      expect(business1.name.equals (newName)).to.equal(true);
      expect(business1.thumbnailUrl.equals(newUrl)).to.equal(true);
      expect(Person.peopleAreEqual(business1.administrators, people)).to.equal(true);
   });

   it("Needs to test membership", function () {

      expect(business1.includesAdministrator(person)).to.equal(true);
      expect(business1.includesAdministrator(person2)).to.equal(false);
      expect(business1.includesAdministratorEmail(person.email)).to.equal(true);
      expect(business1.includesAdministratorEmail(person2.email)).to.equal(false);
   });

   it("Needs to convert to and from memento()", function () {

      let memento: BusinessMemento = business1.memento();
      let newBusiness = new Business (memento);

      expect(business1.equals(newBusiness)).to.equal(true);
   });
});

