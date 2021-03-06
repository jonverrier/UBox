'use strict';
// Copyright TXPCo ltd, 2021
import { PersistenceDetails } from "../src/Persistence";
import { EBaseUnitDimension, BaseUnits } from '../src/Unit';
import { Quantity } from '../src/Quantity';
import { Timestamper } from '../src/Timestamp';

import { EPositiveTrend, EMeasurementType, MeasurementType, measurementTypeArraysAreEqual} from '../src/Observationtype';

import { MeasurementTypes } from '../src/ObservationTypeDictionary';
import { Measurement, IMeasurementStore } from '../src/Observation';
import { MeasurementFormatter } from '../src/LocaleFormatters';
import { Persona } from '../src/Persona';
import { Person } from '../src/Person';
import { Business } from '../src/Business';

import { PersistenceTestHelper, PersonaTestHelper, PersonTestHelper } from './testHelpers';

var expect = require("chai").expect;

describe("MeasurementType", function () {

   it("Needs to construct correctly", function () {
      let snatch = MeasurementTypes.snatch;
      let snatch2 = MeasurementTypes.snatch;

      expect(snatch.measurementType).to.equal(EMeasurementType.Snatch);
      expect(snatch.range.equals(snatch2.range)).to.equal(true);
      expect(snatch.trend).to.equal(EPositiveTrend.Up);
      expect(snatch.unitType).to.equal(EBaseUnitDimension.Weight);
   });

   it("Needs to test for equality", function () {
      let snatch = MeasurementTypes.snatch;
      let clean = MeasurementTypes.clean;
      let snatch2 = MeasurementTypes.snatch;

      expect(snatch.equals(snatch)).to.equal(true);
      expect(snatch.equals(clean)).to.equal(false);
      expect(snatch.equals(snatch2)).to.equal(true);
   });

   it("Needs to test array compare", function () {
      let snatch = MeasurementTypes.snatch;
      let clean = MeasurementTypes.clean;
      let snatches = new Array<MeasurementType>();
      let moreSnatches = new Array<MeasurementType>();
      let variedLifts = new Array<MeasurementType>();
      snatches.push(snatch);
      moreSnatches.push(snatch);
      moreSnatches.push(snatch);
      variedLifts.push(snatch);
      variedLifts.push(clean);

      expect(measurementTypeArraysAreEqual(snatches, snatches)).to.equal(true);
      expect(measurementTypeArraysAreEqual(snatches, null)).to.equal(false);
      expect(measurementTypeArraysAreEqual(null, snatches)).to.equal(false);
      expect(measurementTypeArraysAreEqual(moreSnatches, snatches)).to.equal(false);
      expect(measurementTypeArraysAreEqual(moreSnatches, variedLifts)).to.equal(false);
   });

   it("Needs to test time array compare", function () {
      let row = MeasurementTypes.row250;
      let run = MeasurementTypes.run800;
      let rows = new Array<MeasurementType>();
      let moreRows = new Array<MeasurementType>();
      let variedRows = new Array<MeasurementType>();
      rows.push(row);
      moreRows.push(row);
      moreRows.push(row);
      variedRows.push(row);
      variedRows.push(run);

      expect(measurementTypeArraysAreEqual(rows, rows)).to.equal(true);
      expect(measurementTypeArraysAreEqual(rows, null)).to.equal(false);
      expect(measurementTypeArraysAreEqual(null, rows)).to.equal(false);
      expect(measurementTypeArraysAreEqual(moreRows, rows)).to.equal(false);
      expect(measurementTypeArraysAreEqual(moreRows, variedRows)).to.equal(false);
   });

   it("Needs to construct correctly from memento()", function () {
      let snatch1 = MeasurementTypes.snatch;
      let memento = snatch1.memento();

      expect(new MeasurementType (memento).equals(snatch1)).to.equal(true);
   });
});

function testConstruct(quantity: Quantity,
                              repeats: number,
                              measurementType: MeasurementType) {

   let stamp = Timestamper.now();
   let measurement = new Measurement(new PersistenceDetails("id", 0, 0), quantity, repeats, stamp, measurementType, "1234", "12345");

   expect(measurement.persistenceDetails.key).to.equal("id");
   expect(measurement.persistenceDetails.schemaVersion).to.equal(0);
   expect(measurement.persistenceDetails.sequenceNumber).to.equal(0);

   expect(measurement.quantity.equals(quantity)).to.equal(true);
   expect(measurement.repeats === repeats).to.equal(true);
   expect(measurement.timestamp).to.equal(stamp);
   expect(measurement.measurementType.equals(measurementType)).to.equal(true);
   expect(measurement.subjectKey).to.equal("1234");
   expect(measurement.cohortKey).to.equal("12345");
}

function testEquals(quantity: Quantity,
   repeats: number,
   measurementType: MeasurementType) {

   let measurement1 = new Measurement(new PersistenceDetails("id", 0, 0), quantity, repeats, 0, measurementType, "1234", "12345");
   let measurement2 = new Measurement(new PersistenceDetails("id", 0, 0), quantity, repeats, 1, measurementType, "1234", "12345");
   let measurement3 = new Measurement(new PersistenceDetails("id", 0, 0), quantity, repeats, 0, measurementType, "1234", "12345");

   expect(measurement1.equals(measurement1)).to.equal(true);
   expect(measurement1.equals(measurement2)).to.equal(false);
   expect(measurement1.equals(measurement3)).to.equal(true);
}

describe("Measurement", function () {

   it("Needs to construct Snatch correctly", function () {
      let quantity = new Quantity(60, BaseUnits.kilogram);
      let repeats = 1;
      let measurement = MeasurementTypes.snatch;
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to construct Clean correctly", function () {
      let quantity = new Quantity(60, BaseUnits.kilogram);
      let repeats = 1;
      let measurement = MeasurementTypes.clean;
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to construct Jerk correctly", function () {
      let quantity = new Quantity(60, BaseUnits.kilogram);
      let repeats = 1;
      let measurement = MeasurementTypes.jerk;
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to construct Clean&Jerk correctly", function () {
      let quantity = new Quantity(60, BaseUnits.kilogram);
      let repeats = 1;
      let measurement = MeasurementTypes.cleanAndJerk;
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to construct Row250m correctly", function () {
      let quantity = new Quantity(120, BaseUnits.second);
      let repeats = 1;
      let measurement = MeasurementTypes.row250;
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to construct Run800m correctly", function () {
      let quantity = new Quantity(240, BaseUnits.second);
      let repeats = 1;
      let measurement = MeasurementTypes.run800;
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to construct Bench correctly", function () {
      let quantity = new Quantity(120, BaseUnits.second);
      let repeats = 1;
      let measurement = MeasurementTypes.bench;
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to construct Backsquat correctly", function () {
      let quantity = new Quantity(120, BaseUnits.second);
      let repeats = 1;
      let measurement = MeasurementTypes.backsquat;
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to construct deadlift correctly", function () {
      let quantity = new Quantity(120, BaseUnits.second);
      let repeats = 1;
      let measurement = MeasurementTypes.deadlift;
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to construct Run800m correctly", function () {
      let quantity = new Quantity(240, BaseUnits.second);
      let repeats = 1;
      let measurement = MeasurementTypes.run800;
      testConstruct(quantity, repeats, measurement);
   });

   it("Needs to test Snatch for equality", function () {
      let quantity = new Quantity(60, BaseUnits.kilogram);
      let repeats = 1;
      let measurement = MeasurementTypes.snatch;
      testEquals(quantity, repeats, measurement);
   });

   it("Needs to test Clean for equality", function () {
      let quantity = new Quantity(60, BaseUnits.kilogram);
      let repeats = 1;
      let measurement = MeasurementTypes.clean;
      testEquals(quantity, repeats, measurement);
   });

   it("Needs to test Jerk for equality", function () {
      let quantity = new Quantity(60, BaseUnits.kilogram);
      let repeats = 1;
      let measurement = MeasurementTypes.jerk;
      testEquals(quantity, repeats, measurement);
   });

   it("Needs to test Clean&Jerk for equality", function () {
      let quantity = new Quantity(60, BaseUnits.kilogram);
      let measurement = MeasurementTypes.cleanAndJerk;
      let repeats = 1;
      testEquals(quantity, repeats, measurement);
   });

   it("Needs to test Row for equality", function () {
      let quantity = new Quantity(60, BaseUnits.second);
      let repeats = 1;
      let measurement = MeasurementTypes.row250;
      testEquals(quantity, repeats, measurement);
   });

   it("Needs to test Run for equality", function () {
      let quantity = new Quantity(120, BaseUnits.second);
      let repeats = 1;
      let measurement = MeasurementTypes.run800;
      testEquals(quantity, repeats, measurement);
   });

   it("Needs to throw out of range error", function () {
      let quantity = new Quantity(600, BaseUnits.kilogram); // 600 kg snatch is impossible
      let repeats = 1;
      let measurementType = MeasurementTypes.snatch;
      let caught = false;

      try {
         let measurement = new Measurement(new PersistenceDetails("id", 0, 0), quantity, repeats, 0, measurementType, "1234", "1234");
      } catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to compare arrays", function () {
      let quantity = new Quantity(100, BaseUnits.kilogram);
      let repeats = 1;
      let measurementType = MeasurementTypes.snatch;

      let measurement = new Measurement(new PersistenceDetails("id", 0, 0), quantity, repeats, 0, measurementType, "1234", "1234");
      let measurement2 = new Measurement(new PersistenceDetails("id2", 0, 0), quantity, repeats, 0, measurementType, "1234", "1234");

      let measurememts1 = new Array<Measurement>();
      let measurememts2 = new Array<Measurement>();
      measurememts1.push(measurement);

      expect(Measurement.areEqual(null, measurememts2)).to.equal(false);
      expect(Measurement.areEqual(measurememts2, null)).to.equal(false);

      expect(Measurement.areEqual(measurememts1, measurememts2)).to.equal(false);
      expect(Measurement.areEqual(measurememts2, measurememts1)).to.equal(false);

      measurememts2.push(measurement);
      expect(Measurement.areEqual(measurememts2, measurememts1)).to.equal(true);

      measurememts2.push(measurement2);
      expect(Measurement.areEqual(measurememts2, measurememts1)).to.equal(false);

      measurememts2 = new Array<Measurement>();
      measurememts2.push(measurement2);
      expect(Measurement.areEqual(measurememts2, measurememts1)).to.equal(false);
   });


   it("Needs to format successfully", function () {

      let business1: Business;
      let person: Person;
      let person2: Person;
      let people: Array<Persona>, people2: Array<Persona>;

      person = PersonTestHelper.createJoeMember();
      person2 = PersonTestHelper.createJoeMember2Key2();

      people = new Array<Person>();
      people.push(person);
      people2 = new Array<Person>();
      people2.push(person2);

      business1 = new Business(PersistenceTestHelper.createKey1(),
         PersonaTestHelper.createXFitDulwichDetails(),
         people, people2);
      console.log(people2);

      let quantity = new Quantity(120, BaseUnits.second);
      let repeats = 1;
      let measurementType = MeasurementTypes.run800;
      let stamp = Timestamper.now();
      let stamp2 = Timestamper.round(new Date(1975, 12, 1));
      let measurement1 = new Measurement(new PersistenceDetails("id", 0, 0), quantity, repeats, stamp, measurementType, person.persistenceDetails.key, "1234");
      let measurement2 = new Measurement(new PersistenceDetails("id2", 0, 0), quantity, repeats, stamp2, measurementType, person2.persistenceDetails.key, "1234");

      let formatter = new MeasurementFormatter();

      // test a measurement made today, no business to look up persona
      let output = formatter.format(measurement1, null);

      expect(output.measurement.length > 0).to.equal(true);
      expect(output.timestamp.length > 0).to.equal(true);
      expect(output.persona === null).to.equal(false);

      // test a measurement made before today, no business to look up persona
      output = formatter.format(measurement2, null);

      expect(output.measurement.length > 0).to.equal(true);
      expect(output.timestamp.length > 0).to.equal(true);
      expect(output.persona === null).to.equal(false);

      // test a measurement made before today, business to look up persona
      output = formatter.format(measurement1, business1);

      expect(output.measurement.length > 0).to.equal(true);
      expect(output.timestamp.length > 0).to.equal(true);
      expect(output.persona === null).to.equal(false);

      // test a measurement made before today, business to look up persona
      console.log(measurement2);
      output = formatter.format(measurement2, business1);

      expect(output.measurement.length > 0).to.equal(true);
      expect(output.timestamp.length > 0).to.equal(true);
      expect(output.persona === null).to.equal(false);
   });

   it("Needs to convert to and from mementos()", function () {

      let quantity = new Quantity(100, BaseUnits.kilogram); 
      let repeats = 1;
      let measurementType = MeasurementTypes.snatch;

      let measurement = new Measurement(new PersistenceDetails("id", 0, 0), quantity, repeats, 0, measurementType, "1234", "1234");

      let measurements = new Array<Measurement>();
      measurements.push(measurement);
      let mementos = Measurement.mementos(measurements);

      let newMeasurement = new Measurement(mementos[0]);

      expect(newMeasurement.equals(measurement)).to.equal(true);

      let newPeople = Measurement.fromMementos(mementos);
      expect(newPeople[0].equals(measurement)).to.equal(true);
   });
});

class StubStore implements IMeasurementStore {

   async loadOne(): Promise<Measurement | Measurement | null>  {

      let quantity = new Quantity(60, BaseUnits.kilogram);
      let repeats = 1;
      let measurementType = MeasurementTypes.snatch;

      return new Measurement(new PersistenceDetails("id", 1, 2), quantity, repeats, 0, measurementType, "1234", "1234");
   }

   async save(measurement: Measurement | Measurement): Promise<Measurement | Measurement | null> {
      return measurement;
   }

   loadMany(ids: Array<any>): Promise<Array<Measurement | Measurement>> {
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
         let quantity = new Quantity(60, BaseUnits.kilogram);
         let repeats = 1;
         let measurementType = MeasurementTypes.snatch;
         let measurement = new Measurement(new PersistenceDetails("id", 0, 0),
            quantity, repeats, 0, measurementType, "1234", "1234");

         storer.save(measurement);
      } catch {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

});