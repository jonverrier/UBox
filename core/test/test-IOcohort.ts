'use strict';
// Copyright TXPCo ltd, 2021

import { Logger } from '../src/Logger';
import { Timestamper } from '../src/Timestamp';
import { PersistenceDetails } from '../src/Persistence';
import { Roles, ERoleType, Person } from '../src/Person';
import { Business } from '../src/Business';
import { ECohortType, Cohort } from '../src/Cohort';
import { CohortCodec, CohortsCodec } from '../src/IOCohort';

import { PersistenceTestHelper, PersonaTestHelper, PersonTestHelper } from './testHelpers';

var expect = require("chai").expect;

describe("IOCohort", function () {

   var codec: CohortCodec = new CohortCodec();
   var arrayCodec: CohortsCodec = new CohortsCodec();
   var cohort: Cohort;

   let creationTimestamp = Timestamper.now();
   let roles = new Roles(new Array<ERoleType>(ERoleType.Member));
   let person = PersonTestHelper.createJoeMember();

   let people = new Array<Person>();
   people.push(person);

   let business = new Business(
      PersistenceTestHelper.createKey1(),
      PersonaTestHelper.createXFitDulwichDetails(),
      people, people);

   cohort = new Cohort(new PersistenceDetails("id", 0, 0),
      PersonaTestHelper.createXFitDulwichDetails(),
      business,
      creationTimestamp,
      ECohortType.WorkoutForReps);

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

   it("Needs to decode Cohorts from an array.", function () {

      var caught: boolean = false;

      let list: Array<Cohort> = new Array<Cohort>();
      list.push(cohort);

      let encodedArray = arrayCodec.encode(list);
      var caught: boolean = false;

      try {
         let decoded = arrayCodec.tryCreateFrom(encodedArray);
         expect(decoded[0].equals(cohort)).to.equal(true);
      } catch (e) {
         var logger = new Logger();
         logger.logError("Cohort", "Decode from array.", "Error", e.toString());
         caught = true;
      }
   });
});
