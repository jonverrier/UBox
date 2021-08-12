'use strict';
// Copyright TXPCo ltd, 2021

import { Logger } from '../src/Logger';
import { PersistenceDetails } from '../src/Persistence';
import { CohortNameCodec, CohortTimePeriodCodec, CohortCodec } from '../src/IOCohort';
import { Name, LoginDetails, EmailAddress, Url, Person, ELoginProvider} from '../src/Person';
import { CohortName, CohortTimePeriod, ECohortPeriod, Cohort } from '../src/Cohort';
import { MeasurementTypeOf } from '../src/Observation';
import { ETimeUnits, EWeightUnits } from '../src/Quantity';
import { SnatchMeasurementType, Row250mMeasurementType } from '../src/FitnessObservations'

var expect = require("chai").expect;

describe("IOCohortName", function () {

   var codec: CohortNameCodec = new CohortNameCodec();
   var cohortName: CohortName = new CohortName("test");

   it("Needs to decode a CohortName from clean input.", function () {

      var caught: boolean = false;

      try {

         codec.decode({
            _name: "test name"
         });

      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });


   it("Needs to encode CohortName.", function () {

      let encoded = codec.encode(cohortName);     

      expect(cohortName.equals(encoded)).to.equals(true);
   });

   it("Needs to encode then decode CohortName.", function () {

      let encoded = codec.encode(cohortName);
      let decoded: CohortName;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom(encoded);
      } catch (e) {
         var logger = new Logger();
         logger.logError("CohortName", "Decode", "Error", e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(cohortName)).to.equal(true);
   });
});

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

   let weightMeasurement = new SnatchMeasurementType();
   let weightMeasurements = new Array<MeasurementTypeOf<EWeightUnits>>();
   weightMeasurements.push(weightMeasurement);

   let timeMeasurement = new Row250mMeasurementType();
   let timeMeasurements = new Array<MeasurementTypeOf<ETimeUnits>>();
   timeMeasurements.push(timeMeasurement);

   cohort = new Cohort(new PersistenceDetails("id", 1, 1),
      new CohortName("Joe"),
      period,
      people,
      people,
      weightMeasurements,
      timeMeasurements);

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
