'use strict';
// Copyright TXPCo ltd, 2021
import { Logger } from '../src/Logger';
import { PersistenceDetails } from '../src/Persistence';
import { Url, Name, Persona } from "../src/Persona";
import { EmailAddress, Roles, ERoleType, PersonMemento, Person } from '../src/Person';
import { Business, BusinessMemento } from '../src/Business';
import { BusinessCodec } from '../src/IOBusiness';

var expect = require("chai").expect;


describe("IOBusiness", function () {

   var codec: BusinessCodec;
   let roles = new Roles(new Array<ERoleType>(ERoleType.Member));
   let person = new Person(
      new Persona(new PersistenceDetails("1", 1, 1), new Name("Joe"), new Url("https://jo.pics.com", false)),
      new EmailAddress("Joe@mail.com", true),
      roles);

   let people = new Array<Person>();
   people.push(person);

   let peopleMementos = new Array<PersonMemento>();
   peopleMementos.push(person.memento());

   beforeEach(function () {
      codec = new BusinessCodec();
   });

   it("Needs to decode Business from clean input.", function () {

      var caught: boolean = false;

      try {
         let encoded = {
            _persona: {
               _persistenceDetails: {
                  _key: '1',
                  _schemaVersion: 1,
                  _sequenceNumber: 1
               },
               _name: { _displayName: 'Joe' },
               _thumbnailUrl: { _url: 'https://jo.pics.com', _isUrlVerified: false }
            },
            _administrators: peopleMementos,
            _members: peopleMementos
         };
         codec.decode(encoded);
         
      } catch (e) {

         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to encode Business.", function () {

      let encoded: BusinessMemento = codec.encode(new Business(
         new Persona(new PersistenceDetails("1", 1, 1), new Name("Joe"), new Url("https://jo.pics.com", false)),
         people, people));

      expect(encoded._persistenceDetails._key).to.equal("1");
      expect(encoded._persistenceDetails._schemaVersion).to.equal(1);
      expect(encoded._persistenceDetails._sequenceNumber).to.equal(1);
   });

   it("Needs to encode then decode Business.", function () {

      let initial = new Business(
         new Persona(new PersistenceDetails("1", 1, 1), new Name("Joe"), new Url("https://jo.pics.com", false)),
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