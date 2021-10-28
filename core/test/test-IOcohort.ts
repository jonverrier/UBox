'use strict';
// Copyright TXPCo ltd, 2021

import { Logger } from '../src/Logger';
import { PersistenceDetails } from '../src/Persistence';
import { Url, Name } from "../src/Party";
import { LoginDetails, EmailAddress, Person, ELoginProvider} from '../src/Person';
import { ECohortType, CohortTimePeriod, ECohortPeriod, Cohort } from '../src/Cohort';
import { CohortTimePeriodCodec, CohortCodec } from '../src/IOCohort';

var expect = require("chai").expect;


describe("IOCohortTimePeriod", function () {

   var codec: CohortTimePeriodCodec = new CohortTimePeriodCodec();
   var cohortTimePeriod: CohortTimePeriod = new CohortTimePeriod(new Date(), ECohortPeriod.Week, 8);

   it("Needs to decode a CohortTimePeriod from clean input.", function () {

      var caught: boolean = false;

      try {

         codec.decode({
            _startDate: new Date(),
            _period: ECohortPeriod.TwoWeeks,
            _numberOfPeriods: 4
         });

      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });


   it("Needs to encode CohortName.", function () {

      let encoded = codec.encode(cohortTimePeriod);

      expect(cohortTimePeriod.equals(encoded)).to.equals(true);
   });

   it("Needs to encode then decode CohortName.", function () {

      let encoded = codec.encode(cohortTimePeriod);
      let decoded: CohortTimePeriod;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom(encoded);
      } catch (e) {
         var logger = new Logger();
         logger.logError("CohortTimePeriod", "Decode", "Error", e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(cohortTimePeriod)).to.equal(true);
   });
});

describe("IOCohort", function () {

   var codec: CohortCodec = new CohortCodec();
   var cohort: Cohort;

   let period = new CohortTimePeriod(new Date(), ECohortPeriod.Week, 1);

   let person = new Person(new PersistenceDetails(1, 1, 1),
      new LoginDetails(ELoginProvider.Apple, "xxx"),
      new Name("Joe"),
      new EmailAddress("Joe@mail.com", true),
      new Url("https://jo.pics.com", false), null);

   let people = new Array<Person>();
   people.push(person);

   cohort = new Cohort(new PersistenceDetails("id", 1, 1),
      new Name("Joe"),
      period,
      people,
      people,
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
