'use strict';
// Copyright TXPCo ltd, 2021
import { PersistenceDetails, Persistence } from '../src/Persistence';

var expect = require("chai").expect;

describe("PersistenceDetails", function () {

   it("Needs to construct correctly", function () {
      let persistence = new PersistenceDetails ("id", 1, 2);

      expect(persistence.key).to.equal("id");
      expect(persistence.schemaVersion).to.equal(1);
      expect(persistence.sequenceNumber).to.equal(2);
      expect(persistence.hasValidKey()).to.equal(true);
   });

   it("Needs to compare for equality correctly", function () {
      let persistence1 = new PersistenceDetails("id", 0, 0);
      let persistence2 = new PersistenceDetails("id", 0, 1);
      let persistence3 = new PersistenceDetails("id", 0, 0);

      expect(persistence1.equals(persistence1)).to.equal(true);
      expect(persistence1.equals(persistence2)).to.equal(false);
      expect(persistence1.equals(persistence3)).to.equal(true);
   });

   it("Needs to create memento() correctly", function () {
      let persistence1 = new PersistenceDetails("id", 0, 0);

      expect(persistence1.memento()._key === persistence1.key).to.equal(true);
      expect(persistence1.memento()._schemaVersion === persistence1.schemaVersion).to.equal(true);
      expect(persistence1.memento()._sequenceNumber === persistence1.sequenceNumber).to.equal(true);
   });

   it("Needs to construct correctly from memento()", function () {
      let persistence1 = new PersistenceDetails("id", 0, 0);

      expect(new PersistenceDetails(persistence1.memento()).equals(persistence1)).to.equal(true);
   });
});

describe("Persistence", function () {

   it("Needs to construct correctly", function () {
      let persistence = new Persistence (new PersistenceDetails("id", 0, 0));

      expect(persistence.persistenceDetails.key).to.equal("id");
      expect(persistence.persistenceDetails.schemaVersion).to.equal(0);
      expect(persistence.persistenceDetails.sequenceNumber).to.equal(0);
   });

   it("Needs to construct in-memory version correctly", function () {
      let persistence = PersistenceDetails.newPersistenceDetails();

      expect(persistence.key).to.equal(null);
      expect(persistence.schemaVersion).to.equal(PersistenceDetails.newSchemaIndicator());
      expect(persistence.sequenceNumber).to.equal(0);
   });


   it("Needs to compare for equality correctly", function () {
      let persistence1 = new Persistence( new PersistenceDetails("id", 0, 0));
      let persistence2 = new Persistence(new PersistenceDetails("id", 0, 1));
      let persistence3 = new Persistence(new PersistenceDetails("id", 0, 0));

      expect(persistence1.equals(persistence1)).to.equal(true);
      expect(persistence1.equals(persistence2)).to.equal(false);
      expect(persistence1.equals(persistence3)).to.equal(true);
   });

   it("Needs to increment sequenceNumber", function () {
      let persistence = PersistenceDetails.newPersistenceDetails();
      persistence.incrementSequence();

      expect(persistence.sequenceNumber).to.equal(1);
   });

});
