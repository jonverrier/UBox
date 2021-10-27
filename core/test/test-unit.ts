'use strict';
// Copyright TXPCo ltd, 2021
import { BaseUnits, EBaseUnitDimension, EBaseUnit } from '../src/Unit';


var expect = require("chai").expect;

describe("BaseUnits", function () {

   it("Needs to consruct kilograms", function () {
      let kilograms = BaseUnits.kilogram;

      expect(kilograms.dimension).to.equal(EBaseUnitDimension.Weight);
      expect(kilograms.name).to.equal(EBaseUnit.Kg);
   });

   it("Needs to consruct Lbs", function () {
      let lbs = BaseUnits.poundLb;

      expect(lbs.dimension).to.equal(EBaseUnitDimension.Weight);
      expect(lbs.name).to.equal(EBaseUnit.Lbs);
   });

   it("Needs to consruct Seconds", function () {
      let seconds = BaseUnits.second;

      expect(seconds.dimension).to.equal(EBaseUnitDimension.Time);
      expect(seconds.name).to.equal(EBaseUnit.Seconds);
   });

   it("Needs to consruct Reps", function () {
      let reps = BaseUnits.rep;

      expect(reps.dimension).to.equal(EBaseUnitDimension.Reps);
      expect(reps.name).to.equal(EBaseUnit.Reps);
   });
});

