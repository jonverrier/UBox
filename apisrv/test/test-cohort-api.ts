'use strict';
// Copyright TXPCo ltd, 2021
import axios from 'axios';

import { TimeUnits, WeightUnits } from '../../core/src/Quantity';
import { Logger } from '../../core/src/Logger';
import { PersistenceDetails } from "../../core/src/Persistence";
import { ELoginProvider, LoginDetails, Name, EmailAddress, Url, Person } from "../../core/src/Person";
import { MeasurementTypeOf } from "../../core/src/Observation";
import { SnatchMeasurementType, Row250mMeasurementType } from '../../core/src/FitnessObservations';
import { ECohortPeriod, CohortName, CohortTimePeriod, Cohort } from "../../core/src/Cohort";
import { CohortCodec } from '../../core/src/IOCohort'

var expect = require("chai").expect;

import { EApiUrls } from '../src/ApiUrls';

var root: string = 'http://localhost:4000';
var saveUrl: string = root + EApiUrls.SaveCohort;
var queryUrl: string = root + EApiUrls.QueryCohort;

describe("CohortApi", function () {
   let cohort1;
   let period = new CohortTimePeriod(new Date(), ECohortPeriod.Week, 1);

   let person = new Person(new PersistenceDetails(null, 1, 1),
      new LoginDetails(ELoginProvider.Apple, "xxx"),
      new Name("Joe", null),
      new EmailAddress("Joe@mail.com", true),
      new Url("https://jo.pics.com", false), null);

   beforeEach(function () {
      let weightMeasurement = new SnatchMeasurementType();
      let weightMeasurements = new Array<MeasurementTypeOf<WeightUnits>>();
      weightMeasurements.push(weightMeasurement); 

      let timeMeasurement = new Row250mMeasurementType();
      let timeMeasurements = new Array<MeasurementTypeOf<TimeUnits>>();
      timeMeasurements.push(timeMeasurement);

      let people = new Array<Person>();
      people.push(person); 

      cohort1 = new Cohort(new PersistenceDetails(null, 1, 1),
         new CohortName("Joe"),
         period,
         people,
         people,
         weightMeasurements,
         timeMeasurements);
   });

   it("Needs to save a new Cohort", async function (done) {

      let codec = new CohortCodec();
      let encoded = codec.encode(cohort1);

      try {
         const response = await axios.put(saveUrl, encoded);
         var logger = new Logger();
         let decoded = codec.decode(response.data);
         done();
      } catch (e) {
         var logger = new Logger();
         logger.logError("CohortApi", "Save", "Error", e.toString());
         done(e);
      }

   });

   
   it("Needs to save and then retrieve an existing Cohort", async function (done) {

      let codec = new CohortCodec();
      let encoded = codec.encode(cohort1);

      try {
         const response = await axios.put(saveUrl, encoded);
         let decoded = codec.decode(response.data);
         const response2 = await axios.get(queryUrl, { params: { _key: decoded._persistenceDetails._key.toString() } });
         done();
      } catch (e) {
         var logger = new Logger();
         logger.logError("CohortApi", "Save-Load", "Error", e.toString());
         done(e);
      }

   });

});


