'use strict';
// Copyright TXPCo ltd, 2021
import axios from 'axios';

import { Logger } from '../../core/src/Logger';
import { PersistenceDetails } from "../../core/src/Persistence";
import { IdListCodec, IdList } from '../../core/src/IOCommon';
import { ELoginProvider, ERoleType, LoginDetails, Name, EmailAddress, Url, Roles, Person } from "../../core/src/Person";
import { PersonCodec, PeopleCodec } from '../../core/src/IOPerson';

var expect = require("chai").expect;

import { EApiUrls } from '../src/ApiUrls';

var root: string = 'http://localhost:4000';
var saveUrl: string = root + EApiUrls.SavePerson;
var queryUrl: string = root + EApiUrls.QueryPerson;
var queryManyUrl: string = root + EApiUrls.QueryPeople;

describe("PersonApi", function () {
   var person1: Person;

   beforeEach(function () {
      person1 = new Person(new PersistenceDetails(null, 1, 1),
         new LoginDetails(ELoginProvider.Apple, "123"),
         new Name("Joe", null),
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

   it("Needs to save and then retrieve a Person using lists", async function (done) {

      let inputCodec = new IdListCodec();

      let codec = new PersonCodec();
      let encoded = codec.encode(person1);

      try {
         // Save a new object then read it back
         const response = await axios.put(saveUrl, encoded);
         let decoded = codec.decode(response.data);

         // Build array query & ask for a list
         let ids = new Array<string>();
         ids.push(decoded._persistenceDetails._id.toString());
         let idList: IdList = new IdList(ids);
         encoded = inputCodec.encode(idList);

         const response2 = await axios.put(queryManyUrl, encoded);
         let peopleCodec = new PeopleCodec();
         let decodedPeople = peopleCodec.decode(response2.data);

         let personReturned = new Person(decodedPeople[0]);

         // test is that we get the same person back as array[0] as we got from tje specific query
         if (personReturned.equals(new Person(decoded))) {
            done();
         } else {
            var logger = new Logger();
            var e: string = "Returned: " + personReturned + "original: " + decoded;
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


