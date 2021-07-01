'use strict';
// Copyright TXPCo ltd, 2021
import { Persistence } from '../src/Persistence';

var expect = require("chai").expect;

describe("Persistence", function () {

   it("Needs to construct correctly", function () {
      let persistence = new Persistence ("id", 1, 2, 3);

      expect(persistence.id).to.equal("id");
      expect(persistence.schemaVersion).to.equal(1);
      expect(persistence.objectVersion).to.equal(2);
      expect(persistence.sequenceNumber).to.equal(3);
   });

   it("Needs to compare for equality correctly", function () {
      let persistence1 = new Persistence("id", 1, 2, 3);
      let persistence2 = new Persistence("id", 1, 3, 3);
      let persistence3 = new Persistence("id", 1, 2, 3);

      expect(persistence1.equals(persistence1)).to.equal(true);
      expect(persistence1.equals(persistence2)).to.equal(false);
      expect(persistence1.equals(persistence3)).to.equal(true);
   });

});

