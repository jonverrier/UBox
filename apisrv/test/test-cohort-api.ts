'use strict';
// Copyright TXPCo ltd, 2021
import axios from 'axios';

import { Logger } from '../../core/src/Logger';
import { PersistenceDetails } from "../../core/src/Persistence";
import { Name, Url, Persona } from "../../core/src/Persona";
import { EmailAddress, Roles, ERoleType, Person } from "../../core/src/Person";
import { Business } from '../../core/src/Business';
import { Cohort, ECohortType } from "../../core/src/Cohort";
import { BusinessApi } from '../src/BusinessApi';
import { CohortApi } from '../src/CohortApi';
import { PersonaTestHelper, PersonTestHelper } from '../../core/test/testHelpers';

var expect = require("chai").expect;

import { EApiUrls } from '../src/ApiUrls';

var root: string = 'http://localhost:4000';

describe("CohortApi", function () {

   var businessApi: BusinessApi = new BusinessApi(root);
   var cohortApi: CohortApi = new CohortApi(root);

   let cohort1;
   let period = 1;

   let person = PersonTestHelper.createMeForInsert();

   beforeEach(async function () {

      let people = new Array<Person>();
      people.push(person);

      let business = new Business(new PersistenceDetails(null, 0, 0),
         PersonaTestHelper.createXFitDulwichDetails(),
         people, people);

      let newBusiness:Business = await businessApi.save(business);

      cohort1 = new Cohort(new PersistenceDetails(null, 1, 1),
         PersonaTestHelper.createXFitDulwichDetails(),
         newBusiness,
         new Name("Olympic Lifting"),
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

});


