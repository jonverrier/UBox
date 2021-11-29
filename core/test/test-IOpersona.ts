'use strict';
// Copyright TXPCo ltd, 2021
import { Logger } from '../src/Logger';
import { PersistenceDetails } from '../src/Persistence';
import { Url, Name, PersonaMemento, Persona } from "../src/Persona";
import { NameCodec, UrlCodec, PersonaCodec, PersonasCodec} from '../src/IOPersona';

var expect = require("chai").expect;

describe("IOName", function () {


   var codec: NameCodec;

   beforeEach(function () {
      codec = new NameCodec();
   });

   it("Needs to decode a name from name input.", function () {

      var caught: boolean = false;

      try {
         codec.decode({ _displayName: "Joe" });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to throw exception if name is null.", function () {

      var caught: boolean = false;

      try {
         codec.decode({ _displayName: null });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(true);
   });

   it("Needs to encode then decode a Name.", function () {

      let initial = new Name("Joe");
      let encoded = codec.encode(initial);
      let decoded: Name;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom(encoded);
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(initial)).to.equal(true);
   });
});

describe("IOUrl", function () {

   var codec: UrlCodec;

   beforeEach(function () {
      codec = new UrlCodec();
   });

   it("Needs to decode a name from clean URL & isUrlVerified input.", function () {

      var caught: boolean = false;

      try {
         codec.decode({ _url: "Joe", _isUrlVerified: true });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to throw exception if URL is null.", function () {

      var caught: boolean = false;

      try {
         codec.decode({ _url: null, _isUrlVerified: true });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(true);
   });

   it("Needs to throw exception if isUrlVerified is null.", function () {

      var caught: boolean = false;

      try {
         codec.decode({ _url: "Joe", _isUrlVerified: null });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(true);
   });

   it("Needs to encode then decode a Url.", function () {

      let initial = new Url("https://jo.pics.com", true);
      let encoded = codec.encode(initial);
      let decoded: Url;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom(encoded);
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(initial)).to.equal(true);
   });

});

describe("IOPersona", function () {

   var codec: PersonaCodec;

   beforeEach(function () {
      codec = new PersonaCodec();
   });

   it("Needs to decode Person from clean input.", function () {

      var caught: boolean = false;

      try {
         codec.decode({
            _persistenceDetails: { _key: "Joe", _schemaVersion: 0, _sequenceNumber: 0 },
            _name: { _displayName: "Joe" },
            _thumbnailUrl: { _url: "https://jo.pics.com", _isUrlVerified: true },
         });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to encode Persona.", function () {

      let encoded: PersonaMemento = codec.encode(
         new Persona(new PersistenceDetails("1", 1, 1), new Name("Joe"), new Url("https://jo.pics.com", false)));

      expect(encoded._persistenceDetails._key).to.equal("1");
      expect(encoded._persistenceDetails._schemaVersion).to.equal(1);
      expect(encoded._persistenceDetails._sequenceNumber).to.equal(1);
   });

   it("Needs to encode then decode Person.", function () {

      let initial = new Persona(new PersistenceDetails("1", 1, 1), new Name("Joe"), new Url("https://jo.pics.com", false));
      let encoded = codec.encode(initial);
      let decoded: Persona;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom(encoded);
      } catch (e) {
         var logger = new Logger();
         logger.logError("Persona", "Encode-Decode", "Error", e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(initial)).to.equal(true);
   });

   it("Needs to encode & decode multiple Personas", function () {

      let initial = new Persona(new PersistenceDetails("1", 1, 1), new Name("Joe"), new Url("https://jo.pics.com", false));

      var people: Array<Persona> = new Array<Persona>();
      people.push(initial);
      people.push(initial);

      var peopleCodec: PersonasCodec = new PersonasCodec();
      var encoded = peopleCodec.encode(people);

      var newPeople: Array<Persona> = peopleCodec.tryCreateFrom(encoded);

      expect(newPeople[0].equals(initial)).to.equal(true);
   });
});