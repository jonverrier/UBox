'use strict';
// Copyright TXPCo ltd, 2021

var expect = require("chai").expect;

import { Logger } from '../../core/src/Logger';
import { PersistenceDetails } from "../../core/src/Persistence";
import { Person } from "../../core/src/Person";
import { Business } from "../../core/src/Business";
import { PersonApi } from '../src/PersonApi';
import { BusinessApi } from '../src/BusinessApi';
import { PersonaTestHelper, PersonTestHelper } from '../../core/test/testHelpers';

var root: string = 'http://localhost:4000';

describe("BusinessApi", function () {

   var personApi: PersonApi = new PersonApi(root);
   var businessApi: BusinessApi = new BusinessApi(root);

   var people: Array<Person>;
   var business1:Business;

   let person = PersonTestHelper.createMeForInsert();
   var savedPerson: Person;


   beforeEach(async function () {

      people = new Array<Person>();
      savedPerson = await personApi.save(person);
      people.push(savedPerson);

      business1 = new Business(PersistenceDetails.newPersistenceDetails(),
         PersonaTestHelper.createXFitDulwichDetails(),
         people, people);
   });

   it("Needs to save a new Business", async function (done) {

      // Create and save a Business, with the Person as a Member
      try {
         let savedBusiness = await businessApi.save(business1);
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

   it("Needs to retrieve Businesses using lists", async function (done) {

      try {
         const decoded = await businessApi.loadMany(savedPerson.persistenceDetails.key);

         // test is that we at least one business back
         if (decoded.length > 0) {
            done();
         } else {
            var logger = new Logger();
            var e: string = "Returned: " + decoded;
            logger.logError("BusinessApi", "LoadMany", "Error", e);
            done(e)
         }

      } catch (e) {
         var logger = new Logger();
         logger.logError("BusinessApi", "LoadMany", "Error", e.toString());
         done(e);
      }

   });

   it("Needs to trap referential integrity issue with Administrators", async function (done) {

      var peopleMess = new Array<Person>();
      peopleMess.push(PersonTestHelper.createJoeForInsertRIError());

      let business2: Business = new Business(PersistenceDetails.newPersistenceDetails(),
         PersonaTestHelper.createXFitDulwichDetailsErr(),
         peopleMess, people);

      // Create and save a Business, should create error as have an RI issue 
      try {
         let savedBusiness = await businessApi.save(business2);
         done(new Error ("Did not catch RI issue"));
      } catch (e) {
         console.log(e);
         done();
      }

   });

   it("Needs to trap referential integrity issue with Members", async function (done) {

      var peopleMess = new Array<Person>();
      peopleMess.push(PersonTestHelper.createJoeForInsertRIError());

      let business2: Business = new Business(PersistenceDetails.newPersistenceDetails(),
         PersonaTestHelper.createXFitDulwichDetailsErr(),
         people, peopleMess);

      // Create and save a Business, should create error as have an RI issue 
      try {
         let savedBusiness = await businessApi.save(business2);
         done(new Error("Did not catch RI issue"));
      } catch (e) {
         console.log(e);
         done();
      }

   });

   it("Needs to save and then update an existing Business", async function (done) {

      try {
         const savedBusiness = await businessApi.save(business1);

         // Save with a new version number
         let business2 = new Business(PersistenceDetails.incrementSequenceNo(savedBusiness.persistenceDetails),
            savedBusiness.personaDetails,
            savedBusiness.administrators,
            savedBusiness.members);
         const savedBusiness2 = await businessApi.save(business2);

         // Read it back and check it is the same
         const response2 = await businessApi.loadOne(savedBusiness2.persistenceDetails.key);
         expect(response2.equals(business2)).to.equal(true);

         done();
      } catch (e) {
         var logger = new Logger();
         logger.logError("BusinessApi", "Save-Update", "Error", e.toString());
         done(e);
      }

   });

});


