'use strict';
// Copyright TXPCo ltd, 2021
import { ETimeUnits, EWeightUnits } from '../src/Quantity';
import { PersistenceDetails } from "../src/Persistence";
import { SnatchMeasurementType, CleanMeasurementType, Row250mMeasurementType, Run100m } from '../src/FitnessObservations'
import { Name, LoginDetails, EmailAddress, Url, Person, personArraysAreEqual, ELoginProvider } from '../src/Person';
import { weightMeasurementTypeArraysAreEqual, timeMeasurementTypeArraysAreEqual, MeasurementTypeOf } from "../src/Observation";
import { CohortName, CohortTimePeriod, Cohort, ECohortPeriod } from '../src/Cohort';


var expect = require("chai").expect;

describe("CohortName", function () {
   var name1: CohortName, name2: CohortName, name3: CohortName;

   beforeEach(function () {
      name1 = new CohortName("Joe");
      name2 = new CohortName("Bill");
      name3 = new CohortName("Joe");
   });

   it("Needs to compare for equality and inequality", function () {

      expect(name1.equals(name1)).to.equal(true);
      expect(name1.equals(name2)).to.equal(false);
      expect(name1.equals(name3)).to.equal(true);
   });

   it("Needs to catch invalid name", function () {

      let caught = false;

      try {
         let name4 = new CohortName("");
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to correctly store attributes", function () {

      expect(name1.name).to.equal("Joe");
   });
});

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
         let period4 = new CohortTimePeriod(new Date(1900, 0), ECohortPeriod.Week, 1);
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
   let cohort1, cohort2;
   let period = new CohortTimePeriod(new Date(), ECohortPeriod.Week, 1);

   let person = new Person(new PersistenceDetails(1, 1, 1),
      new LoginDetails(ELoginProvider.Apple, "xxx"),
      new Name("Joe", null),
      new EmailAddress("Joe@mail.com", true),
      new Url("https://jo.pics.com", false), null);

   let person2 = new Person(new PersistenceDetails(1, 1, 1),
      new LoginDetails(ELoginProvider.Apple, "xxx"),
      new Name("Jenny", null),
      new EmailAddress("Jenny@mail.com", true),
      new Url("https://jo.pics.com", false),
      null);

   beforeEach(function () {
      let weightMeasurement = new SnatchMeasurementType();
      let weightMeasurements = new Array < MeasurementTypeOf<EWeightUnits>>();
      weightMeasurements.push(weightMeasurement);

      let timeMeasurement = new Row250mMeasurementType();
      let timeMeasurements = new Array<MeasurementTypeOf<ETimeUnits>>();
      timeMeasurements.push(timeMeasurement);

      let people = new Array<Person>();
      people.push(person);

      cohort1 = new Cohort(new PersistenceDetails("id", 1, 1),
         new CohortName("Joe"),
         period,
         people,
         people,
         weightMeasurements,
         timeMeasurements);

      cohort2 = new Cohort(new PersistenceDetails("id", 1, 1),
         new CohortName("Bill"),
         period,
         people,
         people,
         weightMeasurements,
         timeMeasurements);
   });
   
   it("Needs to compare for equality and inequality", function () {
      
      expect(cohort1.equals(cohort1)).to.equal(true);
      expect(cohort1.equals(cohort2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {

      expect(cohort1.name.equals(new CohortName("Joe"))).to.equal(true);
      expect(cohort1.period.equals(period)).to.equal(true);
      expect(personArraysAreEqual(cohort1.members, cohort2.members)).to.equal(true);
      expect(personArraysAreEqual(cohort1.administrators, cohort2.members)).to.equal(true);
      expect(weightMeasurementTypeArraysAreEqual(cohort1.weightMeasurements, cohort2.weightMeasurements)).to.equal(true);
      expect(timeMeasurementTypeArraysAreEqual(cohort1.timeMeasurements, cohort2.timeMeasurements)).to.equal(true);
   });

   it("Needs to correctly change attributes", function () {

      let newName = new CohortName ("NewJoe");

      let weightMeasurement = new CleanMeasurementType();
      let weightMeasurements = new Array<MeasurementTypeOf<EWeightUnits>>();
      weightMeasurements.push(weightMeasurement);

      let timeMeasurement = new Run100m();
      let timeMeasurements = new Array<MeasurementTypeOf<ETimeUnits>>();
      timeMeasurements.push(timeMeasurement);

      let people = new Array<Person>();
      people.push(person2);

      let newPeriod = new CohortTimePeriod(new Date(), ECohortPeriod.Week, 2);

      cohort1.name = newName;
      cohort1.members = people;
      cohort1.administrators = people;
      cohort1.weightMeasurements = weightMeasurements;
      cohort1.timeMeasurements = timeMeasurements;
      cohort1.period = newPeriod;

      expect(cohort1.name.equals(newName)).to.equal(true);
      expect(cohort1.period.equals(newPeriod)).to.equal(true);
      expect(personArraysAreEqual(cohort1.members, people)).to.equal(true);
      expect(personArraysAreEqual(cohort1.administrators, people)).to.equal(true);
      expect(weightMeasurementTypeArraysAreEqual(cohort1.weightMeasurements, weightMeasurements)).to.equal(true);
      expect(timeMeasurementTypeArraysAreEqual(cohort1.timeMeasurements, timeMeasurements)).to.equal(true);
   });

   it("Needs to test membership", function () {

      expect(cohort1.includesMember(person)).to.equal(true);
      expect(cohort1.includesAdministrator(person)).to.equal(true);
      expect(cohort1.includesMember(person2)).to.equal(false);
      expect(cohort1.includesAdministrator(person2)).to.equal(false);
      expect(cohort1.includesMemberEmail(person.email)).to.equal(true);
      expect(cohort1.includesAdministratorEmail(person.email)).to.equal(true);
      expect(cohort1.includesMemberEmail(person2.email)).to.equal(false);
      expect(cohort1.includesAdministratorEmail(person2.email)).to.equal(false);
   });
});

