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


describe("Demo Setup", function () {

   let quantity = new Quantity(60, BaseUnits.kilogram);

   let measurementApi: MeasurementApi = new MeasurementApi(root);
   var personApi: PersonApi = new PersonApi(root);
   var businessApi: BusinessApi = new BusinessApi(root);
   var cohortApi: CohortApi = new CohortApi(root);
   var coach: Person, athlete1: Person, athlete2: Person;
   var savedBusiness: Business;
   var savedMeasurement: Measurement;

   var measurement: Measurement;


   beforeEach(async function () {
      let person = PersonTestHelper.createMeForInsert();
      let admins = new Array<Person>();
      let members = new Array<Person>();
      coach = await personApi.save(person);
      admins.push(coach);

      person = PersonTestHelper.createHarryForInsert();
      athlete1 = await personApi.save(person);
      members.push(athlete1);

      person = PersonTestHelper.createAlexForInsert();
      athlete2 = await personApi.save(person);
      members.push(athlete2);

      let business: Business = new Business(PersistenceDetails.newPersistenceDetails(),
         PersonaTestHelper.createXFitDulwichDetails(),
         admins, members);

      savedBusiness = await businessApi.save(business);
   });

   it("Needs to setup Olympic Lifting", async function (done) {
      
      let newCohort: Cohort = new Cohort(PersistenceDetails.newPersistenceDetails(),
         PersonaTestHelper.createOlyLiftDetails(),
         savedBusiness,
         Timestamper.now(),
         ECohortType.OlympicLifting);
      let savedCohort = await cohortApi.save(newCohort);

      measurement = savedCohort.createMeasurement(quantity, 1, MeasurementTypes.clean,
         athlete1.persistenceDetails.key);
      savedMeasurement = await measurementApi.save(measurement);

      measurement = savedCohort.createMeasurement(quantity, 1, MeasurementTypes.clean,
         athlete2.persistenceDetails.key);
      savedMeasurement = await measurementApi.save(measurement);

      done();
   });

   it("Needs to setup Power Lifting", async function (done) {

      let newCohort: Cohort = new Cohort(PersistenceDetails.newPersistenceDetails(),
         PersonaTestHelper.createPowerLiftDetails(),
         savedBusiness,
         Timestamper.now(),
         ECohortType.Powerlifting);
      let savedCohort = await cohortApi.save(newCohort);

      measurement = savedCohort.createMeasurement(quantity, 1, MeasurementTypes.backsquat,
         athlete1.persistenceDetails.key);
      savedMeasurement = await measurementApi.save(measurement);

      measurement = savedCohort.createMeasurement(quantity, 1, MeasurementTypes.bench,
         athlete2.persistenceDetails.key);
      savedMeasurement = await measurementApi.save(measurement);

      done();
   });
});
