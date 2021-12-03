'use strict';
// Copyright TXPCo ltd, 2021
import axios from 'axios';

import { Quantity } from '../../core/src/Quantity';
import { BaseUnits } from '../../core/src/Unit';
import { Logger } from '../../core/src/Logger';
import { PersistenceDetails } from "../../core/src/Persistence";
import { Measurement } from '../../core/src/Observation';
import { MeasurementTypes } from '../../core/src/ObservationTypeDictionary';
import { Person } from "../../core/src/Person";
import { Business } from '../../core/src/Business';
import { Cohort, ECohortType } from "../../core/src/Cohort";
import { MeasurementApi, CohortMeasurementApi} from '../src/ObservationApi';
import { PersonApi } from '../src/PersonApi';
import { BusinessApi } from '../src/BusinessApi';
import { CohortApi, MyCohortsApi, MyEmailCohortsApi } from '../src/CohortApi';
import { PersonaTestHelper, PersonTestHelper } from '../../core/test/testHelpers';

var expect = require("chai").expect;

import { EApiUrls } from '../src/ApiUrls';

var root: string = 'http://localhost:4000';

describe("CohortApi", function () {

   var personApi: PersonApi = new PersonApi(root);
   var businessApi: BusinessApi = new BusinessApi(root);
   var cohortApi: CohortApi = new CohortApi(root);
   var myCohortsApi: MyCohortsApi = new MyCohortsApi(root);
   var myEmailCohortsApi: MyEmailCohortsApi = new MyEmailCohortsApi(root);
   var cohortMeasurementApi: CohortMeasurementApi = new CohortMeasurementApi(root);

   let cohort1:Cohort;
   let period = 1;

   let person = PersonTestHelper.createMeForInsert();
   var savedPerson: Person;

   beforeEach(async function () {

      savedPerson = await personApi.save(person);
      let people = new Array<Person>();
      people.push(savedPerson);

      let business = new Business(new PersistenceDetails(null, 0, 0),
         PersonaTestHelper.createXFitDulwichDetails(),
         people, people);

      let newBusiness:Business = await businessApi.save(business);

      cohort1 = new Cohort(new PersistenceDetails(null, 1, 1),
         PersonaTestHelper.createOlyLiftDetails(),
         newBusiness,
         period,
         ECohortType.OlympicLifting);
   });

   it("Needs to save a new Cohort", async function (done) {

      // Create and save a Cohort, with the Person as a Member
      try {
         let savedCohort = cohortApi.save(cohort1);
         done();
      } catch (e) {
         done(e);
      }

   });
   
   it("Needs to save and then retrieve an existing Cohort", async function (done) {

      try {
         const savedCohort = await cohortApi.save(cohort1);
         const response2 = await cohortApi.loadOne(savedCohort.persistenceDetails.key);

         done();
      } catch (e) {
         var logger = new Logger();
         logger.logError("CohortApi", "Save-Load", "Error", e.toString());
         done(e);
      }

   });


   it("Needs to retrieve Cohorts using a person key", async function (done) {

      try {

         const decoded = await myCohortsApi.loadMany(savedPerson.persistenceDetails.key);

         // test is that we at least one business back
         if (decoded.length > 0) {
            done();
         } else {
            var logger = new Logger();
            var e: string = "Returned: " + decoded;
            logger.logError("CohortApi", "LoadMany", "Error", e);
            done(e)
         }

      } catch (e) {
         var logger = new Logger();
         logger.logError("CohortApi", "LoadMany", "Error", e.toString());
         done(e);
      }

   });

   it("Needs to retrieve Cohorts using a person email", async function (done) {

      try {

         const decoded = await myEmailCohortsApi.loadMany(savedPerson.email.email);

         // test is that we at least one business back
         if (decoded.length > 0) {
            done();
         } else {
            var logger = new Logger();
            var e: string = "Returned: " + decoded;
            logger.logError("CohortApi", "LoadMany", "Error", e);
            done(e)
         }

      } catch (e) {
         var logger = new Logger();
         logger.logError("CohortApi", "LoadMany", "Error", e.toString());
         done(e);
      }

   });

   it("Needs to retrieve a Measurements for the Cohort", async function (done) {

      try {
         // Save the cohort
         let savedCohort = await cohortApi.save(cohort1);

         // Save a new Measurement object 
         var quantity = new Quantity(50, BaseUnits.kilogram);
         var measurement: Measurement = savedCohort.createMeasurement(quantity, 1, MeasurementTypes.clean, "1234");

         // Save it
         let api: MeasurementApi = new MeasurementApi(root);
         const firstSave = await api.save(measurement);

         // Query all the measurements back 
         const response2 = await cohortMeasurementApi.loadMany(savedCohort.persistenceDetails.key);

         let secondSave = response2[0];

         // test is that we at least one measurement back and it matches the cohort 
         if (response2.length > 0 && response2[0].cohortKey === savedCohort.persistenceDetails.key) {
            done();
         } else {
            var logger = new Logger();
            logger.logError("CohortApi", "LoadManyForCohort", "Error", null);
            done(new Error());
         }

      } catch (e) {
         var logger = new Logger();
         logger.logError("CohortApi", "LoadManyForCohort", "Error", e.toString());
         done(e);
      }

   });
});


