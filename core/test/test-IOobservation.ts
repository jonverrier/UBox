'use strict';
// Copyright TXPCo ltd, 2021

import { Logger } from '../src/Logger';
import { PersistenceDetails } from '../src/Persistence';
import { ERepUnits, EWeightUnits, QuantityOf } from '../src/Quantity';
import { RangeOf } from '../src/Range';
import { WeightMeasurementTypeCodec, WeightMeasurementCodec} from '../src/IOObservation';
import { CleanMeasurementType } from '../src/FitnessObservations';
import { MeasurementTypeOf, MeasurementOf} from '../src/Observation';

var expect = require("chai").expect;


describe("IOWeightMeasurementType", function () {


   var codec: WeightMeasurementTypeCodec;
   var measurementType: CleanMeasurementType = new CleanMeasurementType();

   beforeEach(function () {
      codec = new WeightMeasurementTypeCodec();
   });

   it("Needs to decode a WeightMeasurementType from clean input.", function () {

      var caught: boolean = false;

      try {

         codec.decode({
            _measurementType: measurementType.measurementType,
            _range: measurementType.range,
            _trend: measurementType.trend
         });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });


   it("Needs to encode WeightMeasurementType.", function () {

      let encoded = codec.encode(measurementType);
      let encodedRange = new RangeOf<EWeightUnits>(
         new QuantityOf<EWeightUnits>(encoded._range._lo.amount, encoded._range._lo._unit),
         encoded._range._loInclEq,
         new QuantityOf<EWeightUnits>(encoded._range._hi.amount, encoded._range._hi._unit),
         encoded._range._hiInclEq);       

      expect(encoded._measurementType).to.equal(measurementType.measurementType);
      expect(measurementType.range.equals(encodedRange)).to.equals(true);
      expect(encoded._trend).to.equal(measurementType.trend);
   });

   it("Needs to encode then decode WeightMeasurementType.", function () {

      let encoded = codec.encode(measurementType);
      let decoded: CleanMeasurementType;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom(encoded);
      } catch (e) {
         var logger = new Logger();
         logger.logError("WeightMeasurementType", "Decode", "Error", e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(measurementType)).to.equal(true);
   });
});

describe("IOWeightMeasurement", function () {

   var quantity = new QuantityOf<EWeightUnits>(10, EWeightUnits.Kg);
   var repeats = new QuantityOf<ERepUnits>(1, ERepUnits.Reps);
   var codec: WeightMeasurementCodec = new WeightMeasurementCodec();
   var measurementType: MeasurementTypeOf<EWeightUnits> = new CleanMeasurementType();
   var measurement: MeasurementOf<EWeightUnits> = new MeasurementOf<EWeightUnits>(new PersistenceDetails("id", 1, 2), quantity, repeats, 0, measurementType, "1234");;

   beforeEach(function () {

   });

   it("Needs to decode a WeightMeasurement from clean input.", function () {

      var caught: boolean = false;

      try {

         codec.decode({
            _persistenceDetails: { _id: "Joe", _schemaVersion: 0, _sequenceNumber: 0 },
            _quantity: quantity,
            _repeats: repeats,
            _cohortPeriod: 1,
            _measurementType: {
               _measurementType: measurementType.measurementType,
               _range: measurementType.range,
               _trend: measurementType.trend
            },
            _subjectExternalId: "teststring"
         });
      } catch (e) {
         var logger = new Logger();
         logger.logError("WeightMeasurement", "Decode", "Error", e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
   });


   it("Needs to encode WeightMeasurement.", function () {

      var caught: boolean = false;

      try {
         let encoded = codec.encode(measurement);
      } catch (e) {
         var logger = new Logger();
         logger.logInfo("WeightMeasurement", "Encode", "Error", e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to encode then decode WeightMeasurement.", function () {

      let encoded = codec.encode(measurement);
      let decoded: MeasurementOf<EWeightUnits>;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom(encoded);
      } catch (e) {
         var logger = new Logger();
         logger.logError("WeightMeasurement", "Encode-Decode", "Error", e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(measurement)).to.equal(true);
   });

});