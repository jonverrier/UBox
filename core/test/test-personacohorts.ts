'use strict';
// Copyright TXPCo ltd, 2021

import { Persona} from '../src/Persona';
import { PersonCohorts} from '../src/PersonCohorts';
import { PersonaTestHelper } from './testHelpers';

var expect = require("chai").expect;


describe("PersonCohortMemento", function () {

   var person: Persona, cohort: Persona;

   person = PersonaTestHelper.createJoe();

   cohort = PersonaTestHelper.createXFitDulwich();

   var personCohorts: PersonCohorts = new PersonCohorts(
      person,
      new Array<Persona>(cohort));
 
   
   it("Needs to correctly store attributes", function () {

      expect(personCohorts._persona.persistenceDetails.key === person.persistenceDetails.memento()._key).to.equal(true);
      expect(personCohorts._persona.personaDetails.name === person.personaDetails.memento()._name).to.equal(true);
      expect(personCohorts._persona.personaDetails.thumbnailUrl === person.personaDetails.memento()._thumbnailUrl).to.equal(true);

      expect(personCohorts._cohorts[0].persistenceDetails.key === cohort.persistenceDetails.memento()._key).to.equal(true);
      expect(personCohorts._cohorts[0].personaDetails.name === cohort.personaDetails.name).to.equal(true);
      expect(personCohorts._cohorts[0].personaDetails.thumbnailUrl === cohort.personaDetails.thumbnailUrl).to.equal(true);  
   });

});
