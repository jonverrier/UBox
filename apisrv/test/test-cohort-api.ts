'use strict';
// Copyright TXPCo ltd, 2021
import axios from 'axios';

import { Logger } from '../../core/src/Logger';
import { PersistenceDetails } from "../../core/src/Persistence";
import { Name, Url, Persona } from "../../core/src/Persona";
import { EmailAddress, Person } from "../../core/src/Person";
import { Business } from '../../core/src/Business';
import { ECohortPeriod, Cohort, ECohortType } from "../../core/src/Cohort";
import { BusinessApi } from '../src/BusinessApi';
import { CohortApi } from '../src/CohortApi';

var expect = require("chai").expect;

import { EApiUrls } from '../src/ApiUrls';

var root: string = 'http://localhost:4000';

describe("CohortApi", function () {

   var businessApi: BusinessApi = new BusinessApi(root);
   var cohortApi: CohortApi = new CohortApi(root);

   let cohort1;
   let period = 1;

   let person = new Person(new PersistenceDetails(null, 1, 1),
      new Persona(new Name("Jon V"), new Url("https://jonv.pics.com", false)),
      new EmailAddress("jonathanverrier@hotmail.com", true),
      null);

   beforeEach(async function () {

      let people = new Array<Person>();
      people.push(person);

      let business = new Business(new PersistenceDetails(null, 1, 1),
         new Persona (new Name("Fortitude Dulwich"), new Url("https://xfit.pics.com", false)),
         people, people);

      let newBusiness:Business = await businessApi.save(business);

      cohort1 = new Cohort(new PersistenceDetails(null, 1, 1),
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


