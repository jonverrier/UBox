'use strict';
// Copyright TXPCo ltd, 2021
import { EWeightUnits, ETimeUnits, EDistanceUnits, QuantityOf } from '../src/Quantity';
import { EPositiveTrend, EMeasurementType, MeasurementOf } from '../src/Observation';
import {
   SnatchMeasurementType, CleanMeasurementType,
   Row500mMeasurementType, Row1000mMeasurementType
} from '../src/FitnessObservations'

var expect = require("chai").expect;

describe("MeasurementType", function () {

   it("Needs to construct correctly", function () {
      let snatch = new SnatchMeasurementType();
      let snatch2 = new SnatchMeasurementType();

      expect(snatch.measurmentType).to.equal(EMeasurementType.Snatch);
      expect(snatch.range.equals(snatch2.range)).to.equal(true);
      expect(snatch.trend).to.equal(EPositiveTrend.Up);
   });

   it("Needs to test for equality", function () {
      let snatch = new SnatchMeasurementType();
      let clean = new CleanMeasurementType();
      let snatch2 = new SnatchMeasurementType();

      expect(snatch.equals(snatch)).to.equal(true);
      expect(snatch.equals(clean)).to.equal(false);
      expect(snatch.equals(snatch2)).to.equal(true);
   });

});

describe("Measurement", function () {

   it("Needs to construct correctly", function () {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
      let snatch = new SnatchMeasurementType ();
      let measurement = new MeasurementOf<EWeightUnits>("id", 1, 2, quantity, 0, snatch);

      expect(measurement.id).to.equal("id");
      expect(measurement.schemaVersion).to.equal(1);
      expect(measurement.objectVersion).to.equal(2);

      expect(measurement.quantity.equals(quantity)).to.equal(true);
      expect(measurement.cohortPeriod).to.equal(0);
      expect(measurement.measurementType.equals(snatch)).to.equal(true);
   });

   it("Needs to test for equality in weight measures", function () {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
      let snatch = new SnatchMeasurementType();
      let clean = new CleanMeasurementType();
      let measurement1 = new MeasurementOf<EWeightUnits>("id", 1, 2, quantity, 0, snatch);
      let measurement2 = new MeasurementOf<EWeightUnits>("id", 1, 2, quantity, 1, snatch);
      let measurement3 = new MeasurementOf<EWeightUnits>("id", 1, 2, quantity, 0, snatch);
      let measurement4 = new MeasurementOf<EWeightUnits>("id", 1, 2, quantity, 1, clean);

      expect(measurement1.equals(measurement2)).to.equal(false);
      expect(measurement1.equals(measurement3)).to.equal(true);
      expect(measurement1.equals(measurement4)).to.equal(false);
   });

   it("Needs to test for equality in speed measures", function () {
      let quantity = new QuantityOf<ETimeUnits>(60, ETimeUnits.Seconds);
      let row500 = new Row500mMeasurementType();
      let row1000 = new Row1000mMeasurementType();
      let measurement1 = new MeasurementOf<ETimeUnits>("id", 1, 2, quantity, 0, row500);
      let measurement2 = new MeasurementOf<ETimeUnits>("id", 1, 2, quantity, 1, row500);
      let measurement3 = new MeasurementOf<ETimeUnits>("id", 1, 2, quantity, 0, row500);
      let measurement4 = new MeasurementOf<ETimeUnits>("id", 1, 2, quantity, 1, row1000);

      expect(measurement1.equals(measurement2)).to.equal(false);
      expect(measurement1.equals(measurement3)).to.equal(true);
      expect(measurement1.equals(measurement4)).to.equal(false);
   });

});

