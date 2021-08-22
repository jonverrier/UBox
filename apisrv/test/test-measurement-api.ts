'use strict';
// Copyright TXPCo ltd, 2021
import axios from 'axios';

import { Logger } from '../../core/src/Logger';
import { PersistenceDetails } from "../../core/src/Persistence";
import { MeasurementOf } from '../../core/src/Observation';
import { IdListCodec, IdList } from '../../core/src/IOCommon';
import { WeightMeasurementCodec, WeightMeasurementsCodec} from '../../core/src/IOObservation';
import { EWeightUnits, ERepUnits, QuantityOf } from "../../core/src/Quantity";
import { SnatchMeasurementType } from '../../core/src/FitnessObservations';

var expect = require("chai").expect;

import { EApiUrls } from '../src/ApiUrls';

var root: string = 'http://localhost:4000';
var saveUrl: string = root + EApiUrls.SaveWeightMeasurement;
var queryUrl: string = root + EApiUrls.QueryWeightMeasurement;
var queryManyUrl: string = root + EApiUrls.QueryWeightMeasurements;

describe("MeasurementApi - weight", function () {
   let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
   let repeats = 1;
   let measurementType = new SnatchMeasurementType();

   var measurement1: MeasurementOf<EWeightUnits> = new MeasurementOf<EWeightUnits>(
      new PersistenceDetails(null, 1, 2), quantity, repeats, 0, measurementType, "1234");

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

   it("Needs to save and then retrieve a Measurement using lists", async function (done) {

      let inputCodec = new IdListCodec();

      let codec = new WeightMeasurementCodec();
      let encoded = codec.encode(measurement1);

      try {
         // Save a new object then read it back
         const response = await axios.put(saveUrl, encoded);
         let decoded = codec.decode(response.data);

         // Build array query & ask for a list
         let ids = new Array<string>();
         ids.push(decoded._persistenceDetails._id.toString());
         let idList: IdList = new IdList(ids);
         encoded = inputCodec.encode(idList);

         const response2 = await axios.put(queryManyUrl, encoded);
         let weightCodec = new WeightMeasurementsCodec();
         let decodedMeasurements = weightCodec.decode(response2.data);

         let personReturned = new MeasurementOf<EWeightUnits> (decodedMeasurements[0]);

         // test is that we get the same Measurement back as array[0] as we got from the specific query
         if (personReturned.equals(new MeasurementOf<EWeightUnits>(decoded))) {
            done();
         } else {
            var logger = new Logger();
            var e: string = "Returned: " + personReturned + "original: " + decoded;
            logger.logError("MeasurementAPI", "Save-LoadMany", "Error", e);
            done(e)
         }

      } catch (e) {
         var logger = new Logger();
         logger.logError("PersonApi", "Save-LoadMany", "Error", e.toString());
         done(e);
      }

   });
});


