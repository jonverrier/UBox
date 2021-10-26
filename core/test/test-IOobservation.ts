'use strict';
// Copyright TXPCo ltd, 2021

import { Logger } from '../src/Logger';
import { PersistenceDetails } from '../src/Persistence';
import { TimeUnits, ETimeUnits, WeightUnits, EWeightUnits, QuantityOf } from '../src/Quantity';
import { RangeOf } from '../src/Range';
import { WeightMeasurementTypeCodec, WeightMeasurementCodec, TimeMeasurementTypeCodec, TimeMeasurementCodec, MeasurementsCodec } from '../src/IOObservation';
import { MeasurementTypeOf, MeasurementOf, EMeasurementUnitType, IMeasurementTypeFactoryFor} from '../src/Observation';
import { CleanMeasurementType, Row250mMeasurementType } from '../src/FitnessObservations';
import { OlympicLiftMeasurementTypeFactory, SpeedMeasurementTypeFactory } from '../src/ObservationDictionary';

var expect = require("chai").expect;



describe("IOWeightMeasurementType", function () {

   let weightFactory: IMeasurementTypeFactoryFor<WeightUnits> = new OlympicLiftMeasurementTypeFactory();

   var codec: WeightMeasurementTypeCodec;
   var measurementType: CleanMeasurementType = new CleanMeasurementType(weightFactory);

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
         new QuantityOf<WeightUnits>(encoded._range._lo._amount, encoded._range._lo._unit),
         encoded._range._loInclEq,
         new QuantityOf<WeightUnits>(encoded._range._hi._amount, encoded._range._hi._unit),
         encoded._range._hiInclEq);

      expect(encoded._measurementType).to.equal(measurementType.measurementType);
      expect(encoded._trend).to.equal(measurementType.trend);
      expect(measurementType.range.equals(encodedRange)).to.equal(true);
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
   let weightFactory: IMeasurementTypeFactoryFor<WeightUnits> = new OlympicLiftMeasurementTypeFactory();

   var quantity = new QuantityOf<WeightUnits>(10, EWeightUnits.Kg);
   var repeats = 1;
   var codec: WeightMeasurementCodec = new WeightMeasurementCodec();
   var measurementType: MeasurementTypeOf<WeightUnits> = new CleanMeasurementType(weightFactory);
   var measurement: MeasurementOf<WeightUnits> = new MeasurementOf<WeightUnits>(new PersistenceDetails("id", 1, 2), quantity, repeats, 0, measurementType, "1234");;

   it("Needs to decode a WeightMeasurement from clean input.", function () {

      var caught: boolean = false;

      try {

         codec.decode({
            _persistenceDetails: { _key: "Joe", _schemaVersion: 0, _sequenceNumber: 0 },
            _quantity: quantity,
            _repeats: repeats,
            _cohortPeriod: 1,
            _measurementType: measurementType.measurementType,
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


   it("Needs to encode & decode multiple WeightMeasurements", function () {

      var measurements: Array<MeasurementOf<WeightUnits>> = new Array<MeasurementOf<WeightUnits>>();
      measurements.push(measurement);
      measurements.push(measurement);

      var measurementsCodec: MeasurementsCodec = new MeasurementsCodec();
      var encoded = measurementsCodec.encode(measurements);

      var newMeasurements: Array<MeasurementOf<WeightUnits>> = measurementsCodec.tryCreateFrom(encoded);

      expect(newMeasurements[0].equals(measurement)).to.equal(true);
   });

});

describe("IOTimeMeasurementType", function () {
   let timeFactory: IMeasurementTypeFactoryFor<WeightUnits> = new SpeedMeasurementTypeFactory();

   var codec: TimeMeasurementTypeCodec = new TimeMeasurementTypeCodec();
   var measurementType: Row250mMeasurementType = new Row250mMeasurementType(timeFactory);

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
   let timeFactory: IMeasurementTypeFactoryFor<WeightUnits> = new SpeedMeasurementTypeFactory();

   var quantity = new QuantityOf<TimeUnits>(10, ETimeUnits.Seconds);
   var repeats = 1;
   var codec: TimeMeasurementCodec = new TimeMeasurementCodec();
   var measurementType: MeasurementTypeOf<TimeUnits> = new Row250mMeasurementType(timeFactory);
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

   it("Needs to encode & decode multiple TimeMeasurements", function () {


      var measurements: Array<MeasurementOf<TimeUnits>> = new Array<MeasurementOf<TimeUnits>>();
      measurements.push(measurement);
      measurements.push(measurement);

      var measurementsCodec: MeasurementsCodec = new MeasurementsCodec();
      var encoded = measurementsCodec.encode(measurements);

      var newMeasurements: Array<MeasurementOf<TimeUnits>> = measurementsCodec.tryCreateFrom(encoded);

      expect(newMeasurements[0].equals(measurement)).to.equal(true);
   });

});