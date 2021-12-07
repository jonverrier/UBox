'use strict';
// Copyright TXPCo ltd, 2021
import { Logger } from '../src/Logger';
import { Roles, ERoleType, PersonMemento, Person } from '../src/Person';
import { Business, BusinessMemento } from '../src/Business';
import { BusinessCodec, BusinessesCodec } from '../src/IOBusiness';

import { PersistenceTestHelper, PersonaTestHelper, PersonTestHelper } from './testHelpers';

var expect = require("chai").expect;

describe("IOBusiness", function () {

   var codec: BusinessCodec;
   var arrayCodec: BusinessesCodec;
   let person = PersonTestHelper.createJoeMember();

   let people = new Array<Person>();
   people.push(person);

   let peopleMementos = new Array<PersonMemento>();
   peopleMementos.push(person.memento());

   beforeEach(function () {
      codec = new BusinessCodec();
      arrayCodec = new BusinessesCodec();
   });

   it("Needs to decode Business from clean input.", function () {

      var caught: boolean = false;

      try {
         let encoded = {
            _persistenceDetails: {
               _key: '1',
               _schemaVersion: 1,
               _sequenceNumber: 1
            },
            _personaDetails: {
               _name: 'Joe' ,
               _thumbnailUrl:'https://jo.pics.com' 
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
         PersistenceTestHelper.createKey1(),
         PersonaTestHelper.createJoeDetails(),
         people, people));

      expect(encoded._persistenceDetails._key).to.equal("1");
      expect(encoded._persistenceDetails._schemaVersion).to.equal(0);
      expect(encoded._persistenceDetails._sequenceNumber).to.equal(0);
   });

   it("Needs to encode then decode Business.", function () {

      let initial = new Business(
         PersistenceTestHelper.createKey1(),
         PersonaTestHelper.createJoeDetails(),
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

   it("Needs to decode Business from an array.", function () {

      let initial = new Business(
         PersistenceTestHelper.createKey1(),
         PersonaTestHelper.createJoeDetails(),
         people, people);
      let list: Array<Business> = new Array<Business>();
      list.push(initial);

      let encodedArray = arrayCodec.encode(list);
      var caught: boolean = false;

      try {
         let decoded = arrayCodec.tryCreateFrom(encodedArray);

         expect(decoded[0].equals(initial)).to.equal(true);
      } catch (e) {
         var logger = new Logger();
         logger.logError("Person", "Decode from array.", "Error", e.toString());
         caught = true;
      }
   });
});