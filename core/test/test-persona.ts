'use strict';
// Copyright TXPCo ltd, 2021
import { Persona, PersonaDetails, PersonaMemento} from '../src/Persona';
import { PersistenceTestHelper, PersonaTestHelper } from './testHelpers';

var expect = require("chai").expect;


describe("Persona", function () {

   var person1: Persona, person2: Persona, personErr:Persona;

   person1 = new Persona (PersistenceTestHelper.createKey1(), PersonaTestHelper.createJoeDetails());

   person2 = new Persona(PersistenceTestHelper.createKey2(), PersonaTestHelper.createJoe2Details());
  
   it("Needs to detect invalid name", function () {

      var caught: boolean = false;
      try {
         personErr = new Persona(PersistenceTestHelper.createKey1(), new PersonaDetails("", "https://pics.com"));
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to detect null URL", function () {

      var caught: boolean = false;
      try {
         personErr = new Persona(PersistenceTestHelper.createKey1(), new PersonaDetails("name", ""));
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });


   it("Needs to detect invalid URL", function () {

      var caught: boolean = false;
      try {
         personErr = new Persona(PersistenceTestHelper.createKey1(), new PersonaDetails("name", "xx"));
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to detect valid relative URL", function () {

      var caught: boolean = false;
      try {
         personErr = new Persona(PersistenceTestHelper.createKey1(), new PersonaDetails("name", "xx/xx"));
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(false);
   });

   it("Needs to compare for equality and inequality", function () {
      
      expect(person1.equals(person1)).to.equal(true);
      expect(person1.equals(person2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {
         
      expect(person1.personaDetails.name === "Joe").to.equal(true);
      expect(person1.personaDetails.thumbnailUrl === "https://joe.thumbnails.com").to.equal(true);

      expect(person1.memento()._personaDetails._name === person1.memento()._personaDetails._name).to.equal(true);
      expect(person1.memento()._personaDetails._thumbnailUrl === person1.personaDetails.thumbnailUrl).to.equal(true);
   });

   it("Needs to correctly change attributes", function () {

      let newUrl = "https://jo.newpics.com";
      let newName = "NewJoe";

      person1.personaDetails.name = newName;
      person1.personaDetails.thumbnailUrl = newUrl;

      expect(person1.personaDetails.name === newName).to.equal(true);
      expect(person1.personaDetails.thumbnailUrl === newUrl).to.equal(true);
   });

   it("Needs to compare arrays", function () {

      let people = new Array<Persona>();
      people.push(person1);
      let people2 = new Array<Persona>();
      people2.push(person2);
      let people3 = new Array<Persona>();
      people3.push(person2);
      people3.push(person2);

      expect(Persona.areEqual(people, people)).to.equal(true);
      expect(Persona.areEqual(people, null)).to.equal(false);
      expect(Persona.areEqual(null, people)).to.equal(false);
      expect(Persona.areEqual(people2, people)).to.equal(false);
      expect(Persona.areEqual(people3, people)).to.equal(false);
   });

   it("Needs to convert to and from memento()", function () {

      let memento: PersonaMemento = person1.memento();
      let newPerson = new Persona (memento);

      expect(person1.equals(newPerson)).to.equal(true);
   });

   it("Needs to convert to and from mementos()", function () {

      let personas: Array<Persona> = new Array<Persona>();
      personas.push(person1);
      let mementos: Array<PersonaMemento> = Persona.mementos(personas);
      let newPerson = new Persona(mementos[0]);

      expect(person1.equals(newPerson)).to.equal(true);
   });
});
