'use strict';
// Copyright TXPCo ltd, 2021
import { EWeightUnits, ETimeUnits, QuantityOf, ERepUnits, EDistanceUnits } from '../src/Quantity';
import {
   EPositiveTrend, EMeasurementType, MeasurementTypeOf, MeasurementOf, IMeasurementLoaderFor, IMeasurementStorerFor,
   weightMeasurementTypeArraysAreEqual, timeMeasurementTypeArraysAreEqual
} from '../src/Observation';
import {
   SnatchMeasurementType, CleanMeasurementType, JerkMeasurementType, CleanAndJerkMeasurementType,
   RowSprintMeasurementType, RunSprintMeasurementType
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

   it("Needs to test weight array compare", function () {
      let snatch = new SnatchMeasurementType();
      let clean = new CleanMeasurementType();
      let snatches = new Array<MeasurementTypeOf<EWeightUnits>>();
      let moreSnatches = new Array<MeasurementTypeOf<EWeightUnits>>();
      let variedLifts = new Array<MeasurementTypeOf<EWeightUnits>>();
      snatches.push(snatch);
      moreSnatches.push(snatch);
      moreSnatches.push(snatch);
      variedLifts.push(snatch);
      variedLifts.push(clean);

      expect(weightMeasurementTypeArraysAreEqual(snatches, snatches)).to.equal(true);
      expect(weightMeasurementTypeArraysAreEqual(snatches, null)).to.equal(false);
      expect(weightMeasurementTypeArraysAreEqual(null, snatches)).to.equal(false);
      expect(weightMeasurementTypeArraysAreEqual(moreSnatches, snatches)).to.equal(false);
      expect(weightMeasurementTypeArraysAreEqual(moreSnatches, variedLifts)).to.equal(false);
   });

   it("Needs to test time array compare", function () {
      let row = new RowSprintMeasurementType();
      let run = new RunSprintMeasurementType();
      let rows = new Array<MeasurementTypeOf<ETimeUnits>>();
      let moreRows = new Array<MeasurementTypeOf<ETimeUnits>>();
      let variedRows = new Array<MeasurementTypeOf<ETimeUnits>>();
      rows.push(row);
      moreRows.push(row);
      moreRows.push(row);
      variedRows.push(row);
      variedRows.push(run);

      expect(timeMeasurementTypeArraysAreEqual(rows, rows)).to.equal(true);
      expect(timeMeasurementTypeArraysAreEqual(rows, null)).to.equal(false);
      expect(timeMeasurementTypeArraysAreEqual(null, rows)).to.equal(false);
      expect(timeMeasurementTypeArraysAreEqual(moreRows, rows)).to.equal(false);
      expect(timeMeasurementTypeArraysAreEqual(moreRows, variedRows)).to.equal(false);
   });
});

function testConstruct<measuredUnit, repeatUnit>(quantity: QuantityOf<measuredUnit>,
                              repeats: QuantityOf<repeatUnit>,
                              measurementType: MeasurementTypeOf<measuredUnit>) {

   let measurement = new MeasurementOf<measuredUnit, repeatUnit>("id", 1, 2, quantity, repeats, 0, measurementType, "1234");

   expect(measurement.id).to.equal("id");
   expect(measurement.schemaVersion).to.equal(1);
   expect(measurement.sequenceNumber).to.equal(2);

   expect(measurement.quantity.equals(quantity)).to.equal(true);
   expect(measurement.repeats.equals(repeats)).to.equal(true);
   expect(measurement.cohortPeriod).to.equal(0);
   expect(measurement.measurementType.equals(measurementType)).to.equal(true);
   expect(measurement.subjectExternalId).to.equal("1234");
}

function testEquals<measuredUnit, repeatUnit>(quantity: QuantityOf<measuredUnit>,
   repeats: QuantityOf<repeatUnit>,
   measurementType: MeasurementTypeOf<measuredUnit>) {

   let measurement1 = new MeasurementOf<measuredUnit, repeatUnit>("id", 1, 2, quantity, repeats, 0, measurementType, "1234");
   let measurement2 = new MeasurementOf<measuredUnit, repeatUnit>("id", 1, 2, quantity, repeats, 1, measurementType, "1234");
   let measurement3 = new MeasurementOf<measuredUnit, repeatUnit>("id", 1, 2, quantity, repeats, 0, measurementType, "1234");

   expect(measurement1.equals(measurement1)).to.equal(true);
   expect(measurement1.equals(measurement2)).to.equal(false);
   expect(measurement1.equals(measurement3)).to.equal(true);
}

describe("Measurement", function () {

   it("Needs to construct Snatch correctly", function () {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
      let repeats = new QuantityOf<ERepUnits>(1, ERepUnits.Reps);
      let measurement = new SnatchMeasurementType();
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to construct Clean correctly", function () {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
      let repeats = new QuantityOf<ERepUnits>(1, ERepUnits.Reps);
      let measurement = new CleanMeasurementType();
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to construct Jerk correctly", function () {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
      let repeats = new QuantityOf<ERepUnits>(1, ERepUnits.Reps);
      let measurement = new JerkMeasurementType();
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to construct Clean&Jerk correctly", function () {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
      let repeats = new QuantityOf<ERepUnits>(1, ERepUnits.Reps);
      let measurement = new CleanAndJerkMeasurementType();
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to construct RowSprint correctly", function () {
      let quantity = new QuantityOf<ETimeUnits>(120, ETimeUnits.Seconds);
      let repeats = new QuantityOf<ERepUnits>(500, ERepUnits.Reps);
      let measurement = new RowSprintMeasurementType();
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to construct RowSprint correctly", function () {
      let quantity = new QuantityOf<ETimeUnits>(240, ETimeUnits.Seconds);
      let repeats = new QuantityOf<EDistanceUnits>(1000, EDistanceUnits.Metres);
      let measurement = new RunSprintMeasurementType();
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to test Snatch for equality", function () {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
      let repeats = new QuantityOf<ERepUnits>(1, ERepUnits.Reps);
      let measurement = new SnatchMeasurementType();
      testEquals(quantity, repeats, measurement);
   });

   it("Needs to test Clean for equality", function () {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
      let repeats = new QuantityOf<ERepUnits>(1, ERepUnits.Reps);
      let measurement = new CleanMeasurementType();
      testEquals(quantity, repeats, measurement);
   });

   it("Needs to test Jerk for equality", function () {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
      let repeats = new QuantityOf<ERepUnits>(1, ERepUnits.Reps);
      let measurement = new JerkMeasurementType();
      testEquals(quantity, repeats, measurement);
   });

   it("Needs to test Clean&Jerk for equality", function () {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
      let measurement = new CleanAndJerkMeasurementType();
      let repeats = new QuantityOf<ERepUnits>(1, ERepUnits.Reps);
      testEquals(quantity, repeats, measurement);
   });

   it("Needs to test Row for equality", function () {
      let quantity = new QuantityOf<ETimeUnits>(60, ETimeUnits.Seconds);
      let repeats = new QuantityOf<EDistanceUnits>(500, EDistanceUnits.Metres);
      let measurement = new RowSprintMeasurementType();
      testEquals(quantity, repeats, measurement);
   });

   it("Needs to test Run for equality", function () {
      let quantity = new QuantityOf<ETimeUnits>(60, ETimeUnits.Seconds);
      let repeats = new QuantityOf<EDistanceUnits>(1000, EDistanceUnits.Metres);
      let measurement = new RunSprintMeasurementType();
      testEquals(quantity, repeats, measurement);
   });

   it("Needs to throw out of range error", function () {
      let quantity = new QuantityOf<EWeightUnits>(600, EWeightUnits.Kg); // 600 kg snatch is impossible
      let repeats = new QuantityOf<ERepUnits>(1, ERepUnits.Reps);
      let measurementType = new SnatchMeasurementType();
      let caught = false;

      try {
         let measurement = new MeasurementOf<EWeightUnits, ERepUnits>("id", 1, 2, quantity, repeats, 0, measurementType, "1234");
      } catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

});

class StubLoader implements IMeasurementLoaderFor<EWeightUnits, ERepUnits> {
   load(): MeasurementOf<EWeightUnits, ERepUnits> {
      let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
      let repeats = new QuantityOf<ERepUnits>(1, ERepUnits.Reps);
      let measurementType = new SnatchMeasurementType();
      return new MeasurementOf<EWeightUnits, ERepUnits>("id", 1, 2, quantity, repeats, 0, measurementType, "1234");
   }
}

class StubStorer implements IMeasurementStorerFor<EWeightUnits, ERepUnits> {
   save(measurement: MeasurementOf<EWeightUnits, ERepUnits>) {
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
         let quantity = new QuantityOf<EWeightUnits>(60, EWeightUnits.Kg);
         let repeats = new QuantityOf<ERepUnits>(1, ERepUnits.Reps);
         let measurementType = new SnatchMeasurementType();
         let measurement = new MeasurementOf<EWeightUnits, ERepUnits>("id", 1, 2, quantity, repeats, 0, measurementType, "1234");

         storer.save(measurement);
      } catch {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

});