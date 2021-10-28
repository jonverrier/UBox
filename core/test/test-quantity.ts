'use strict';
// Copyright TXPCo ltd, 2021
import { EBaseUnit, EBaseUnitDimension, BaseUnits } from '../src/Unit';
import { Quantity } from '../src/Quantity';


var expect = require("chai").expect;


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

   it("Needs to test Weight unit membership  correctly", function () {

      expect(BaseUnits.kilogram.dimension === EBaseUnitDimension.Weight).to.equal(true);
   });

   it("Needs to test Time unit membership  correctly", function () {

      expect(BaseUnits.second.dimension === EBaseUnitDimension.Time).to.equal(true);
   });

   it("Needs to test Rep unit membership  correctly", function () {

      expect(BaseUnits.rep.dimension === EBaseUnitDimension.Reps).to.equal(true);
   });
});

