'use strict';
// Copyright TXPCo ltd, 2021
import { EWeightUnits, Quantity } from '../src/Quantity';
import { Range } from '../src/Range';

var expect = require("chai").expect;

describe("Range", function () {

   it("Needs to construct correctly", function () {
      let quantityLo = new Quantity<EWeightUnits>(1, EWeightUnits.Kg);
      let quantityHi = new Quantity<EWeightUnits>(2, EWeightUnits.Kg);

      let range = new Range<EWeightUnits>(quantityLo, true, quantityHi, false);

      expect(range.low).to.equal(quantityLo);
      expect(range.high).to.equal(quantityHi);
      expect(range.lowIncludesEqual).to.equal(true);
      expect(range.highIncludesEqual).to.equal(false);
   });

   it("Needs to return true for lower bound if lower bound equal.", function () {

      let quantityLo = new Quantity<EWeightUnits>(1, EWeightUnits.Kg);
      let quantityHi = new Quantity<EWeightUnits>(2, EWeightUnits.Kg);

      let range = new Range<EWeightUnits>(quantityLo, true, quantityHi, false);

      expect(range.includes(quantityLo)).to.equal(true);
   });

   it("Needs to return false for lower bound if lower bound not equal.", function () {

      let quantityLo = new Quantity<EWeightUnits>(1, EWeightUnits.Kg);
      let quantityHi = new Quantity<EWeightUnits>(2, EWeightUnits.Kg);

      let range = new Range<EWeightUnits>(quantityLo, false, quantityHi, false);

      expect(range.includes(quantityLo)).to.equal(false);
   });

   it("Needs to return true for higher bound if higher bound equal.", function () {

      let quantityLo = new Quantity<EWeightUnits>(1, EWeightUnits.Kg);
      let quantityHi = new Quantity<EWeightUnits>(2, EWeightUnits.Kg);

      let range = new Range<EWeightUnits>(quantityLo, true, quantityHi, true);

      expect(range.includes(quantityHi)).to.equal(true);
   });

   it("Needs to return false for higher bound if higher bound not equal.", function () {

      let quantityLo = new Quantity<EWeightUnits>(1, EWeightUnits.Kg);
      let quantityHi = new Quantity<EWeightUnits>(2, EWeightUnits.Kg);

      let range = new Range<EWeightUnits>(quantityLo, false, quantityHi, false);

      expect(range.includes(quantityHi)).to.equal(false);
   });
});

