'use strict';
// Copyright TXPCo ltd, 2021
import { BaseUnits, EBaseUnitDimension, EBaseUnit } from '../src/Unit';


var expect = require("chai").expect;

describe("BaseUnits", function () {

   it("Needs to construct kilograms", function () {
      let kilograms = BaseUnits.kilogram;

      expect(kilograms.dimension).to.equal(EBaseUnitDimension.Weight);
      expect(kilograms.name).to.equal(EBaseUnit.Kg);
   });

   it("Needs to construct Lbs", function () {
      let lbs = BaseUnits.lb;

      expect(lbs.dimension).to.equal(EBaseUnitDimension.Weight);
      expect(lbs.name).to.equal(EBaseUnit.Lbs);
   });

   it("Needs to construct Seconds", function () {
      let seconds = BaseUnits.second;

      expect(seconds.dimension).to.equal(EBaseUnitDimension.Time);
      expect(seconds.name).to.equal(EBaseUnit.Seconds);
   });

   it("Needs to construct Reps", function () {
      let reps = BaseUnits.rep;

      expect(reps.dimension).to.equal(EBaseUnitDimension.Reps);
      expect(reps.name).to.equal(EBaseUnit.Reps);
   });
});
