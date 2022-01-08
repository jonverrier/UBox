'use strict';
// Copyright TXPCo ltd, 2021

import { Logger } from '../src/Logger';
import { Persona} from '../src/Persona';
import { CohortsPresenter, CohortsPresenterMemento} from '../src/CohortsPresenter';
import { PersonaTestHelper } from './testHelpers';
import { Business, BusinessMemento } from '../src/Business';
import { CohortsPresenterCodec } from '../src/IOCohortsPresenter';

var expect = require("chai").expect;


describe("CohortsPresenterMemento", function () {

   var person: Persona, cohort: Persona;

   person = PersonaTestHelper.createJoe();

   cohort = PersonaTestHelper.createXFitDulwich();

   var presenterMemento: CohortsPresenterMemento = new CohortsPresenterMemento(
      person.memento(),
      true,
      Persona.mementos(new Array<Persona>(cohort)));
 
   
   it("Needs to correctly store attributes", function () {

      expect(presenterMemento._persona._persistenceDetails._key === person.persistenceDetails.memento()._key).to.equal(true);
      expect(presenterMemento._persona._personaDetails._name === person.personaDetails.memento()._name).to.equal(true);
      expect(presenterMemento._persona._personaDetails._thumbnailUrl === person.personaDetails.memento()._thumbnailUrl).to.equal(true);

      expect(presenterMemento._isAdministrator === true).to.equal(true);

      expect(presenterMemento._cohorts[0]._persistenceDetails._key === cohort.persistenceDetails.memento()._key).to.equal(true);
      expect(presenterMemento._cohorts[0]._personaDetails._name === cohort.personaDetails.name).to.equal(true);
      expect(presenterMemento._cohorts[0]._personaDetails._thumbnailUrl === cohort.personaDetails.thumbnailUrl).to.equal(true);  
   });

});


describe("CohortsPresenter", function () {

   var person: Persona, cohort: Persona;

   person = PersonaTestHelper.createJoe();

   cohort = PersonaTestHelper.createXFitDulwich();

   var presenter: CohortsPresenter = new CohortsPresenter(
      person,
      true,
      new Array<Persona>(cohort));


   it("Needs to correctly store attributes", function () {

      expect(presenter.persona.persistenceDetails.key === person.persistenceDetails.key).to.equal(true);
      expect(presenter.persona.personaDetails.name === person.personaDetails.name).to.equal(true);
      expect(presenter.persona.personaDetails.thumbnailUrl === person.personaDetails.thumbnailUrl).to.equal(true);

      expect(presenter.cohorts[0].persistenceDetails.key === cohort.persistenceDetails.key).to.equal(true);
      expect(presenter.cohorts[0].personaDetails.name === cohort.personaDetails.name).to.equal(true);
      expect(presenter.cohorts[0].personaDetails.thumbnailUrl === cohort.personaDetails.thumbnailUrl).to.equal(true);
   });

});

describe("IOCohortsPresenter", function () {

   var person: Persona, cohort: Persona;

   person = PersonaTestHelper.createJoe();
   cohort = PersonaTestHelper.createXFitDulwich();

   var presenter: CohortsPresenter = new CohortsPresenter(
      person,
      true,
      new Array<Persona>(cohort));

   let codec: CohortsPresenterCodec = new CohortsPresenterCodec();

   it("Needs to decode CohortsPresenter from clean input.", function () {

      var caught: boolean = false;

      try {
         let encoded = {
            _persona: person.memento(),
            _isAdministrator: true,
            _cohorts: Persona.mementos(presenter.cohorts)
         };

         codec.decode(encoded);

      } catch (e) {

         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to encode CohortsPresenter.", function () {

      let encoded: CohortsPresenterMemento = codec.encode(presenter);

      expect(encoded._persona._persistenceDetails._key).to.equal(presenter.persona.persistenceDetails.key);
      expect(encoded._persona._persistenceDetails._schemaVersion).to.equal(presenter.persona.persistenceDetails.schemaVersion);
      expect(encoded._persona._persistenceDetails._sequenceNumber).to.equal(presenter.persona.persistenceDetails.sequenceNumber);
   });

   it("Needs to encode then decode CohortsPresenter.", function () {

      let encoded = codec.encode(presenter);
      let decoded: CohortsPresenter;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom(encoded);
      } catch (e) {
         var logger = new Logger();
         logger.logError("IOCohortsPresenter", "Encode-Decode", "Error", e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(presenter)).to.equal(true);
   });

});