'use strict';
// Copyright TXPCo ltd, 2021
import axios from 'axios';

import { Logger } from '../../core/src/Logger';
import { PersistenceDetails } from "../../core/src/Persistence";
import { Name, Url } from "../../core/src/Party";
import { ELoginProvider, LoginDetails, EmailAddress, Person } from "../../core/src/Person";
import { Business } from "../../core/src/Business";
import { PersonApi } from '../src/PersonApi';
import { BusinessApi } from '../src/BusinessApi';

var expect = require("chai").expect;

import { EApiUrls } from '../src/ApiUrls';

var root: string = 'http://localhost:4000';

describe("BusinessApi", function () {

   var personApi: PersonApi = new PersonApi(root);
   var businessApi: BusinessApi = new BusinessApi(root);

   let business1;

   let person = new Person(new PersistenceDetails(null, 1, 1),
      new LoginDetails(ELoginProvider.Apple, "xxx"),
      new Name("Joe"),
      new EmailAddress("Joe@mail.com", true),
      new Url("https://jo.pics.com", false), null);

   beforeEach(async function () {

      let people = new Array<Person>();
      let savedPerson = await personApi.save(person);
      people.push(savedPerson);

      business1 = new Business(new PersistenceDetails(null, 1, 1),
         new Name("Fortitude Dulwich"),
         new Url("https://jo.pics.com", false),
         people);
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


