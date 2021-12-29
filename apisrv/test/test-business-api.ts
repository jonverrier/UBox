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

   var admins: Array<Person>;
   var members: Array<Person>;
   var business1:Business;

   let person = PersonTestHelper.createMeForInsert();
   var savedAdmin: Person, savedMember: Person;

   let harry = PersonTestHelper.createHarryForInsert();
   let alex = PersonTestHelper.createAlexForInsert();


   beforeEach(async function () {

      admins = new Array<Person>();
      members = new Array<Person>();

      savedAdmin = await personApi.save(person);
      admins.push(savedAdmin);

      savedMember = await personApi.save(harry);
      members.push(savedMember);

      savedMember = await personApi.save(alex);
      members.push(savedMember);

      business1 = new Business(PersistenceDetails.newPersistenceDetails(),
         PersonaTestHelper.createXFitDulwichDetails(),
         admins, admins);
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
         const decoded = await businessApi.loadMany(savedAdmin.persistenceDetails.key);

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
         peopleMess, admins);

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
         admins, peopleMess);

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


