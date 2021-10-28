'use strict';
// Copyright TXPCo ltd, 2021

import { Logger } from '../src/Logger';
import { PersistenceDetails } from '../src/Persistence';
import { EBaseUnitDimension, BaseUnits } from '../src/Unit';
import { Quantity } from '../src/Quantity';
import { Range } from '../src/Range';
import { MeasurementType} from '../src/ObservationType';
import { MeasurementTypes } from '../src/ObservationTypeDictionary';
import { Measurement } from '../src/Observation';
import { MeasurementTypeCodec, MeasurementCodec, MeasurementsCodec } from '../src/IOObservation';

var expect = require("chai").expect;



describe("IOMeasurementType", function () {

   var codec: MeasurementTypeCodec;
   var measurementType: MeasurementType = MeasurementTypes.clean;

   beforeEach(function () {
      codec = new MeasurementTypeCodec();
   });

   it("Needs to decode a MeasurementType from clean input.", function () {

      var caught: boolean = false;

      try {

         codec.decode({
            _measurementType: measurementType.measurementType,
            _unitType: EBaseUnitDimension.Weight,
            _range: measurementType.range,
            _trend: measurementType.trend
         });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });


   it("Needs to encode MeasurementType.", function () {

      let encoded = codec.encode(measurementType);
      let encodedRange = new Range(
         new Quantity(encoded._range._lo),
         encoded._range._loInclEq,
         new Quantity(encoded._range._hi),
         encoded._range._hiInclEq);

      expect(encoded._measurementType).to.equal(measurementType.measurementType);
      expect(encoded._trend).to.equal(measurementType.trend);
      expect(measurementType.range.equals(encodedRange)).to.equal(true);
   });

   it("Needs to encode then decode MeasurementType.", function () {

      let encoded = codec.encode(measurementType);
      let decoded: MeasurementType;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom(encoded);
      } catch (e) {
         var logger = new Logger();
         logger.logError("MeasurementType", "Decode", "Error", e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(measurementType)).to.equal(true);
   });

});

describe("IOMeasurement", function () {

   var quantity = new Quantity(10, BaseUnits.kilogram);
   var repeats = 1;
   var codec: MeasurementCodec = new MeasurementCodec();
   var measurementType: MeasurementType = MeasurementTypes.clean;
   var measurement: Measurement = new Measurement(new PersistenceDetails("id", 1, 2), quantity, repeats, 0, measurementType, "1234");;

   it("Needs to decode a Measurement from clean input.", function () {

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
         logger.logError("Measurement", "Decode", "Error", e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
   });


   it("Needs to encode Measurement.", function () {

      var caught: boolean = false;

      try {
         let encoded = codec.encode(measurement);
      } catch (e) {
         var logger = new Logger();
         logger.logInfo("Measurement", "Encode", "Error", e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to encode then decode Measurement.", function () {

      let encoded = codec.encode(measurement);
      let decoded: Measurement;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom(encoded);
      } catch (e) {
         var logger = new Logger();
         logger.logError("Measurement", "Encode-Decode", "Error", e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(measurement)).to.equal(true);
   });


   it("Needs to encode & decode multiple Measurements", function () {

      var measurements: Array<Measurement> = new Array<Measurement>();
      measurements.push(measurement);
      measurements.push(measurement);

      var measurementsCodec: MeasurementsCodec = new MeasurementsCodec();
      var encoded = measurementsCodec.encode(measurements);

      var newMeasurements: Array<Measurement> = measurementsCodec.tryCreateFrom(encoded);

      expect(newMeasurements[0].equals(measurement)).to.equal(true);
   });

});
