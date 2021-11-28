'use strict';
// Copyright TXPCo ltd, 2021

import { Logger } from '../src/Logger';
import { Timestamper } from '../src/Timestamp';
import { PersistenceDetails } from '../src/Persistence';
import { Url, Name, Persona } from "../src/Persona";
import { EmailAddress, Person } from '../src/Person';
import { Business } from '../src/Business';
import { ECohortType, ECohortPeriod, Cohort } from '../src/Cohort';
import { CohortCodec } from '../src/IOCohort';

var expect = require("chai").expect;

describe("IOCohort", function () {

   var codec: CohortCodec = new CohortCodec();
   var cohort: Cohort;

   let creationTimestamp = Timestamper.now();

   let person = new Person(new PersistenceDetails(1, 1, 1),
      new Persona(new Name("Joe"), new Url("https://jo.pics.com", false)),
      new EmailAddress("Joe@mail.com", true),
      null);

   let people = new Array<Person>();
   people.push(person);

   let business = new Business(new PersistenceDetails(null, 1, 1),
      new Persona (new Name("XFit Dulwich2"), new Url("https://xfit.pics.com", false)),
      people, people);

   cohort = new Cohort(new PersistenceDetails("id", 1, 1),
      business,
      new Name("Joe"),
      creationTimestamp,
      ECohortType.Conditioning);

   it("Needs to decode a Cohort from clean input.", function () {

      var caught: boolean = false;

      try {

         codec.decode(cohort.memento());

      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });


   it("Needs to encode Cohort.", function () {

      let encoded = codec.encode(cohort);

      expect(cohort.equals(encoded)).to.equals(true);
   });

   it("Needs to encode then decode Cohort.", function () {

      let encoded = codec.encode(cohort);
      let decoded: Cohort;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom(encoded);

      } catch (e) {
         var logger = new Logger();
         logger.logError("Cohort", "Decode", "Error", e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(cohort)).to.equal(true);
   });
});
