'use strict';
// Copyright TXPCo ltd, 2021
import { PersonaDetails, PersonaDetailsMemento } from '../src/Persona';
import { PersonCohortsMemento} from '../src/PersonCohorts';
import { PersonaTestHelper } from './testHelpers';

var expect = require("chai").expect;


describe("PersonCohortMemento", function () {

   var person: PersonaDetails, cohort: PersonaDetails;

   person = PersonaTestHelper.createJoeDetails();

   cohort = PersonaTestHelper.createXFitDulwichDetails();

   var personCohorts: PersonCohortsMemento = new PersonCohortsMemento(
      person.memento(),
      new Array<PersonaDetailsMemento>(cohort.memento()));
 
   
   it("Needs to correctly store attributes", function () {

      expect(personCohorts._personaDetails._name === person.memento()._name).to.equal(true);
      expect(personCohorts._personaDetails._thumbnailUrl === person.memento()._thumbnailUrl).to.equal(true);

      expect(personCohorts._cohorts[0]._name === cohort.name).to.equal(true);
      expect(personCohorts._cohorts[0]._thumbnailUrl === cohort.thumbnailUrl).to.equal(true);  
   });

});
