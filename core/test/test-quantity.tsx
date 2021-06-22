'use strict';
// Copyright TXPCo ltd, 2021
import { EWeightUnits, Quantity} from '../src/Quantity';

var expect = require("chai").expect;

describe("Quantity", function () {

   it("Needs to construct correctly", function () {
      let quantity = new Quantity<EWeightUnits>(1, EWeightUnits.Kg);

      expect(quantity.amount).to.equal(1);
      expect(quantity.unit).to.equal(EWeightUnits.Kg);
   });

   it("Needs to compare for equality correctly", function () {
      let quantity1 = new Quantity<EWeightUnits>(1, EWeightUnits.Kg);
      let quantity2 = new Quantity<EWeightUnits>(2, EWeightUnits.Kg);
      let quantity3 = new Quantity<EWeightUnits>(1, EWeightUnits.Kg);

      expect(quantity1.equals(quantity1)).to.equal(true);
      expect(quantity1.equals(quantity2)).to.equal(false);
      expect(quantity1.equals(quantity3)).to.equal(true);
   });

});

