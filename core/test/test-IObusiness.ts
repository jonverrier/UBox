'use strict';
// Copyright TXPCo ltd, 2021
import { Logger } from '../src/Logger';
import { PersistenceDetails } from '../src/Persistence';
import { Url, Name, Persona } from "../src/Persona";
import { LoginDetails, EmailAddress, Roles, Person, ERoleType, ELoginProvider, PersonMemento } from '../src/Person';
import { Business, BusinessMemento } from '../src/Business';
import { BusinessCodec } from '../src/IOBusiness';

var expect = require("chai").expect;


describe("IOBusiness", function () {

   var codec: BusinessCodec;
   let person = new Person(new PersistenceDetails(1, 1, 1),
      new LoginDetails(ELoginProvider.Apple, "xxx"),
      new Persona(new Name("Joe"), new Url("https://jo.pics.com", false)),
      new EmailAddress("Joe@mail.com", true),
      null);

   let people = new Array<Person>();
   people.push(person);

   beforeEach(function () {
      codec = new BusinessCodec();
   });

   it("Needs to decode Business from clean input.", function () {

      var caught: boolean = false;

      try {
         codec.decode({
            _persistenceDetails: { _key: "Joe", _schemaVersion: 0, _sequenceNumber: 0 },
            _persona: {
               _name: { _displayName: "Joe" },
               _thumbnailUrl: { _url: "https://jo.pics.com", _isUrlVerified: true }
            },
            _administrators: people,
            _members: people
         });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to encode Business.", function () {

      let encoded: BusinessMemento = codec.encode(new Business(new PersistenceDetails(1, 1, 1),
         new Persona(new Name("Joe"), new Url("https://jo.pics.com", false)),
         people, people));

      expect(encoded._persistenceDetails._key).to.equal(1);
      expect(encoded._persistenceDetails._schemaVersion).to.equal(1);
      expect(encoded._persistenceDetails._sequenceNumber).to.equal(1);
   });

   it("Needs to encode then decode Business.", function () {

      let initial = new Business(new PersistenceDetails(1, 1, 1),
         new Persona(new Name("Joe"), new Url("https://jo.pics.com", false)),
         people, people);
      let encoded = codec.encode(initial);
      let decoded: Business;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom(encoded);
      } catch (e) {
         var logger = new Logger();
         logger.logError("Person", "Encode-Decode", "Error", e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(initial)).to.equal(true);
   });
});