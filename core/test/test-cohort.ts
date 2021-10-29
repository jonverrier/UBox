'use strict';
// Copyright TXPCo ltd, 2021
import { PersistenceDetails } from "../src/Persistence";
import { Url, Name } from "../src/Party";
import { LoginDetails, EmailAddress, Person, ELoginProvider } from '../src/Person';
import { Business } from '../src/Business';
import { ECohortType, CohortTimePeriod, Cohort, CohortMemento, ECohortPeriod } from '../src/Cohort';


var expect = require("chai").expect;

describe("CohortTimePeriod", function () {
   var period1: CohortTimePeriod, period2: CohortTimePeriod, period3: CohortTimePeriod;
   let now = new Date();
   if (now.getMonth() === 0) // Need month to be > 0 to force validation error
      now.setMonth(1); // january has 31 days so daye cant be invalid

   beforeEach(function () {
      period1 = new CohortTimePeriod(now, ECohortPeriod.Week, 1);
      period2 = new CohortTimePeriod(now, ECohortPeriod.FourWeeks, 1);
      period3 = new CohortTimePeriod(now, ECohortPeriod.Week, 1);
   });

   it("Needs to compare for equality and inequality", function () {

      expect(period1.equals(period1)).to.equal(true);
      expect(period1.equals(period2)).to.equal(false);
      expect(period1.equals(period3)).to.equal(true);
   });

   it("Needs to catch zero period", function () {

      let caught = false;

      try {
         let period4 = new CohortTimePeriod(now, ECohortPeriod.Week, 0);
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });
   it("Needs to catch negative period", function () {

      let caught = false;

      try {
         let period4 = new CohortTimePeriod(now, ECohortPeriod.Week, -1);
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });
   it("Needs to catch invalid year", function () {

      let caught = false;

      try {
         new CohortTimePeriod(new Date(1900, 0), ECohortPeriod.Week, 1);
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });
   it("Needs to catch invalid month", function () {

      let caught = false;

      try {
         let period4 = new CohortTimePeriod(new Date(now.getFullYear(), now.getMonth() -1), ECohortPeriod.Week, 1);
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });
   it("Needs to correctly store attributes", function () {

      expect(period1.startDate).to.equal(now);
      expect(period1.period).to.equal(ECohortPeriod.Week);
      expect(period1.numberOfPeriods).to.equal(1);
   });
});

describe("Cohort", function () {
   let cohort1: Cohort, cohort2: Cohort;
   let period = new CohortTimePeriod(new Date(), ECohortPeriod.Week, 1);

   let person = new Person(new PersistenceDetails(1, 1, 1),
      new LoginDetails(ELoginProvider.Apple, "xxx"),
      new Name("Joe"),
      new EmailAddress("Joe@mail.com", true),
      new Url("https://jo.pics.com", false), null);

   let person2 = new Person(new PersistenceDetails(1, 1, 1),
      new LoginDetails(ELoginProvider.Apple, "xxx"),
      new Name("Jenny"),
      new EmailAddress("Jenny@mail.com", true),
      new Url("https://jo.pics.com", false),
      null);

   let people = new Array<Person>();
   people.push(person);

   let business = new Business(new PersistenceDetails(null, 1, 1),
      new Name("XFit Dulwich"),
      new Url("https://xfit.pics.com", false),
      people);

   beforeEach(function () {


      cohort1 = new Cohort(new PersistenceDetails("id", 1, 1),
         business,
         new Name("Joe"),
         period,
         people,
         ECohortType.OlympicLifting);

      cohort2 = new Cohort(new PersistenceDetails("id", 1, 1),
         business,
         new Name("Bill"),
         period,
         people,
         ECohortType.OlympicLifting);
   });
   
   it("Needs to compare for equality and inequality", function () {
      
      expect(cohort1.equals(cohort1)).to.equal(true);
      expect(cohort1.equals(cohort2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {

      expect(cohort1.name.equals(new Name("Joe"))).to.equal(true);
      expect(cohort1.business.equals(business)).to.equal(true);
      expect(cohort1.period.equals(period)).to.equal(true);
      expect(Person.peopleAreEqual(cohort1.members, cohort2.members)).to.equal(true);
      expect(cohort1.cohortType).to.equal(ECohortType.OlympicLifting);
   });

   it("Needs to correctly change attributes", function () {

      let newName = new Name ("NewJoe");

      let people = new Array<Person>();
      people.push(person2);

      let newPeriod = new CohortTimePeriod(new Date(), ECohortPeriod.Week, 2);

      let newBusiness = new Business(new PersistenceDetails(null, 1, 1),
         new Name("XFit Dulwich2"),
         new Url("https://xfit.pics.com", false),
         people);

      cohort1.business = newBusiness;
      cohort1.name = newName;
      cohort1.members = people;
      cohort1.cohortType = ECohortType.Conditioning;
      cohort1.period = newPeriod;

      expect(cohort1.business.equals(newBusiness)).to.equal(true);
      expect(cohort1.name.equals(newName)).to.equal(true);
      expect(cohort1.period.equals(newPeriod)).to.equal(true);
      expect(Person.peopleAreEqual(cohort1.members, people)).to.equal(true);
      expect(cohort1.cohortType).to.equal(ECohortType.Conditioning);
   });

   it("Needs to test membership", function () {

      expect(cohort1.includesMember(person)).to.equal(true);
      expect(cohort1.includesMember(person2)).to.equal(false);
      expect(cohort1.includesMemberEmail(person.email)).to.equal(true);
      expect(cohort1.includesMemberEmail(person2.email)).to.equal(false);
   });

   it("Needs to convert to and from memento()", function () {

      let memento: CohortMemento = cohort1.memento();
      let newCohort = new Cohort (memento);

      expect(cohort1.equals(newCohort)).to.equal(true);
   });
});

