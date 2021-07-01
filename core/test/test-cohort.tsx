'use strict';
// Copyright TXPCo ltd, 2021

import { SnatchMeasurementType, CleanMeasurementType, Row500mMeasurementType, Row1000mMeasurementType} from '../src/FitnessObservations'
import { EmailAddress, Url, Name, Person, personArraysAreEqual} from '../src/Person';
import { weightMeasurementTypeArraysAreEqual, timeMeasurementTypeArraysAreEqual } from "../src/Observation";
import { MeasurementTypeOf } from '../src/Observation';
import { CohortName, Cohort } from '../src/Cohort';
import { ETimeUnits, EWeightUnits } from '../src/Quantity';

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

describe("Cohort", function () {
   let cohort1, cohort2;

   
   beforeEach(function () {
      let weightMeasurement = new SnatchMeasurementType();
      let weightMeasurements = new Array < MeasurementTypeOf<EWeightUnits>>();
      weightMeasurements.push(weightMeasurement);

      let timeMeasurement = new Row500mMeasurementType();
      let timeMeasurements = new Array<MeasurementTypeOf<ETimeUnits>>();
      timeMeasurements.push(timeMeasurement);

      let person = new Person(1, 1, 1, "123", new Name("Joe"),
         new EmailAddress("Joe@mail.com", true),
         new Url("https://jo.pics.com", false));
      let people = new Array<Person>();
      people.push(person);

      cohort1 = new Cohort("id", 1, 1,
         new CohortName("Joe"),
         people,
         weightMeasurements,
         timeMeasurements);

      cohort2 = new Cohort("id", 1, 1,
         new CohortName("Bill"),
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
      expect(personArraysAreEqual(cohort1.people, cohort2.people)).to.equal(true);
      expect(weightMeasurementTypeArraysAreEqual(cohort1.weightMeasurements, cohort2.weightMeasurements)).to.equal(true);
      expect(timeMeasurementTypeArraysAreEqual(cohort1.timeMeasurements, cohort2.timeMeasurements)).to.equal(true);
   });

   it("Needs to correctly change attributes", function () {

      let newName = new CohortName ("NewJoe");

      let weightMeasurement = new CleanMeasurementType();
      let weightMeasurements = new Array<MeasurementTypeOf<EWeightUnits>>();
      weightMeasurements.push(weightMeasurement);

      let timeMeasurement = new Row1000mMeasurementType();
      let timeMeasurements = new Array<MeasurementTypeOf<ETimeUnits>>();
      timeMeasurements.push(timeMeasurement);

      let person = new Person(1, 1, 1, "123", new Name("Jenny"),
         new EmailAddress("Joe@mail.com", true),
         new Url("https://jo.pics.com", false));
      let people = new Array<Person>();
      people.push(person);

      cohort1.name = newName;
      cohort1.people = people;
      cohort1.weightMeasurements = weightMeasurements;
      cohort1.timeMeasurements = timeMeasurements;

      expect(cohort1.name.equals(newName)).to.equal(true);
      expect(personArraysAreEqual(cohort1.people, people)).to.equal(true);
      expect(weightMeasurementTypeArraysAreEqual(cohort1.weightMeasurements, weightMeasurements)).to.equal(true);
      expect(timeMeasurementTypeArraysAreEqual(cohort1.timeMeasurements, timeMeasurements)).to.equal(true);
   });
});

