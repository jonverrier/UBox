'use strict';
// Copyright TXPCo ltd, 2021
import { TimeUnits, WeightUnits } from '../src/Quantity';
import { PersistenceDetails } from "../src/Persistence";
import { Url, Name } from "../src/Party";
import { LoginDetails, EmailAddress, Person, personArraysAreEqual, ELoginProvider } from '../src/Person';
import { MeasurementTypeOf, IMeasurementTypeFactoryFor } from "../src/Observation";
import { SnatchMeasurementType, CleanMeasurementType, Row250mMeasurementType, Run800mMeasurementType } from '../src/FitnessObservations';
import { OlympicLiftMeasurementTypeFactory, SpeedMeasurementTypeFactory } from '../src/ObservationDictionary';
import { ECohortType, CohortName, CohortTimePeriod, Cohort, CohortMemento, ECohortPeriod } from '../src/Cohort';


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
         new CohortName("");
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
   let cohort1:Cohort, cohort2:Cohort;
   let period = new CohortTimePeriod(new Date(), ECohortPeriod.Week, 1);
   let weightFactory: IMeasurementTypeFactoryFor<WeightUnits> = new OlympicLiftMeasurementTypeFactory();
   let timeFactory: IMeasurementTypeFactoryFor<WeightUnits> = new SpeedMeasurementTypeFactory();

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

   beforeEach(function () {
      let weightMeasurement = new SnatchMeasurementType(weightFactory);
      let weightMeasurements = new Array < MeasurementTypeOf<WeightUnits>>();
      weightMeasurements.push(weightMeasurement);

      let timeMeasurement = new Row250mMeasurementType(timeFactory);
      let timeMeasurements = new Array<MeasurementTypeOf<TimeUnits>>();
      timeMeasurements.push(timeMeasurement);

      let people = new Array<Person>();
      people.push(person);

      cohort1 = new Cohort(new PersistenceDetails("id", 1, 1),
         new CohortName("Joe"),
         period,
         people,
         people,
         ECohortType.OlympicLifting);

      cohort2 = new Cohort(new PersistenceDetails("id", 1, 1),
         new CohortName("Bill"),
         period,
         people,
         people,
         ECohortType.OlympicLifting);
   });
   
   it("Needs to compare for equality and inequality", function () {
      
      expect(cohort1.equals(cohort1)).to.equal(true);
      expect(cohort1.equals(cohort2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {

      expect(cohort1.name.equals(new CohortName("Joe"))).to.equal(true);
      expect(cohort1.period.equals(period)).to.equal(true);
      expect(personArraysAreEqual(cohort1.members, cohort2.members)).to.equal(true);
      expect(personArraysAreEqual(cohort1.administrators, cohort2.administrators)).to.equal(true);
      expect(cohort1.cohortType).to.equal(ECohortType.OlympicLifting);
   });

   it("Needs to correctly change attributes", function () {

      let newName = new CohortName ("NewJoe");

      let weightMeasurement = new CleanMeasurementType(weightFactory);
      let weightMeasurements = new Array<MeasurementTypeOf<WeightUnits>>();
      weightMeasurements.push(weightMeasurement);

      let timeMeasurement = new Run800mMeasurementType(timeFactory);
      let timeMeasurements = new Array<MeasurementTypeOf<TimeUnits>>();
      timeMeasurements.push(timeMeasurement);

      let people = new Array<Person>();
      people.push(person2);

      let newPeriod = new CohortTimePeriod(new Date(), ECohortPeriod.Week, 2);

      cohort1.name = newName;
      cohort1.members = people;
      cohort1.administrators = people;
      cohort1.cohortType = ECohortType.Conditioning;
      cohort1.period = newPeriod;

      expect(cohort1.name.equals(newName)).to.equal(true);
      expect(cohort1.period.equals(newPeriod)).to.equal(true);
      expect(personArraysAreEqual(cohort1.members, people)).to.equal(true);
      expect(personArraysAreEqual(cohort1.administrators, people)).to.equal(true);
      expect(cohort1.cohortType).to.equal(ECohortType.Conditioning);
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

   it("Needs to convert to and from memento()", function () {

      let memento: CohortMemento = cohort1.memento();
      let newCohort = new Cohort (memento);

      expect(cohort1.equals(newCohort)).to.equal(true);
   });
});

