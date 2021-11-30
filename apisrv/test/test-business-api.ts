'use strict';
// Copyright TXPCo ltd, 2021
import axios from 'axios';

import { Logger } from '../../core/src/Logger';
import { PersistenceDetails } from "../../core/src/Persistence";
import { Name, Url, Persona } from "../../core/src/Persona";
import { EmailAddress, Roles, ERoleType, Person } from "../../core/src/Person";
import { Business } from "../../core/src/Business";
import { PersonApi } from '../src/PersonApi';
import { BusinessApi } from '../src/BusinessApi';
import { PersonaTestHelper, PersonTestHelper } from '../../core/test/testHelpers';

var expect = require("chai").expect;

import { EApiUrls } from '../src/ApiUrls';

var root: string = 'http://localhost:4000';

describe("BusinessApi", function () {

   var personApi: PersonApi = new PersonApi(root);
   var businessApi: BusinessApi = new BusinessApi(root);

   let business1;

   let person = PersonTestHelper.createJoeForInsert();

   beforeEach(async function () {

      let people = new Array<Person>();
      let savedPerson = await personApi.save(person);
      people.push(savedPerson);

      business1 = new Business(new PersistenceDetails (null, 0, 0),
         PersonaTestHelper.createXFitDulwichDetails(),
         people, people);
   });

   it("Needs to save a new Business", async function (done) {

      // Create and save a Business, with the Person as a Member
      try {
         let savedBusiness = businessApi.save(business1);
         done();
      } catch (e) {
         done(e);
      }

   });
   
   it("Needs to save and then retrieve an existing Business", async function (done) {

      try {
         const savedBusiness = await businessApi.save(business1);
         const response2 = await businessApi.loadOne(savedBusiness.persistenceDetails.key);

         done();
      } catch (e) {
         var logger = new Logger();
         logger.logError("BusinessApi", "Save-Load", "Error", e.toString());
         done(e);
      }

   });

});


