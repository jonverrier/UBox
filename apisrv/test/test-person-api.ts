'use strict';
// Copyright TXPCo ltd, 2021
import axios, { AxiosRequestConfig } from 'axios';

import { Logger } from '../../core/src/Logger';
import { PersistenceDetails } from "../../core/src/Persistence";
import { ELoginProvider, ERoleType, LoginDetails, Name, EmailAddress, Url, Roles, Person } from "../../core/src/Person";
import { PersonCodec } from '../../core/src/IOPerson';

var expect = require("chai").expect;

var saveUrl: string = 'http://localhost:4000/api/personSave';
var queryUrl: string = 'http://localhost:4000/api/personQuery';

describe("PersonApi", function () {
   var person1: Person;

   beforeEach(function () {
      person1 = new Person(new PersistenceDetails(null, 1, 1),
         new LoginDetails(ELoginProvider.Apple, "123"),
         new Name("Joe"),
         new EmailAddress("Joe@mail.com", true), new Url("https://jo.pics.com", false),
         new Roles(Array<ERoleType>(ERoleType.Member)));
   });

   it("Needs to save a new Person", async function (done) {

      let codec = new PersonCodec();
      let encoded = codec.encode(person1);

      try {
         const response = await axios.put(saveUrl, encoded);
         let decoded = codec.decode(response.data);
         done();
      } catch (e) {
         var logger = new Logger();
         logger.logError("PersonApi", "Save", "Error", e.toString());
         done(e);
      }

   });

   it("Needs to save and then retrieve an existing Person", async function (done) {

      let codec = new PersonCodec();
      let encoded = codec.encode(person1);

      try {
         const response = await axios.put(saveUrl, encoded);
         let decoded = codec.decode(response.data);
         const response2 = await axios.get(queryUrl, { params: { _id: decoded._persistenceDetails._id.toString() } });
         done();
      } catch (e) {
         var logger = new Logger();
         logger.logError("PersonApi", "Save-Load", "Error", e.toString());
         done(e);
      }

   });

});


