'use strict';
// Copyright TXPCo ltd, 2021
import { BaseUnits } from '../src/Unit';
import { WeightUnits, TimeUnits, RepUnits, EWeightUnits, ETimeUnits, ERepUnits, Quantity } from '../src/Quantity';


var expect = require("chai").expect;

describe("WeightUnits", function () {

   it("Needs to construct correctly", function () {
      let weightUnits = new WeightUnits();

      expect(weightUnits.isAllowedValue(EWeightUnits.Kg)).to.equal(true);
      expect(weightUnits.isAllowedValue(ETimeUnits.Seconds)).to.equal(false);
      expect(weightUnits.allowedValues().indexOf(EWeightUnits.Kg) !== -1).to.equal(true);
   });

});

describe("TimeUnits", function () {

   it("Needs to construct correctly", function () {
      let timeUnits = new TimeUnits();

      expect(timeUnits.isAllowedValue(ETimeUnits.Seconds)).to.equal(true);
      expect(timeUnits.isAllowedValue(EWeightUnits.Kg)).to.equal(false);
      expect(timeUnits.allowedValues().indexOf(ETimeUnits.Seconds) !== -1).to.equal(true);
   });

});

describe("RepUnits", function () {

   it("Needs to construct correctly", function () {
      let repUnits = new RepUnits();

      expect(repUnits.isAllowedValue(ERepUnits.Reps)).to.equal(true);
      expect(repUnits.isAllowedValue(EWeightUnits.Kg)).to.equal(false);
      expect(repUnits.allowedValues().indexOf(ERepUnits.Reps) !== -1).to.equal(true);
   });

});

describe("Quantity", function () {

   it("Needs to construct correctly", function () {
      let quantity = new Quantity(1, BaseUnits.kilogram);

      expect(quantity.amount).to.equal(1);
      expect(quantity.unit).to.equal(BaseUnits.kilogram);
      expect(quantity.memento()._unit).to.equal(BaseUnits.kilogram);
   });

   it("Needs to compare for equality correctly", function () {
      let quantity1 = new Quantity(1, BaseUnits.kilogram);
      let quantity2 = new Quantity(2, BaseUnits.kilogram);
      let quantity3 = new Quantity(1, BaseUnits.kilogram);

      expect(quantity1.equals(quantity1)).to.equal(true);
      expect(quantity1.equals(quantity2)).to.equal(false);
      expect(quantity1.equals(quantity3)).to.equal(true);
   });

   it("Needs to test weight unit membership  correctly", function () {
      var isMember: string = EWeightUnits.Kg;
      var notMember: string = "Banana";

      expect(WeightUnits.isAllowedValue(isMember)).to.equal(true);
      expect(WeightUnits.isAllowedValue(notMember)).to.equal(false);
   });

   it("Needs to test time unit membership  correctly", function () {
      var isMember: string = ETimeUnits.Seconds;
      var notMember: string = "Banana";

      expect(TimeUnits.isAllowedValue(isMember)).to.equal(true);
      expect(TimeUnits.isAllowedValue(notMember)).to.equal(false);
   });

});

