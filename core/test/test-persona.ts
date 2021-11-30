'use strict';
// Copyright TXPCo ltd, 2021
import { Url, Name, UrlMemento , Persona, PersonaMemento} from '../src/Persona';
import { PersistenceTestHelper, PersonaTestHelper } from './testHelpers';

var expect = require("chai").expect;

describe("Name", function () {
   var name1: Name, name2: Name, name3: Name;

   beforeEach(function () {
      name1 = new Name("Joe");
      name2 = new Name("Bill");
      name3 = new Name("Joe");
   });

   it("Needs to compare for equality and inequality", function () {

      expect(name1.equals(name1)).to.equal(true);
      expect(name1.equals(name2)).to.equal(false);
      expect(name1.equals(name3)).to.equal(true);
   });

   it("Needs to catch invalid name", function () {

      let caught = false;

      try {
         let name4 = new Name("");
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to correctly store attributes", function () {

      expect(name1.displayName).to.equal("Joe");
   });
});

describe("Url", function () {
   var url1: Url, url2: Url, url3: Url;

   beforeEach(function () {
      url1 = new Url("https://jo.pics.com", true);
      url2 = new Url("https://jo.pics.com", false);
      url3 = new Url("https://jo.pics.com", false);
   });

   it("Needs to compare for equality and inequality", function () {

      expect(url1.equals(url1)).to.equal(true);
      expect(url1.equals(url2)).to.equal(false);
      expect(url1.equals(url3)).to.equal(false);
   });

   it("Needs to catch invalid url", function () {

      let caught = false;

      try {
         let email4 = new Url("11", false);
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });


   it("Needs to catch empty url", function () {

      let caught = false;

      try {
         let email4 = new Url("", false);
      }
      catch {
         caught = true;
      }
      expect(caught).to.equal(true);
   });

   it("Needs to correctly store attributes", function () {

      expect(url1.url).to.equal("https://jo.pics.com");
      expect(url1.isUrlVerified).to.equal(true);
   });

   it("Needs to convert to and from memento()", function () {

      let memento:UrlMemento = url1.memento();
      let newUrl = new Url(memento.url, memento.isUrlVerified);

      expect(url1.equals (newUrl)).to.equal(true);
   });
});

describe("Persona", function () {

   var person1: Persona, person2: Persona;

   person1 = new Persona (PersistenceTestHelper.createKey1(), PersonaTestHelper.createJoeDetails());

   person2 = new Persona(PersistenceTestHelper.createKey2(), PersonaTestHelper.createJoe2Details());
  

   it("Needs to compare for equality and inequality", function () {
      
      expect(person1.equals(person1)).to.equal(true);
      expect(person1.equals(person2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {
         
      expect(person1.personaDetails.name.equals(new Name("Joe"))).to.equal(true);
      expect(person1.personaDetails.thumbnailUrl.equals(new Url("https://joe.thumbnails.com", false))).to.equal(true);

      expect(person1.memento()._personaDetails._name._displayName === person1.memento()._personaDetails._name._displayName).to.equal(true);
      expect(person1.memento()._personaDetails._thumbnailUrl._url === person1.personaDetails.thumbnailUrl.memento().url).to.equal(true);
   });

   it("Needs to correctly change attributes", function () {

      let newUrl = new Url("https://jo.newpics.com", false);
      let newName = new Name("NewJoe");

      person1.personaDetails.name = newName;
      person1.personaDetails.thumbnailUrl = newUrl;

      expect(person1.personaDetails.name.equals (newName)).to.equal(true);
      expect(person1.personaDetails.thumbnailUrl.equals(newUrl)).to.equal(true);
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
