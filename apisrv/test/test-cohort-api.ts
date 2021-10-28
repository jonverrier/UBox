'use strict';
// Copyright TXPCo ltd, 2021
import axios from 'axios';

import { BaseUnit, BaseUnits } from '../../core/src/Unit';
import { Quantity} from '../../core/src/Quantity';
import { Logger } from '../../core/src/Logger';
import { PersistenceDetails } from "../../core/src/Persistence";
import { Name, Url } from "../../core/src/Party";
import { ELoginProvider, LoginDetails, EmailAddress, Roles, ERoleType, Person } from "../../core/src/Person";
import { MeasurementType } from "../../core/src/ObservationType";
import { MeasurementTypes } from "../../core/src/ObservationTypeDictionary";
import { Measurement } from "../../core/src/Observation";
import { ECohortPeriod, CohortName, CohortTimePeriod, Cohort, ECohortType } from "../../core/src/Cohort";
import { CohortCodec } from '../../core/src/IOCohort';
import { PersonCodec } from '../../core/src/IOPerson';
import { MeasurementApi } from './ObservationApi';

var expect = require("chai").expect;

import { EApiUrls } from '../src/ApiUrls';

var root: string = 'http://localhost:4000';
var saveUrl: string = root + EApiUrls.SaveCohort;
var queryUrl: string = root + EApiUrls.QueryCohort;

const getCircularReplacer = () => {
   const seen = new WeakSet();
   return (key, value) => {
      if (typeof value === "object" && value !== null) {
         if (seen.has(value)) {
            return;
         }
         seen.add(value);
      }
      return value;
   };
};

describe("CohortApi", function () {

   let cohort1;
   let period = new CohortTimePeriod(new Date(), ECohortPeriod.Week, 1);

   let person = new Person(new PersistenceDetails(null, 1, 1),
      new LoginDetails(ELoginProvider.Apple, "xxx"),
      new Name("Joe"),
      new EmailAddress("Joe@mail.com", true),
      new Url("https://jo.pics.com", false), null);

   beforeEach(function () {
      let weightMeasurement = MeasurementTypes.snatch;
      let weightMeasurements = new Array<MeasurementType>();
      weightMeasurements.push(weightMeasurement); 

      let timeMeasurement = MeasurementTypes.row250;
      let timeMeasurements = new Array<MeasurementType>();
      timeMeasurements.push(timeMeasurement);

      let people = new Array<Person>();
      people.push(person); 

      cohort1 = new Cohort(new PersistenceDetails(null, 1, 1),
         new CohortName("Joe"),
         period,
         people,
         people,
         ECohortType.OlympicLifting);
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
      let quantity = new Quantity(60, BaseUnits.kilogram);
      let repeats = 1;
      let measurementType = MeasurementTypes.snatch;
      let api:MeasurementApi = new MeasurementApi(root);
      var measurement1:Measurement = new Measurement(
         new PersistenceDetails(null, 1, 2), quantity, repeats, 0, measurementType, savedPerson.persistenceDetails.key);

      let savedMeasurement:Measurement = await api.save(measurement1);

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
         logger.logError("CohortApi", "Save", "Error", JSON.stringify(e, getCircularReplacer()));
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
         logger.logError("CohortApi", "Save-Load", "Error", JSON.stringify(e, getCircularReplacer()));
         done(e);
      }

   });

});


