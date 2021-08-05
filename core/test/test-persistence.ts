'use strict';
// Copyright TXPCo ltd, 2021
import { PersistenceDetails, Persistence } from '../src/Persistence';

var expect = require("chai").expect;

describe("PersistenceDetails", function () {

   it("Needs to construct correctly", function () {
      let persistence = new PersistenceDetails ("id", 1, 2);

      expect(persistence.id).to.equal("id");
      expect(persistence.schemaVersion).to.equal(1);
      expect(persistence.sequenceNumber).to.equal(2);
   });

   it("Needs to compare for equality correctly", function () {
      let persistence1 = new PersistenceDetails("id", 1, 2);
      let persistence2 = new PersistenceDetails("id", 1, 3);
      let persistence3 = new PersistenceDetails("id", 1, 2);

      expect(persistence1.equals(persistence1)).to.equal(true);
      expect(persistence1.equals(persistence2)).to.equal(false);
      expect(persistence1.equals(persistence3)).to.equal(true);
   });

});

describe("Persistence", function () {

   it("Needs to construct correctly", function () {
      let persistence = new Persistence (new PersistenceDetails("id", 1, 2));

      expect(persistence.persistenceDetails.id).to.equal("id");
      expect(persistence.persistenceDetails.schemaVersion).to.equal(1);
      expect(persistence.persistenceDetails.sequenceNumber).to.equal(2);
   });

   it("Needs to compare for equality correctly", function () {
      let persistence1 = new Persistence( new PersistenceDetails("id", 1, 2));
      let persistence2 = new Persistence(new PersistenceDetails("id", 1, 3));
      let persistence3 = new Persistence(new PersistenceDetails("id", 1, 2));

      expect(persistence1.equals(persistence1)).to.equal(true);
      expect(persistence1.equals(persistence2)).to.equal(false);
      expect(persistence1.equals(persistence3)).to.equal(true);
   });

});