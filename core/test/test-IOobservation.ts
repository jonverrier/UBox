'use strict';
// Copyright TXPCo ltd, 2021

import { Logger } from '../src/Logger';
import { PersistenceDetails } from '../src/Persistence';
import { TimeUnits, ETimeUnits, WeightUnits, EWeightUnits, QuantityOf } from '../src/Quantity';
import { RangeOf } from '../src/Range';
import { WeightMeasurementTypeCodec, WeightMeasurementCodec, TimeMeasurementTypeCodec, TimeMeasurementCodec } from '../src/IOObservation';
import { CleanMeasurementType, Row250mMeasurementType } from '../src/FitnessObservations';
import { MeasurementTypeOf, MeasurementOf, EMeasurementUnitType} from '../src/Observation';

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
            _unitType: EMeasurementUnitType.Weight,
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
      let encodedRange = new RangeOf<WeightUnits>(
         new QuantityOf<WeightUnits>(encoded._range._lo.amount, encoded._range._lo._unit),
         encoded._range._loInclEq,
         new QuantityOf<WeightUnits>(encoded._range._hi.amount, encoded._range._hi._unit),
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

   var quantity = new QuantityOf<WeightUnits>(10, EWeightUnits.Kg);
   var repeats = 1;
   var codec: WeightMeasurementCodec = new WeightMeasurementCodec();
   var measurementType: MeasurementTypeOf<WeightUnits> = new CleanMeasurementType();
   var measurement: MeasurementOf<WeightUnits> = new MeasurementOf<WeightUnits>(new PersistenceDetails("id", 1, 2), quantity, repeats, 0, measurementType, "1234");;

   beforeEach(function () {

   });

   it("Needs to decode a WeightMeasurement from clean input.", function () {

      var caught: boolean = false;

      try {

         codec.decode({
            _persistenceDetails: { _key: "Joe", _schemaVersion: 0, _sequenceNumber: 0 },
            _quantity: quantity,
            _repeats: repeats,
            _cohortPeriod: 1,
            _measurementType: {
               _measurementType: measurementType.measurementType,
               _unitType: EMeasurementUnitType.Weight,
               _range: measurementType.range,
               _trend: measurementType.trend
            },
            _subjectKey: "teststring"
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
      let decoded: MeasurementOf<WeightUnits>;

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
            _unitType: EMeasurementUnitType.Weight,
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
      let encodedRange = new RangeOf<WeightUnits>(
         new QuantityOf<WeightUnits>(encoded._range._lo.amount, encoded._range._lo._unit),
         encoded._range._loInclEq,
         new QuantityOf<WeightUnits>(encoded._range._hi.amount, encoded._range._hi._unit),
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

describe("IOTimeMeasurementType", function () {


   var codec: TimeMeasurementTypeCodec = new TimeMeasurementTypeCodec();
   var measurementType: Row250mMeasurementType = new Row250mMeasurementType();

   it("Needs to encode then decode a TimeMeasurementType.", function () {

      let encoded = codec.encode(measurementType);
      let decoded: Row250mMeasurementType;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom(encoded);
      } catch (e) {
         var logger = new Logger();
         logger.logError("TimeMeasurementType", "Decode", "Error", e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(measurementType)).to.equal(true);
   });
});

describe("IOTimeMeasurement", function () {

   var quantity = new QuantityOf<TimeUnits>(10, ETimeUnits.Seconds);
   var repeats = 1;
   var codec: TimeMeasurementCodec = new TimeMeasurementCodec();
   var measurementType: MeasurementTypeOf<TimeUnits> = new Row250mMeasurementType();
   var measurement: MeasurementOf<TimeUnits> = new MeasurementOf<TimeUnits>(new PersistenceDetails("id", 1, 2), quantity, repeats, 0, measurementType, "1234");;

   it("Needs to encode then decode a TimeMeasurement.", function () {

      let encoded = codec.encode(measurement);
      let decoded: MeasurementOf<TimeUnits>;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom(encoded);
      } catch (e) {
         var logger = new Logger();
         logger.logError("TimeMeasurement", "Encode-Decode", "Error", e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(measurement)).to.equal(true);
   });

});