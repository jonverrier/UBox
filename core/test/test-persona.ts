'use strict';
// Copyright TXPCo ltd, 2021
import { Persona, PersonaDetails, PersonaMemento} from '../src/Persona';
import { PersistenceTestHelper, PersonaTestHelper } from './testHelpers';

var expect = require("chai").expect;


describe("Persona", function () {

   var persona1: Persona, persona2: Persona, personaErr:Persona;

   persona1 = new Persona (PersistenceTestHelper.createKey1(), PersonaTestHelper.createJoeDetails());

   persona2 = new Persona(PersistenceTestHelper.createKey2(), PersonaTestHelper.createJoe2Details());
  
   it("Needs to detect invalid name", function () {

      var caught: boolean = false;
      try {
         personaErr = new Persona(PersistenceTestHelper.createKey1(), new PersonaDetails("", "https://pics.com", ""));
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to detect null URL", function () {

      var caught: boolean = false;
      try {
         personaErr = new Persona(PersistenceTestHelper.createKey1(), new PersonaDetails("name", "", "bio"));
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });


   it("Needs to detect invalid URL", function () {

      var caught: boolean = false;
      try {
         personaErr = new Persona(PersistenceTestHelper.createKey1(), new PersonaDetails("name", "xx", "bio"));
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to detect valid relative URL", function () {

      var caught: boolean = false;
      try {
         personaErr = new Persona(PersistenceTestHelper.createKey1(), new PersonaDetails("name", "xx/xx", "bio"));
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(false);
   });

   it("Needs to compare for equality and inequality", function () {
      
      expect(persona1.equals(persona1)).to.equal(true);
      expect(persona1.equals(persona2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {
         
      expect(persona1.personaDetails.name === "Joe").to.equal(true);
      expect(persona1.personaDetails.thumbnailUrl === "/assets/img/person-o-512x512.png").to.equal(true);

      expect(persona1.memento()._personaDetails._name === persona1.memento()._personaDetails._name).to.equal(true);
      expect(persona1.memento()._personaDetails._thumbnailUrl === persona1.personaDetails.thumbnailUrl).to.equal(true);
      expect(persona1.memento()._personaDetails._bio === persona1.personaDetails.bio).to.equal(true);
   });

   it("Needs to correctly change attributes", function () {

      let newUrl = "https://jo.newpics.com";
      let newName = "NewJoe";
      let newBio = "newBio";

      persona1.personaDetails.name = newName;
      persona1.personaDetails.thumbnailUrl = newUrl;
      persona1.personaDetails.bio = newBio;

      expect(persona1.personaDetails.name === newName).to.equal(true);
      expect(persona1.personaDetails.thumbnailUrl === newUrl).to.equal(true);
      expect(persona1.personaDetails.bio === newBio).to.equal(true);

      let newdetails: PersonaDetails = new PersonaDetails(persona1.personaDetails.memento());
      persona1.personaDetails = newdetails;

      expect(persona1.personaDetails === newdetails).to.equal(true);
   });

   it("Needs to catch errors on change name attributes", function () {

      var caught: boolean = false;
      try {
         persona1.personaDetails.name = "";
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);

   });

   it("Needs to catch errors on change thumbnailUrl attributes", function () {

      var caught: boolean = false;
      try {
         persona1.personaDetails.thumbnailUrl = "";
      } catch (e) {
         caught = true;
      }
      expect(caught).to.equal(true);

   });


   it("Needs to compare arrays", function () {

      let people = new Array<Persona>();
      people.push(persona1);
      let people2 = new Array<Persona>();
      people2.push(persona2);
      let people3 = new Array<Persona>();
      people3.push(persona2);
      people3.push(persona2);

      expect(Persona.areEqual(people, people)).to.equal(true);
      expect(Persona.areEqual(people, null)).to.equal(false);
      expect(Persona.areEqual(null, people)).to.equal(false);
      expect(Persona.areEqual(people2, people)).to.equal(false);
      expect(Persona.areEqual(people3, people)).to.equal(false);
   });

   it("Needs to convert to and from memento()", function () {

      let memento: PersonaMemento = persona1.memento();
      let newPerson = new Persona (memento);

      expect(persona1.equals(newPerson)).to.equal(true);
   });

   it("Needs to test notLoggedIn statis", function () {

      let notLoggedIn: PersonaDetails = PersonaDetails.notLoggedIn();
      let notLoggedIn2: PersonaDetails = new PersonaDetails(PersonaDetails.notLoggedIn().memento()); 

      expect(PersonaDetails.isNotLoggedIn(notLoggedIn)).to.equal(true);
      expect(PersonaDetails.isNotLoggedIn(notLoggedIn2)).to.equal(true);
   });

   it("Needs to convert to and from mementos()", function () {

      let people = new Array<Persona>();
      people.push(persona1);
      let personas = Persona.mementos(people);

      let newPerson = new Persona(personas[0]);

      expect(persona1.equals(newPerson)).to.equal(true);
   });

   it("Needs to convert to and from mementos()", function () {

      let personas: Array<Persona> = new Array<Persona>();
      personas.push(persona1);
      let mementos: Array<PersonaMemento> = Persona.mementos(personas);
      let newPerson = new Persona(mementos[0]);

      expect(persona1.equals(newPerson)).to.equal(true);
   });
});
