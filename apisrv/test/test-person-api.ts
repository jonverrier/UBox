'use strict';
// Copyright TXPCo ltd, 2021
import axios, { AxiosRequestConfig } from 'axios';

import { PersistenceDetails } from "../../core/src/Persistence";
import { ELoginProvider, LoginDetails, Name, EmailAddress, Url, Person } from "../../core/src/Person";
import { PersonCodec } from '../../core/src/IOPerson';

var expect = require("chai").expect;

var url: string = 'http://localhost:4000/api/person';

describe("PersonApi", function () {
   var person1: Person, person2: Person;

   beforeEach(function () {
      person1 = new Person(new PersistenceDetails(null, 1, 1),
         new LoginDetails(ELoginProvider.Apple, "123"),
         new Name("Joe"),
         new EmailAddress("Joe@mail.com", true), new Url("https://jo.pics.com", false), null);
   });

   it("Needs to save a new Person", async function (done) {

      let codec = new PersonCodec();

      let encoded = codec.encode(person1);

      let decoded = codec.tryCreateFrom(encoded);

      const config: AxiosRequestConfig = {
         headers: {
            'Content-Type': 'application/json'
         },
         proxy: false
      };

      try {
         const response = await axios.put(url, encoded, config);

         console.log("OK " + JSON.stringify(response.data));
         done();
      } catch (err) {
         console.log("Err " + JSON.stringify (err));
         done(err);
      };

   });

});


