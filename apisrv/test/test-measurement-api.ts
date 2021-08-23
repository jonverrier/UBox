'use strict';
// Copyright TXPCo ltd, 2021
import axios from 'axios';

import { Logger } from '../../core/src/Logger';
import { PersistenceDetails } from "../../core/src/Persistence";
import { MeasurementOf } from '../../core/src/Observation';
import { WeightUnits, EWeightUnits, QuantityOf, TimeUnits, ETimeUnits } from "../../core/src/Quantity";
import { SnatchMeasurementType, Run100m } from '../../core/src/FitnessObservations';
import { MeasurementApi } from './ObservationApi';

var expect = require("chai").expect;

import { EApiUrls } from '../src/ApiUrls';

var root: string = 'http://localhost:4000';

describe("MeasurementApi - weight", function () {
   let quantity = new QuantityOf<WeightUnits>(60, EWeightUnits.Kg);
   let repeats = 1;
   let measurementType = new SnatchMeasurementType();
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
         const response2 = await api.load(response.persistenceDetails._id);
         done();
      } catch (e) {
         var logger = new Logger();
         logger.logError("PersonApi", "Save-Load", "Error", e.toString());
         done(e);
      }

   });

   it("Needs to save and then retrieve a Measurement using lists", async function (done) {

      try {
         // Save a new object 
         const response = await api.save (measurement1);

         // Build array query & ask for a list
         let ids = new Array<string>();
         ids.push(response.persistenceDetails._id.toString());
         const response2 = await api.loadMany(ids);
         console.log(response2);
         let returned = response2[0];

         // test is that we get the same Measurement back as array[0] as we got from the specific query
         if (returned.equals(response)) {
            done();
         } else {
            var logger = new Logger();
            var e: string = "Returned: " + returned + "original: " + measurement1;
            logger.logError("MeasurementAPI", "Save-LoadMany", "Error", e);
            done(e)
         }

      } catch (e) {
         var logger = new Logger();
         logger.logError("MeasurementApi", "Save-LoadMany", "Error", e.toString());
         done(e);
      }

   });
});

describe("MeasurementApi - time", function () {
   let quantity = new QuantityOf<TimeUnits>(20, ETimeUnits.Seconds);
   let repeats = 1;
   let measurementType = new Run100m();
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
         const response2 = await api.load(response.persistenceDetails._id);
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
         const response = await api.save(measurement1);

         // Build array query & ask for a list
         let ids = new Array<string>();
         ids.push(response.persistenceDetails._id);
         const response2 = await api.loadMany(ids);
         console.log(response2);
         let returned = response2[0];

         // test is that we get the same Measurement back as array[0] as we got from the specific query
         if (returned.equals(response)) {
            done();
         } else {
            var logger = new Logger();
            var e: string = "Returned: " + returned + "original: " + measurement1;
            logger.logError("MeasurementAPI", "Save-LoadMany", "Error", e);
            done(e)
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
   let quantityOfTime = new QuantityOf<TimeUnits>(20, ETimeUnits.Seconds);
   let timeMeasurementType = new Run100m();
   let quantityOfWeight = new QuantityOf<WeightUnits>(60, EWeightUnits.Kg);
   let weightMeasurementType = new SnatchMeasurementType();

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
      let ids = new Array<any>();
      ids.push(response1.persistenceDetails._id);
      ids.push(response2.persistenceDetails._id);

      try {

         const response3 = await api.loadMany(ids);

         // test is that we get two documents back
         if (response3.length === 2) {
            done();
         } else {
            var logger = new Logger();
            var e: string = "Returned: " + response3;
            logger.logError("MeasurementAPI", "Save-LoadMany", "Error", e);
            done(e)
         }

      } catch (e) {
         var logger = new Logger();
         logger.logError("MeasurementApi", "Save-LoadMany", "Error", e.toString());
         done(e);
      }

   });
});


