'use strict';
// Copyright TXPCo ltd, 2021
import { WeightUnits,EWeightUnits, QuantityOf } from '../src/Quantity';
import { RangeOf } from '../src/Range';

var expect = require("chai").expect;

describe("Range", function () {

   it("Needs to construct correctly", function () {
      let quantityLo = new QuantityOf<WeightUnits>(1, EWeightUnits.Kg);
      let quantityHi = new QuantityOf<WeightUnits>(2, EWeightUnits.Kg);

      let range = new RangeOf<WeightUnits>(quantityLo, true, quantityHi, false);

      expect(range.lo).to.equal(quantityLo);
      expect(range.hi).to.equal(quantityHi);
      expect(range.lowIncludesEqual).to.equal(true);
      expect(range.highIncludesEqual).to.equal(false);

      // test the memento 
      expect(range.memento().lo.amount).to.equal(quantityLo.memento().amount);
      expect(range.memento().hi.amount).to.equal(quantityHi.memento().amount);
      expect(range.memento().loInclEq).to.equal(true);
      expect(range.memento().hiInclEq).to.equal(false);
   });

   it("Needs to return true for lower bound if lower bound equal.", function () {

      let quantityLo = new QuantityOf<WeightUnits>(1, EWeightUnits.Kg);
      let quantityHi = new QuantityOf<WeightUnits>(2, EWeightUnits.Kg);

      let range = new RangeOf<WeightUnits>(quantityLo, true, quantityHi, false);

      expect(range.includes(quantityLo)).to.equal(true);
   });

   it("Needs to return false for lower bound if lower bound not equal.", function () {

      let quantityLo = new QuantityOf<WeightUnits>(1, EWeightUnits.Kg);
      let quantityHi = new QuantityOf<WeightUnits>(2, EWeightUnits.Kg);

      let range = new RangeOf<WeightUnits>(quantityLo, false, quantityHi, false);

      expect(range.includes(quantityLo)).to.equal(false);
   });

   it("Needs to return true for higher bound if higher bound equal.", function () {

      let quantityLo = new QuantityOf<WeightUnits>(1, EWeightUnits.Kg);
      let quantityHi = new QuantityOf<WeightUnits>(2, EWeightUnits.Kg);

      let range = new RangeOf<WeightUnits>(quantityLo, true, quantityHi, true);

      expect(range.includes(quantityHi)).to.equal(true);
   });

   it("Needs to return false for higher bound if higher bound not equal.", function () {

      let quantityLo = new QuantityOf<WeightUnits>(1, EWeightUnits.Kg);
      let quantityHi = new QuantityOf<WeightUnits>(2, EWeightUnits.Kg);

      let range = new RangeOf<WeightUnits>(quantityLo, false, quantityHi, false);

      expect(range.includes(quantityHi)).to.equal(false);
   });

   it("Needs to throw mis-match error if units are incompatible..", function () {

      let quantityLo = new QuantityOf<WeightUnits>(1, EWeightUnits.Kg);
      let quantityHi = new QuantityOf<WeightUnits>(2, EWeightUnits.Lbs); // we dont currently auto translate between units. 
      let caught = false;

      try {
         let range = new RangeOf<WeightUnits>(quantityLo, false, quantityHi, false);
      } catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to throw range error .", function () {

      let quantityLo = new QuantityOf<WeightUnits>(1, EWeightUnits.Kg);
      let quantityHi = new QuantityOf<WeightUnits>(2, EWeightUnits.Kg);
      let caught = false;

      try {
         // call below has lo range > hi range, which is out of bounds
         let range = new RangeOf<WeightUnits>(quantityHi, false, quantityLo, false);
      } catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

});

