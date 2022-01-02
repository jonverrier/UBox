'use strict';
// Copyright TXPCo ltd, 2021
import { Person } from '../src/Person';
import { Persona } from '../src/Persona';
import { Business, BusinessMemento } from '../src/Business';

import { PersistenceTestHelper, PersonaTestHelper, PersonTestHelper } from './testHelpers';

var expect = require("chai").expect;


describe("Business", function () {
   let business1: Business, business2: Business;
   let person: Person; 
   let person2: Person; 

   person = PersonTestHelper.createJoeMember();
   person2 = PersonTestHelper.createJoeMember2();

   let people = new Array<Persona>();
   people.push(person);

   beforeEach(function () {


      business1 = new Business(PersistenceTestHelper.createKey1(),
         PersonaTestHelper.createXFitDulwichDetails(),
         people,
         people);

      business2 = new Business(PersistenceTestHelper.createKey2(),
         PersonaTestHelper.createJoeDetails(),
         people, people);
   });
   
   it("Needs to compare for equality and inequality", function () {
      
      expect(business1.equals(business1)).to.equal(true);
      expect(business1.equals(business2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {

      expect(business1.personaDetails.name === business1.personaDetails.name).to.equal(true);
      expect(business1.personaDetails.thumbnailUrl === business1.personaDetails.thumbnailUrl).to.equal(true);

      expect(business1.personaDetails.name === business2.personaDetails.name).to.equal(false);
      expect(business1.personaDetails.thumbnailUrl === business2.personaDetails.thumbnailUrl).to.equal(false);

      expect(Persona.areEqual(business1.administrators, business2.administrators)).to.equal(true);
      expect(Persona.areEqual(business1.members, business2.members)).to.equal(true);
   });

   it("Needs to correctly change attributes", function () {

       let people = new Array<Persona>();
      people.push(person2);

      business1.administrators = people;
      business1.members = people;

      expect(Persona.areEqual(business1.administrators, people)).to.equal(true);
      expect(Persona.areEqual(business1.members, people)).to.equal(true);
   });

   it("Needs to trap null Adminstrator list", function () {

      var caught: boolean = false;

      try {
         business2 = new Business(PersistenceTestHelper.createKey2(),
            PersonaTestHelper.createJoeDetails(),
            null, people);
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to trap zero length Adminstrator list", function () {

      var caught: boolean = false;

      try {
         business2 = new Business(PersistenceTestHelper.createKey2(),
            PersonaTestHelper.createJoeDetails(),
            new Array<Person>(), people);
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to trap null Member list", function () {

      var caught: boolean = false;

      try {
         business2 = new Business(PersistenceTestHelper.createKey2(),
            PersonaTestHelper.createJoeDetails(),
            people, null);
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to test membership", function () {

      expect(business1.includesAdministrator(person)).to.equal(true);
      expect(business1.includesAdministrator(person2)).to.equal(false);

      expect(business1.includesMember(person)).to.equal(true);
      expect(business1.includesMember(person2)).to.equal(false);
   });

   it("Needs to convert to and from memento()", function () {

      let memento: BusinessMemento = business1.memento();
      let newBusiness = new Business (memento);

      expect(newBusiness.equals(business1)).to.equal(true);
   });
});

