'use strict';
// Copyright TXPCo ltd, 2021
import axios from 'axios';

import { Logger } from '../../core/src/Logger';
import { PersistenceDetails } from "../../core/src/Persistence";
import { MeasurementOf, IMeasurementTypeFactoryFor } from '../../core/src/Observation';
import { WeightUnits, EWeightUnits, QuantityOf, TimeUnits, ETimeUnits } from "../../core/src/Quantity";
import { SnatchMeasurementType, Run800mMeasurementType } from '../../core/src/FitnessObservations';
import { OlympicLiftMeasurementTypeFactory, SpeedMeasurementTypeFactory } from "../../core/src/ObservationDictionary";
import { MeasurementApi } from './ObservationApi';

var expect = require("chai").expect;

import { EApiUrls } from '../src/ApiUrls';

var root: string = 'http://localhost:4000';

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

describe("MeasurementApi - weight", function () {
   let weightFactory: IMeasurementTypeFactoryFor<WeightUnits> = new OlympicLiftMeasurementTypeFactory();

   let quantity = new QuantityOf<WeightUnits>(60, EWeightUnits.Kg);
   let repeats = 1;
   let measurementType = new SnatchMeasurementType(weightFactory);
   let api: MeasurementApi = new MeasurementApi(root);

   var measurement1: MeasurementOf<WeightUnits> = new MeasurementOf<WeightUnits>(
      new PersistenceDetails(null, 1, 2), quantity, repeats, 0, measurementType, "1234");

   it("Needs to save a new Measurement", async function (done) {

      try {
         let decoded = api.save(measurement1); 
         done();
      } catch (e) {
         var logger = new Logger();
         logger.logError("MeasurementApi", "Save", "Error", e.toString());
         done(e);
      }

   });

   it("Needs to save and then retrieve an existing Measurement", async function (done) {

      try {
         const response = await api.save(measurement1);
         const response2 = await api.loadOne (response.persistenceDetails.key);
         done();
      } catch (e) {
         var logger = new Logger();
         logger.logError("MeasurementApi", "Save-Load", "Error", e.toString());
         done(e);
      }

   });

   it("Needs to save and then retrieve a Measurement using lists", async function (done) {

      try {
         // Save a new object 
         const firstSave = await api.save(measurement1);

         // Build array query & ask for a list
         let ids = new Array<string>();
         ids.push(firstSave.persistenceDetails.key);
         const response2 = await api.loadMany(ids);

         let secondSave = response2[0];

         // test is that we get the same Measurement back as array[0] as we got from the specific query
         if (secondSave.equals(firstSave)) {
            done();
         } else {
            var logger = new Logger();
            var e: string = " Returned: " + JSON.stringify(secondSave, getCircularReplacer()) + "Original: " + JSON.stringify(firstSave, getCircularReplacer());
            logger.logError("test-measurement-api", "Save-LoadMany", "Error", e);
            done(e)
         }

      } catch (e) {
         var logger = new Logger();
         logger.logError("test-measurement-api", "Save-LoadMany", "Error", e.toString());
         done(e);
      }

   });

   it("Needs to save and then retrieve a Measurement using lists of SubjectIds", async function (done) {

      try {
         // Save a new object 
         const firstSave = await api.save(measurement1);

         // Build array query & ask for a list
         let ids = new Array<string>();
         ids.push(firstSave.subjectKey.toString());
         const response2 = await api.loadManyForPeople (ids);

         let secondSave = response2[0];

         // test is that we get the same Measurement back as array[0] as we got from the specific query
         if (secondSave.subjectKey === firstSave.subjectKey) {
            done();
         } else {
            var logger = new Logger();
            var e: string = " Returned: " + JSON.stringify(secondSave, getCircularReplacer()) + "Original: " + JSON.stringify(firstSave, getCircularReplacer());
            logger.logError("test-measurement-api", "Save-LoadMany", "Error", e);
            done(new Error(e));
         }

      } catch (e) {
         var logger = new Logger();
         logger.logError("test-measurement-api", "Save-LoadMany", "Error", e.toString());
         done(e);
      }

   });
});

describe("MeasurementApi - time", function () {
   let timeFactory: IMeasurementTypeFactoryFor<TimeUnits> = new SpeedMeasurementTypeFactory();

   let quantity = new QuantityOf<TimeUnits>(200, ETimeUnits.Seconds);
   let repeats = 1;
   let measurementType = new Run800mMeasurementType(timeFactory);
   let api: MeasurementApi = new MeasurementApi(root);

   var measurement1: MeasurementOf<TimeUnits> = new MeasurementOf<TimeUnits>(
      new PersistenceDetails(null, 1, 2), quantity, repeats, 0, measurementType, "1234");

   it("Needs to save a new Measurement", async function (done) {


      try {
         let decoded = api.save(measurement1);
         done();
      } catch (e) {
         var logger = new Logger();
         logger.logError("MeasurementApi", "Save", "Error", e.toString());
         done(e);
      }

   });

   it("Needs to save and then retrieve an existing Measurement", async function (done) {

      try {
         const response = await api.save(measurement1);
         const response2 = await api.loadOne (response.persistenceDetails.key);
         done();
      } catch (e) {
         var logger = new Logger();
         logger.logError("MeasurementApi", "Save-Load", "Error", e.toString());
         done(new Error(e));
      }

   });

   it("Needs to save and then retrieve a Measurement using lists", async function (done) {

      try {
         // Save a new object 
         const firstSave = await api.save(measurement1);

         // Build array query & ask for a list
         let ids = new Array<string>();
         ids.push(firstSave.persistenceDetails.key);
         const response2 = await api.loadMany(ids);

         let secondSave = response2[0];

         // test is that we get the same Measurement back as array[0] as we got from the specific query
         if (secondSave.equals(firstSave)) {
            done();
         } else {
            var logger = new Logger();
            var e: string = " Returned: " + JSON.stringify(secondSave, getCircularReplacer()) + "Original: " + JSON.stringify(firstSave, getCircularReplacer());
            logger.logError("MeasurementApi", "Save-LoadMany", "Error", e.toString());
            done(new Error(e));
         }

      } catch (e) {
         var logger = new Logger();
         logger.logError("MeasurementApi", "Save-LoadMany", "Error", e.toString());
         done(e);
      }

   });
});

describe("MeasurementApi - heterogenous", function () {
   let repeats = 1;
   let weightFactory: IMeasurementTypeFactoryFor<WeightUnits> = new OlympicLiftMeasurementTypeFactory();
   let timeFactory: IMeasurementTypeFactoryFor<TimeUnits> = new SpeedMeasurementTypeFactory();

   let quantityOfTime = new QuantityOf<TimeUnits>(200, ETimeUnits.Seconds);
   let timeMeasurementType = new Run800mMeasurementType(timeFactory);
   let quantityOfWeight = new QuantityOf<WeightUnits>(60, EWeightUnits.Kg);
   let weightMeasurementType = new SnatchMeasurementType(weightFactory);

   var timeMeasurement: MeasurementOf<TimeUnits> = new MeasurementOf<TimeUnits>(
      new PersistenceDetails(null, 1, 2), quantityOfTime, repeats, 0, timeMeasurementType, "1234");
   var weightMeasurement: MeasurementOf<WeightUnits> = new MeasurementOf<WeightUnits>(
      new PersistenceDetails(null, 1, 2), quantityOfWeight, repeats, 0, weightMeasurementType, "1234");

   let api: MeasurementApi = new MeasurementApi(root);

   it("Needs to save and then retrieve a Measurement using lists", async function (done) {

      // Save a new time object 
      const response1 = await api.save(timeMeasurement);

      // Save a new weight object 
      const response2 = await api.save(weightMeasurement);

      // Build array query 
      let ids = new Array<string>();
      ids.push(response1.persistenceDetails.key);
      ids.push(response2.persistenceDetails.key);

      try {

         const response3 = await api.loadMany(ids);

         // test is that we get two documents back
         if (response3.length === 2) {
            done();
         } else {
            var logger = new Logger();
            var e: string = "Returned: " + response3;
            logger.logError("MeasurementAPI", "Save-LoadMany", "Error", e);
            done(new Error(e));
         }

      } catch (e) {
         var logger = new Logger();
         logger.logError("MeasurementApi", "Save-LoadMany", "Error", e.toString());
         done(e);
      }

   });
});


