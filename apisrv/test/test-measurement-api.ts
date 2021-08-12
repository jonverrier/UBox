'use strict';
// Copyright TXPCo ltd, 2021
import axios from 'axios';

import { Logger } from '../../core/src/Logger';
import { PersistenceDetails } from "../../core/src/Persistence";
import { MeasurementOf, IWeightMeasurementStore } from '../../core/src/Observation';
import { WeightMeasurementCodec } from '../../core/src/IOObservation';
import { EWeightUnits, ERepUnits, QuantityOf } from "../../core/src/Quantity";
import { SnatchMeasurementType } from '../../core/src/FitnessObservations';

var expect = require("chai").expect;

var saveUrl: string = 'http://localhost:4000/api/measurementSave';
var queryUrl: string = 'http://localhost:4000/api/measurementQuery';

describe("MeasurementApi", function () {
   let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
   let repeats = new QuantityOf<ERepUnits>(1, ERepUnits.Reps);
   let measurementType = new SnatchMeasurementType();

   var measurement1: MeasurementOf<EWeightUnits> = new MeasurementOf<EWeightUnits>(
      new PersistenceDetails(null, 1, 2), quantity, repeats, 0, measurementType, "1234");

   beforeEach(function () {
   });

   it("Needs to save a new Measurement", async function (done) {

      let codec = new WeightMeasurementCodec();
      let encoded = codec.encode(measurement1);

      try {
         const response = await axios.put(saveUrl, encoded);
         let decoded = codec.decode(response.data);
         done();
      } catch (e) {
         var logger = new Logger();
         logger.logError("MeasurementApi", "Save", "Error", e.toString());
         done(e);
      }

   });

   /* 
   it("Needs to save and then retrieve an existing Measurement", async function (done) {

      let codec = new WeightMeasurementCodec();
      let encoded = codec.encode(measurement1);

      try {
         const response = await axios.put(saveUrl, encoded);
         let decoded = codec.decode(response.data);
         const response2 = await axios.get(queryUrl, { params: { _id: decoded._persistenceDetails._id.toString() } });
         done();
      } catch (e) {
         var logger = new Logger();
         logger.logError("PersonApi", "Save-Load", "Error", e.toString());
         done(e);
      }

   });
   */
});


