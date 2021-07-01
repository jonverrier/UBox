'use strict';
// Copyright TXPCo ltd, 2021
import { EWeightUnits, ETimeUnits, EDistanceUnits, QuantityOf } from '../src/Quantity';
import { EPositiveTrend, EMeasurementType, MeasurementTypeOf, MeasurementOf, IMeasurementLoaderFor, IMeasurementStorerFor} from '../src/Observation';
import {
   SnatchMeasurementType, CleanMeasurementType, JerkMeasurementType, CleanAndJerkMeasurementType,
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

function testConstruct<Units>(quantity: QuantityOf<Units>,
                              measurementType: MeasurementTypeOf<Units>) {

   let measurement = new MeasurementOf<Units>("id", 1, 2, 3, quantity, 0, measurementType);

   expect(measurement.id).to.equal("id");
   expect(measurement.schemaVersion).to.equal(1);
   expect(measurement.objectVersion).to.equal(2);

   expect(measurement.quantity.equals(quantity)).to.equal(true);
   expect(measurement.cohortPeriod).to.equal(0);
   expect(measurement.measurementType.equals(measurementType)).to.equal(true);
}

function testEquals <Units>(quantity: QuantityOf<Units>,
   measurementType: MeasurementTypeOf<Units>) {

   let measurement1 = new MeasurementOf<Units>("id", 1, 2, 3, quantity, 0, measurementType);
   let measurement2 = new MeasurementOf<Units>("id", 1, 2, 3, quantity, 1, measurementType);
   let measurement3 = new MeasurementOf<Units>("id", 1, 2, 3, quantity, 0, measurementType);

   expect(measurement1.equals(measurement1)).to.equal(true);
   expect(measurement1.equals(measurement2)).to.equal(false);
   expect(measurement1.equals(measurement3)).to.equal(true);
}

describe("Measurement", function () {

   it("Needs to construct Snatch correctly", function () {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
      let measurement = new SnatchMeasurementType();
      testConstruct(quantity, measurement);
   });

   it("Needs to construct Clean correctly", function () {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
      let measurement = new CleanMeasurementType();
      testConstruct(quantity, measurement);
   });

   it("Needs to construct Jerk correctly", function () {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
      let measurement = new JerkMeasurementType();
      testConstruct(quantity, measurement);
   });

   it("Needs to construct Clean&Jerk correctly", function () {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
      let measurement = new CleanAndJerkMeasurementType();
      testConstruct(quantity, measurement);
   });

   it("Needs to construct Row500 correctly", function () {
      let quantity = new QuantityOf<ETimeUnits>(120, ETimeUnits.Seconds);
      let measurement = new Row500mMeasurementType();
      testConstruct(quantity, measurement);
   });

   it("Needs to construct Row1000correctly", function () {
      let quantity = new QuantityOf<ETimeUnits>(240, ETimeUnits.Seconds);
      let measurement = new Row1000mMeasurementType();
      testConstruct(quantity, measurement);
   });

   it("Needs to test Snatch for equality", function () {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
      let measurement = new SnatchMeasurementType();
      testEquals(quantity, measurement);
   });

   it("Needs to test Clean for equality", function () {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
      let measurement = new CleanMeasurementType();
      testEquals(quantity, measurement);
   });

   it("Needs to test Jerk for equality", function () {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
      let measurement = new JerkMeasurementType();
      testEquals(quantity, measurement);
   });

   it("Needs to test Clean&Jerk for equality", function () {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
      let measurement = new CleanAndJerkMeasurementType();
      testEquals(quantity, measurement);
   });

   it("Needs to test Row500 for equality", function () {
      let quantity = new QuantityOf<ETimeUnits>(60, ETimeUnits.Seconds);
      let measurement = new Row500mMeasurementType();
      testEquals(quantity, measurement);
   });

   it("Needs to test Row1000 for equality", function () {
      let quantity = new QuantityOf<ETimeUnits>(60, ETimeUnits.Seconds);
      let measurement = new Row1000mMeasurementType();
      testEquals(quantity, measurement);
   });

   it("Needs to throw out of range error", function () {
      let quantity = new QuantityOf<EWeightUnits>(600, EWeightUnits.Kg); // 600 kg snatch is impossible
      let measurementType = new SnatchMeasurementType();
      let caught = false;

      try {
         let measurement = new MeasurementOf<EWeightUnits>("id", 1, 2, 3, quantity, 0, measurementType);
      } catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

});

class StubLoader implements IMeasurementLoaderFor<EWeightUnits> {
   load(): MeasurementOf<EWeightUnits> {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg); // 600 kg snatch is impossible
      let measurementType = new SnatchMeasurementType();
      return new MeasurementOf<EWeightUnits>("id", 1, 2, 3, quantity, 0, measurementType);
   }
}

class StubStorer implements IMeasurementStorerFor<EWeightUnits> {
   save(measurement: MeasurementOf<EWeightUnits>) {
   }
}

describe("MeasurementLoader", function () {

   it("Needs to load a Measurement.", function () {

      let loader = new StubLoader;

      let measurement = loader.load();

      expect(measurement).to.not.equal(null);
   });

});

describe("MeasurementStorer", function () {

   it("Needs to save a Measurement.", function () {

      let storer = new StubStorer;
      let caught = false;

      try {
         let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg); // 600 kg snatch is impossible
         let measurementType = new SnatchMeasurementType();
         let measurement = new MeasurementOf<EWeightUnits>("id", 1, 2, 3, quantity, 0, measurementType);

         storer.save(measurement);
      } catch {
         caught = true;
      }

      expect(caught).to.equal(false);

   });

});