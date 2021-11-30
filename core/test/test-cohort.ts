'use strict';
// Copyright TXPCo ltd, 2021
import { PersistenceDetails } from "../src/Persistence";
import { Url, Name, Persona } from "../src/Persona";
import { EmailAddress, Roles, ERoleType, Person } from '../src/Person';
import { Business } from '../src/Business';
import { ECohortType, Cohort, CohortMemento, ECohortPeriod } from '../src/Cohort';

import { PersistenceTestHelper, PersonaTestHelper, PersonTestHelper } from './testHelpers';

var expect = require("chai").expect;

describe("Cohort", function () {
   let cohort1: Cohort, cohort2: Cohort;
   let period = 1;
   let roles = new Roles(new Array<ERoleType>(ERoleType.Member));

   let person: Person;
   let person2: Person;

   let people: Array<Person>;
   let business: Business;

   beforeEach(function () {

      person = PersonTestHelper.createJoeMember();
      person2 = PersonTestHelper.createJoeMember2();

      people = new Array<Person>();
      people.push(person);

      business = new Business(PersistenceTestHelper.createKey1(),
         PersonaTestHelper.createXFitDulwichDetails(),
         people, people);

      cohort1 = new Cohort(new PersistenceDetails("id", 1, 1),
         business,
         new Name("Joe"),
         period,
         ECohortType.OlympicLifting);
         
      cohort2 = new Cohort(new PersistenceDetails("id", 1, 1),
         business,
         new Name("Bill"),
         period,
         ECohortType.OlympicLifting);
   });
   
   it("Needs to compare for equality and inequality", function () {
      
      expect(cohort1.equals(cohort1)).to.equal(true);
      expect(cohort1.equals(cohort2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {

      expect(cohort1.name.equals(new Name("Joe"))).to.equal(true);
      expect(cohort1.business.equals(business)).to.equal(true);
      expect(cohort1.creationTimestamp === period).to.equal(true);
      expect(cohort1.cohortType).to.equal(ECohortType.OlympicLifting);
   });

   it("Needs to correctly change attributes", function () {

      let newName = new Name ("NewJoe");

      let people = new Array<Person>();
      people.push(person2);

      let newPeriod = 2;

      let newBusiness = new Business(PersistenceTestHelper.createKey1(),
         PersonaTestHelper.createXFitDulwichDetails(),
         people, people);

      cohort1.business = newBusiness;
      cohort1.name = newName;
      cohort1.cohortType = ECohortType.Conditioning;
      cohort1.creationTimestamp = newPeriod;

      expect(cohort1.business.equals(newBusiness)).to.equal(true);
      expect(cohort1.name.equals(newName)).to.equal(true);
      expect(cohort1.creationTimestamp === newPeriod).to.equal(true);
      expect(cohort1.cohortType).to.equal(ECohortType.Conditioning);
   });

   it("Needs to convert to and from memento()", function () {

      let memento: CohortMemento = cohort1.memento();
      let newCohort = new Cohort (memento);

      expect(cohort1.equals(newCohort)).to.equal(true);
   });
});

