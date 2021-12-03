'use strict';
// Copyright TXPCo ltd, 2021

import { Logger } from '../../core/src/Logger';
import { Person } from "../../core/src/Person";
import { PersonApi, MyPersonApi } from '../src/PersonApi';
import { PersonTestHelper } from '../../core/test/testHelpers';

var expect = require("chai").expect;

import { EApiUrls } from '../src/ApiUrls';

var root: string = 'http://localhost:4000';

describe("PersonApi", function () {
   var person1: Person;
   var api: PersonApi;

   beforeEach(function () {
      person1 = PersonTestHelper.createMeForInsert();

      api = new PersonApi(root);
   });

   it("Needs to save a new Person", async function (done) {

      try {
         api.save(person1);
         done();
      } catch (e) {
         var logger = new Logger();
         logger.logError("PersonApi", "Save", "Error", e.toString());
         done(e);
      }

   });

   it("Needs to save and then retrieve an existing Person", async function (done) {

      try {
         const savedPerson = await api.save(person1);
         const response2 = await api.loadOne(savedPerson.persistenceDetails.key);

         done();
      } catch (e) {
         var logger = new Logger();
         logger.logError("PersonApi", "Save-Load", "Error", e.toString());
         done(e);
      }

   });

   it("Needs to save and then retrieve an existing Person by email", async function (done) {

      try {
         var emailApi: MyPersonApi = new MyPersonApi(root);
         const savedPerson = await api.save(person1);
         const response2 = await emailApi.loadOne(savedPerson.email.email);

         done();
      } catch (e) {
         var logger = new Logger();
         logger.logError("PersonApi", "Save-Load Email", "Error", e.toString());
         done(e);
      }

   });

   it("Needs to save and then retrieve a Person using lists", async function (done) {

      try {
         // Save a new object then read it back
         const response = await api.save(person1);

         // Build array query & ask for a list
         let ids = new Array<string>();
         ids.push(response.persistenceDetails.key);

         const decodedPeople = await api.loadMany(ids);

         // test is that we get the same person back as array[0] as we got from the first save operation 
         if (decodedPeople[0].equals(response)) {
            done();
         } else {
            var logger = new Logger();
            var e: string = "Returned: " + decodedPeople[0] + "original: " + response;
            logger.logError("PersonApi", "Save-LoadMany", "Error", e);
            done (e)
         }

      } catch (e) {
         var logger = new Logger();
         logger.logError("PersonApi", "Save-LoadMany", "Error", e.toString());
         done(e);
      }

   });
});


