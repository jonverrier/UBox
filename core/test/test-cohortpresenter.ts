'use strict';
// Copyright TXPCo ltd, 2021

import { Logger } from '../src/Logger';
import { PersistenceDetails } from "../src/Persistence";
import { Persona } from '../src/Persona';
import { Measurement } from '../src/Observation';
import { ECohortType, Cohort} from '../src/Cohort';
import { CohortPresenter, CohortPresenterMemento} from '../src/CohortPresenter';
import { PersistenceTestHelper, PersonaTestHelper } from './testHelpers';
import { Business } from '../src/Business';
import { CohortPresenterCodec } from '../src/IOCohortPresenter';

var expect = require("chai").expect;


describe("CohortPresenterMemento", function () {

   let period = 1;
   var person: Persona;
   let people = new Array<Persona>();

   person = PersonaTestHelper.createJoe();
   people.push(person);

   let business = new Business(PersistenceTestHelper.createKey1(),
      PersonaTestHelper.createXFitDulwichDetails(),
      people, people);

   let cohort = new Cohort(new PersistenceDetails("id", 0, 0),
      PersonaTestHelper.createXFitDulwichDetails(),
      business,
      period,
      ECohortType.OlympicLifting);

   var measurements: Array<Measurement> = new Array<Measurement>();

   var presenterMemento: CohortPresenterMemento = new CohortPresenterMemento(
      person.memento(),
      true,
      cohort.memento(), Measurement.mementos(measurements));
 
   
   it("Needs to correctly store attributes", function () {

      expect(presenterMemento._persona._persistenceDetails._key === person.persistenceDetails.memento()._key).to.equal(true);
      expect(presenterMemento._persona._personaDetails._name === person.personaDetails.memento()._name).to.equal(true);
      expect(presenterMemento._persona._personaDetails._thumbnailUrl === person.personaDetails.memento()._thumbnailUrl).to.equal(true);

      expect(presenterMemento._isAdministrator === true).to.equal(true);

      let cohortCopy: Cohort = new Cohort(presenterMemento._cohort);
      expect(cohortCopy.equals(cohort)).to.equal(true);

      let measurementsCopy: Array<Measurement> = new Array<Measurement>();
      expect(Measurement.areEqual(measurements, measurementsCopy)).to.equal(true);

   });

});

describe("CohortsPresenter", function () {

   let period = 1;
   var person: Persona;
   let people = new Array<Persona>();

   person = PersonaTestHelper.createJoe();
   people.push(person);

   let business = new Business(PersistenceTestHelper.createKey1(),
      PersonaTestHelper.createXFitDulwichDetails(),
      people, people);

   let cohort = new Cohort(new PersistenceDetails("id", 0, 0),
      PersonaTestHelper.createXFitDulwichDetails(),
      business,
      period,
      ECohortType.OlympicLifting);

   var measurements: Array<Measurement> = new Array<Measurement>();

   var presenter: CohortPresenter = new CohortPresenter(
      person,
      true,
      cohort, measurements);

   it("Needs to correctly store attributes", function () {

      expect(presenter.persona.persistenceDetails.key === person.persistenceDetails.key).to.equal(true);
      expect(presenter.persona.personaDetails.name === person.personaDetails.name).to.equal(true);
      expect(presenter.persona.personaDetails.thumbnailUrl === person.personaDetails.thumbnailUrl).to.equal(true);

      expect(presenter.cohort.equals(cohort)).to.equal(true);
      expect(Measurement.areEqual(measurements, presenter.measurements)).to.equal(true);
   });

});

describe("IOCohortPresenter", function () {

   let period = 1;
   var person: Persona;
   let people = new Array<Persona>();

   person = PersonaTestHelper.createJoe();
   people.push(person);

   let business = new Business(PersistenceTestHelper.createKey1(),
      PersonaTestHelper.createXFitDulwichDetails(),
      people, people);

   let cohort = new Cohort(new PersistenceDetails("id", 0, 0),
      PersonaTestHelper.createXFitDulwichDetails(),
      business,
      period,
      ECohortType.OlympicLifting);

   var measurements: Array<Measurement> = new Array<Measurement>();

   let codec: CohortPresenterCodec = new CohortPresenterCodec();

   var presenter: CohortPresenter = new CohortPresenter(
      person,
      true,
      cohort, measurements);

   it("Needs to decode CohortPresenter from clean input.", function () {

      var caught: boolean = false;

      try {
         let encoded = {
            _persona: person.memento(),
            _isAdministrator: true,
            _cohort: cohort.memento(),
            _measurements: Measurement.mementos(measurements)
         };

         codec.decode(encoded);

      } catch (e) {

         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to encode CohortPresenter.", function () {

      let encoded: CohortPresenterMemento = codec.encode(presenter);

      expect(encoded._persona._persistenceDetails._key).to.equal(presenter.persona.persistenceDetails.key);
      expect(encoded._persona._persistenceDetails._schemaVersion).to.equal(presenter.persona.persistenceDetails.schemaVersion);
      expect(encoded._persona._persistenceDetails._sequenceNumber).to.equal(presenter.persona.persistenceDetails.sequenceNumber);

      let cohortCopy: Cohort = new Cohort(encoded._cohort);
      expect(cohortCopy.equals(cohort)).to.equal(true);

      let measurementsCopy: Array<Measurement> = new Array<Measurement>();
      expect(Measurement.areEqual(measurements, measurementsCopy)).to.equal(true);
   });

   it("Needs to encode then decode CohortPresenter.", function () {

      let encoded = codec.encode(presenter);
      let decoded: CohortPresenter;

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