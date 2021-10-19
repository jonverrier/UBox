'use strict';
// Copyright TXPCo ltd, 2021
import axios from 'axios';

import { TimeUnits, WeightUnits, EWeightUnits, QuantityOf} from '../../core/src/Quantity';
import { Logger } from '../../core/src/Logger';
import { PersistenceDetails } from "../../core/src/Persistence";
import { Name, Url } from "../../core/src/Party";
import { ELoginProvider, LoginDetails, EmailAddress, Roles, ERoleType, Person} from "../../core/src/Person";
import { MeasurementTypeOf, MeasurementOf} from "../../core/src/Observation";
import { SnatchMeasurementType, Row250mMeasurementType } from '../../core/src/FitnessObservations';
import { ECohortPeriod, CohortName, CohortTimePeriod, Cohort } from "../../core/src/Cohort";
import { CohortCodec } from '../../core/src/IOCohort';
import { PersonCodec } from '../../core/src/IOPerson';
import { WeightMeasurementCodec } from '../../core/src/IOObservation';
import { MeasurementApi } from './ObservationApi';

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
      new Name("Joe"),
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

      // Create and save a person 
      let person1:Person = new Person(new PersistenceDetails(null, 1, 1),
         new LoginDetails(ELoginProvider.Apple, "123"),
         new Name("Joe"),
         new EmailAddress("Joe@mail.com", true), new Url("https://jo.pics.com", false),
         new Roles(Array<ERoleType>(ERoleType.Member)));

      let personCodec = new PersonCodec();
      let encodedPerson = personCodec.encode(person1);
      const personResponse = await axios.put(root + EApiUrls.SavePerson, encodedPerson);
      let savedPerson:Person = personCodec.tryCreateFrom (personResponse.data);

      // Create and save a measurement on the person 
      let quantity = new QuantityOf<WeightUnits>(60, EWeightUnits.Kg);
      let repeats = 1;
      let measurementType = new SnatchMeasurementType();
      let api: MeasurementApi = new MeasurementApi(root);
      var measurement1: MeasurementOf<WeightUnits> = new MeasurementOf<WeightUnits>(
         new PersistenceDetails(null, 1, 2), quantity, repeats, 0, measurementType, savedPerson.persistenceDetails.key);

      let savedMeasurement: MeasurementOf<WeightUnits> = await api.save(measurement1);

      // Create and save a Cohort, with the Person as a Member
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


