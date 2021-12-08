'use strict';
// Copyright TXPCo ltd, 2021
import axios from 'axios';

import { Logger } from '../../core/src/Logger';
import { Timestamper } from '../../core/src/Timestamp';
import { BaseUnits } from '../../core/src/Unit';
import { Quantity } from "../../core/src/Quantity";
import { PersistenceDetails } from "../../core/src/Persistence";
import { MeasurementTypes } from "../../core/src/ObservationTypeDictionary";
import { Person } from '../../core/src/Person';
import { Business } from '../../core/src/Business';
import { Cohort, ECohortType } from '../../core/src/Cohort';
import { Measurement } from '../../core/src/Observation';
import { PersonApi } from '../src/PersonApi';
import { BusinessApi } from '../src/BusinessApi';
import { CohortApi } from '../src/CohortApi';
import { MeasurementApi } from '../src/ObservationApi';
import { PersonaTestHelper, PersonTestHelper } from '../../core/test/testHelpers';

var expect = require("chai").expect;

var root: string = 'http://localhost:4000';

const getCircularReplacer = () => {
   const seen = new WeakSet();
   return (key, value) => {
      if (typeof value === "object" && value !== null) {
         if (seen.has(value)) {
            return;
         }
         seen.add(value);
      }
      return value;
   };
};

describe("MeasurementApi", function () {

   let quantity = new Quantity(60, BaseUnits.kilogram);
   let repeats = 1;
   let measurementType = MeasurementTypes.snatch;
   let api: MeasurementApi = new MeasurementApi(root);
   var personApi: PersonApi = new PersonApi(root);
   var businessApi: BusinessApi = new BusinessApi(root);
   var cohortApi: CohortApi = new CohortApi(root);
   var savedPerson: Person;

   var measurement1: Measurement;


   beforeEach(async function () {
      let person = PersonTestHelper.createMeForInsert();
      let people = new Array<Person>();

      savedPerson = await personApi.save(person);
      people.push(savedPerson);

      let business = new Business(new PersistenceDetails(null, 0, 0),
         PersonaTestHelper.createXFitDulwichDetails(),
         people, people);

      let newBusiness: Business = await businessApi.save(business);

      let newCohort:Cohort = new Cohort(new PersistenceDetails(null, 1, 1),
         PersonaTestHelper.createOlyLiftDetails(),
         newBusiness,
         1,
         ECohortType.OlympicLifting);
      let savedCohort = await cohortApi.save(newCohort);

      measurement1 = new Measurement(
         new PersistenceDetails(null, 1, 2), quantity, repeats, Timestamper.now(), measurementType, savedPerson.persistenceDetails.key, savedCohort.persistenceDetails.key);
   });

   it("Needs to save a new Measurement", async function (done) {

      try {
         let decoded = api.save(measurement1); 
         done();
      } catch (e) {
         var logger = new Logger();
         logger.logError("MeasurementApi", "Save", "Error", e.toString());
         done(e);
      }

   });

   it("Needs to save and then retrieve an existing Measurement", async function (done) {

      try {
         const response = await api.save(measurement1);
         const response2 = await api.loadOne (response.persistenceDetails.key);
         done();
      } catch (e) {
         var logger = new Logger();
         logger.logError("MeasurementApi", "Save-Load", "Error", e.toString());
         done(e);
      }

   });

   it("Needs to save and then retrieve a Measurement using lists", async function (done) {

      try {
         // Save a new object 
         const firstSave = await api.save(measurement1);

         // Build array query & ask for a list
         let ids = new Array<string>();
         ids.push(firstSave.persistenceDetails.key);
         const response2 = await api.loadMany(ids);

         let secondSave = response2[0];

         // test is that we get the same Measurement back as array[0] as we got from the specific query
         if (firstSave.equals(secondSave)) {
            done();
         } else {
            var logger = new Logger();
            var e: string = " Returned: " + JSON.stringify(secondSave, getCircularReplacer()) + "Original: " + JSON.stringify(firstSave, getCircularReplacer());
            logger.logError("test-measurement-api", "Save-LoadMany", "Error", e);
            done(new Error (e))
         }

      } catch (e) {
         var logger = new Logger();
         logger.logError("test-measurement-api", "Save-LoadMany", "Error", e.toString());
         done(e);
      }

   });

   it("Needs to save and then retrieve a Measurement using lists of SubjectIds", async function (done) {

      try {
         // Save a new object 
         const firstSave = await api.save(measurement1);

         // Build array query & ask for a list
         let ids = new Array<string>();
         ids.push(firstSave.subjectKey.toString());
         const response2 = await api.loadManyForPeople (ids);

         let secondSave = response2[0];

         // test is that we get a Measurement for the right subject
         if (secondSave.subjectKey === firstSave.subjectKey) {
            done();
         } else {
            var logger = new Logger();
            var e: string = " Returned: " + JSON.stringify(secondSave, getCircularReplacer()) + "Original: " + JSON.stringify(firstSave, getCircularReplacer());
            logger.logError("test-measurement-api", "Save-LoadMany", "Error", e);
            done(new Error(e));
         }

      } catch (e) {
         var logger = new Logger();
         logger.logError("test-measurement-api", "Save-LoadMany", "Error", e.toString());
         done(e);
      }

   });

   it("Needs to trap referential integrity issue with SubjectKey", async function (done) {
      // Create and save a Measurement, should create error as have an RI issue 
      let measurement2 = new Measurement(
         new PersistenceDetails(null, 1, 2), quantity, repeats, Timestamper.now(), measurementType, "ForceRIError", measurement1.cohortKey);

      try {
         const response = await api.save(measurement2);
         done(new Error("Did not catch RI issue"));
      } catch (e) {
         console.log(e);
         done();
      }

   });

   it("Needs to trap referential integrity issue with CohortKey", async function (done) {
      // Create and save a Measurement, should create error as have an RI issue 
      let measurement2 = new Measurement(
         new PersistenceDetails(null, 1, 2), quantity, repeats, Timestamper.now(), measurementType, measurement1.subjectKey, "ForceRIError");

      try {
         const response = await api.save(measurement2);
         done(new Error("Did not catch RI issue"));
      } catch (e) {
         console.log(e);
         done();
      }

   });
});

describe("MeasurementApi - heterogenous", function () {

   var logger = new Logger();

   let repeats = 1;

   let quantityOfTime = new Quantity(200, BaseUnits.second);
   let timeMeasurementType = MeasurementTypes.run800;
   let quantityOfWeight = new Quantity(60, BaseUnits.kilogram);
   let weightMeasurementType = MeasurementTypes.snatch;

   var timeMeasurement: Measurement;
   var weightMeasurement: Measurement;

   var personApi: PersonApi = new PersonApi(root);
   var businessApi: BusinessApi = new BusinessApi(root);
   var cohortApi: CohortApi = new CohortApi(root);
   let api: MeasurementApi = new MeasurementApi(root);

   var savedPerson: Person;


   var measurement1: Measurement;


   beforeEach(async function () {
      let person = PersonTestHelper.createMeForInsert();
      let people = new Array<Person>();

      savedPerson = await personApi.save(person);
      people.push(savedPerson);

      let business = new Business(new PersistenceDetails(null, 0, 0),
         PersonaTestHelper.createXFitDulwichDetails(),
         people, people);

      let newBusiness: Business = await businessApi.save(business);

      let newCohort: Cohort = new Cohort(new PersistenceDetails(null, 1, 1),
         PersonaTestHelper.createOlyLiftDetails(),
         newBusiness,
         1,
         ECohortType.OlympicLifting);
      let savedCohort = await cohortApi.save(newCohort);

      timeMeasurement = new Measurement(
         new PersistenceDetails(null, 1, 2), quantityOfTime, repeats, Timestamper.now(), timeMeasurementType,
         savedPerson.persistenceDetails.key, savedCohort.persistenceDetails.key);

      weightMeasurement = new Measurement(
         new PersistenceDetails(null, 1, 2), quantityOfWeight, repeats, Timestamper.now(), weightMeasurementType,
         savedPerson.persistenceDetails.key, savedCohort.persistenceDetails.key);
   });

   it("Needs to save and then retrieve a Measurement using lists", async function (done) {

      // Save a new time object 
      const response1 = await api.save(timeMeasurement);

      // Save a new weight object 
      const response2 = await api.save(weightMeasurement);

      // Build array query 
      let ids = new Array<string>();
      ids.push(response1.persistenceDetails.key);
      ids.push(response2.persistenceDetails.key);

      try {

         const response3 = await api.loadMany(ids);

         // test is that we get two documents back
         if (response3.length === 2) {
            done();
         } else {
            var e: string = "Returned: " + response3;
            logger.logError("test-measurement-api", "Save-LoadMany", "Error", e);
            done(new Error(e));
         }

      } catch (e) {
         logger.logError("test-measurement-api", "Save-LoadMany", "Error", e.toString());
         done(e);
      }

   });
});


