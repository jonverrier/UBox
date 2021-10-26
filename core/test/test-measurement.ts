'use strict';
// Copyright TXPCo ltd, 2021
import { PersistenceDetails } from "../src/Persistence";
import { WeightUnits, EWeightUnits, TimeUnits, ETimeUnits, QuantityOf } from '../src/Quantity';

import {
   EPositiveTrend, EMeasurementType, EMeasurementUnitType, MeasurementTypeOf, MeasurementOf, IMeasurementStore,
   weightMeasurementTypeArraysAreEqual, timeMeasurementTypeArraysAreEqual, IMeasurementTypeFactoryFor
} from '../src/Observation';

import {
   SnatchMeasurementType, CleanMeasurementType, JerkMeasurementType, CleanAndJerkMeasurementType,
   Row250mMeasurementType, Run800mMeasurementType
} from '../src/FitnessObservations';

import { OlympicLiftMeasurementTypeFactory, SpeedMeasurementTypeFactory } from '../src/ObservationDictionary';

var expect = require("chai").expect;

describe("MeasurementType", function () {
   let weightFactory: IMeasurementTypeFactoryFor<WeightUnits> = new OlympicLiftMeasurementTypeFactory();
   let timeFactory: IMeasurementTypeFactoryFor<WeightUnits> = new SpeedMeasurementTypeFactory();

   it("Needs to construct correctly", function () {
      let snatch = new SnatchMeasurementType(weightFactory);
      let snatch2 = new SnatchMeasurementType(weightFactory);

      expect(snatch.measurementType).to.equal(EMeasurementType.Snatch);
      expect(snatch.range.equals(snatch2.range)).to.equal(true);
      expect(snatch.trend).to.equal(EPositiveTrend.Up);
      expect(snatch.unitType).to.equal(EMeasurementUnitType.Weight);
   });

   it("Needs to test for equality", function () {
      let snatch = new SnatchMeasurementType(weightFactory);
      let clean = new CleanMeasurementType(weightFactory);
      let snatch2 = new SnatchMeasurementType(weightFactory);

      expect(snatch.equals(snatch)).to.equal(true);
      expect(snatch.equals(clean)).to.equal(false);
      expect(snatch.equals(snatch2)).to.equal(true);
   });

   it("Needs to test weight array compare", function () {
      let snatch = new SnatchMeasurementType(weightFactory);
      let clean = new CleanMeasurementType(weightFactory);
      let snatches = new Array<MeasurementTypeOf<WeightUnits>>();
      let moreSnatches = new Array<MeasurementTypeOf<WeightUnits>>();
      let variedLifts = new Array<MeasurementTypeOf<WeightUnits>>();
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
      let row = new Row250mMeasurementType(timeFactory);
      let run = new Run800mMeasurementType(timeFactory);
      let rows = new Array<MeasurementTypeOf<TimeUnits>>();
      let moreRows = new Array<MeasurementTypeOf<TimeUnits>>();
      let variedRows = new Array<MeasurementTypeOf<TimeUnits>>();
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

   it("Needs to construct correctly from memento()", function () {
      let snatch1 = new SnatchMeasurementType(weightFactory);
      let memento = snatch1.memento();

      expect(new MeasurementTypeOf < EWeightUnits> (memento).equals(snatch1)).to.equal(true);
   });
});

function testConstruct<MeasuredUnit>(quantity: QuantityOf<MeasuredUnit>,
                              repeats: number,
                              measurementType: MeasurementTypeOf<MeasuredUnit>) {

   let measurement = new MeasurementOf<MeasuredUnit>(new PersistenceDetails("id", 1, 2), quantity, repeats, 0, measurementType, "1234");

   expect(measurement.persistenceDetails.key).to.equal("id");
   expect(measurement.persistenceDetails.schemaVersion).to.equal(1);
   expect(measurement.persistenceDetails.sequenceNumber).to.equal(2);

   expect(measurement.quantity.equals(quantity)).to.equal(true);
   expect(measurement.repeats === repeats).to.equal(true);
   expect(measurement.cohortPeriod).to.equal(0);
   expect(measurement.measurementType.equals(measurementType)).to.equal(true);
   expect(measurement.subjectKey).to.equal("1234");
}

function testEquals<MeasuredUnit>(quantity: QuantityOf<MeasuredUnit>,
   repeats: number,
   measurementType: MeasurementTypeOf<MeasuredUnit>) {

   let measurement1 = new MeasurementOf<MeasuredUnit>(new PersistenceDetails("id", 1, 2), quantity, repeats, 0, measurementType, "1234");
   let measurement2 = new MeasurementOf<MeasuredUnit>(new PersistenceDetails("id", 1, 2), quantity, repeats, 1, measurementType, "1234");
   let measurement3 = new MeasurementOf<MeasuredUnit>(new PersistenceDetails("id", 1, 2), quantity, repeats, 0, measurementType, "1234");

   expect(measurement1.equals(measurement1)).to.equal(true);
   expect(measurement1.equals(measurement2)).to.equal(false);
   expect(measurement1.equals(measurement3)).to.equal(true);
}

describe("Measurement", function () {
   let weightFactory: IMeasurementTypeFactoryFor<WeightUnits> = new OlympicLiftMeasurementTypeFactory();
   let timeFactory: IMeasurementTypeFactoryFor<WeightUnits> = new SpeedMeasurementTypeFactory();

   it("Needs to construct Snatch correctly", function () {
      let quantity = new QuantityOf<WeightUnits>(60, EWeightUnits.Kg);
      let repeats = 1;
      let measurement = new SnatchMeasurementType(weightFactory);
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to construct Clean correctly", function () {
      let quantity = new QuantityOf<WeightUnits>(60, EWeightUnits.Kg);
      let repeats = 1;
      let measurement = new CleanMeasurementType(weightFactory);
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to construct Jerk correctly", function () {
      let quantity = new QuantityOf<WeightUnits>(60, EWeightUnits.Kg);
      let repeats = 1;
      let measurement = new JerkMeasurementType(weightFactory);
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to construct Clean&Jerk correctly", function () {
      let quantity = new QuantityOf<WeightUnits>(60, EWeightUnits.Kg);
      let repeats = 1;
      let measurement = new CleanAndJerkMeasurementType(weightFactory);
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to construct Row250m correctly", function () {
      let quantity = new QuantityOf<TimeUnits>(120, ETimeUnits.Seconds);
      let repeats = 1;
      let measurement = new Row250mMeasurementType(timeFactory);
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to construct Run100m correctly", function () {
      let quantity = new QuantityOf<TimeUnits>(240, ETimeUnits.Seconds);
      let repeats = 1;
      let measurement = new Run800mMeasurementType(timeFactory);
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to test Snatch for equality", function () {
      let quantity = new QuantityOf<WeightUnits>(60, EWeightUnits.Kg);
      let repeats = 1;
      let measurement = new SnatchMeasurementType(weightFactory);
      testEquals(quantity, repeats, measurement);
   });

   it("Needs to test Clean for equality", function () {
      let quantity = new QuantityOf<WeightUnits>(60, EWeightUnits.Kg);
      let repeats = 1;
      let measurement = new CleanMeasurementType(weightFactory);
      testEquals(quantity, repeats, measurement);
   });

   it("Needs to test Jerk for equality", function () {
      let quantity = new QuantityOf<WeightUnits>(60, EWeightUnits.Kg);
      let repeats = 1;
      let measurement = new JerkMeasurementType(weightFactory);
      testEquals(quantity, repeats, measurement);
   });

   it("Needs to test Clean&Jerk for equality", function () {
      let quantity = new QuantityOf<WeightUnits>(60, EWeightUnits.Kg);
      let measurement = new CleanAndJerkMeasurementType(weightFactory);
      let repeats = 1;
      testEquals(quantity, repeats, measurement);
   });

   it("Needs to test Row for equality", function () {
      let quantity = new QuantityOf<TimeUnits>(60, ETimeUnits.Seconds);
      let repeats = 1;
      let measurement = new Row250mMeasurementType(timeFactory);
      testEquals(quantity, repeats, measurement);
   });

   it("Needs to test Run for equality", function () {
      let quantity = new QuantityOf<TimeUnits>(180, ETimeUnits.Seconds);
      let repeats = 1;
      let measurement = new Run800mMeasurementType(timeFactory);
      testEquals(quantity, repeats, measurement);
   });

   it("Needs to throw out of range error", function () {
      let quantity = new QuantityOf<WeightUnits>(600, EWeightUnits.Kg); // 600 kg snatch is impossible
      let repeats = 1;
      let measurementType = new SnatchMeasurementType(weightFactory);
      let caught = false;

      try {
         let measurement = new MeasurementOf<WeightUnits>(new PersistenceDetails("id", 1, 2), quantity, repeats, 0, measurementType, "1234");
      } catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

});

class StubStore implements IMeasurementStore {

   async loadOne(): Promise<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits> | null>  {
      let weightFactory: IMeasurementTypeFactoryFor<WeightUnits> = new OlympicLiftMeasurementTypeFactory();

      let quantity = new QuantityOf<WeightUnits>(60, EWeightUnits.Kg);
      let repeats = 1;
      let measurementType = new SnatchMeasurementType(weightFactory);

      return new MeasurementOf<WeightUnits>(new PersistenceDetails("id", 1, 2), quantity, repeats, 0, measurementType, "1234");
   }

   async save(measurement: MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits>): Promise<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits> | null> {
      return measurement;
   }

   loadMany(ids: Array<any>): Promise<Array<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits>>> {
      return null;
   }

}


describe("MeasurementLoader", function () {

   it("Needs to load a Measurement.", function () {

      let loader = new StubStore;

      let measurement = loader.loadOne ();

      expect(measurement).to.not.equal(null);
   });

});

describe("MeasurementStorer", function () {

   it("Needs to save a Measurement.", function () {

      let storer = new StubStore;
      let caught = false;

      try {
         let weightFactory: IMeasurementTypeFactoryFor<WeightUnits> = new OlympicLiftMeasurementTypeFactory();

         let quantity = new QuantityOf<WeightUnits>(60, EWeightUnits.Kg);
         let repeats = 1;
         let measurementType = new SnatchMeasurementType(weightFactory);
         let measurement = new MeasurementOf<WeightUnits>(new PersistenceDetails("id", 1, 2),
            quantity, repeats, 0, measurementType, "1234");

         storer.save(measurement);
      } catch {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

});