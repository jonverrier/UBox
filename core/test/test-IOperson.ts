'use strict';
// Copyright TXPCo ltd, 2021
import { Logger } from '../src/Logger';
import { Roles, Person, ERoleType, PersonMemento } from '../src/Person';
import { RolesCodec, PersonCodec, PeopleCodec } from '../src/IOPerson';

import { PersonTestHelper } from './testHelpers';

var expect = require("chai").expect;

describe("IORoles", function () {

   var codec: RolesCodec;

   beforeEach(function () {
      codec = new RolesCodec();
   });

   it("Needs to decode roles from clean input.", function () {

      let initial = new Roles(new Array<ERoleType>(ERoleType.Coach, ERoleType.Member));
      var caught: boolean = false;

      try {
         codec.decode (initial);
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to throw exception if invalid type.", function () {

      var caught: boolean = false;

      try {
         codec.decode([1, 2]);
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(true);
   });

   it("Needs to encode then decode Roles.", function () {

      let initial = new Roles(new Array<ERoleType>(ERoleType.Coach, ERoleType.Member));
      let encoded = codec.encode (initial);
      let decoded: Roles;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom(encoded);
      } catch (e) {
         var logger = new Logger();
         logger.logError("Roles", "Encode-Decode", "Error", e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(initial)).to.equal(true);
   });

});

describe("IOPerson", function () {

   var codec: PersonCodec;
   let roles = new Roles(new Array<ERoleType>(ERoleType.Member));

   beforeEach(function () {
      codec = new PersonCodec();
   });

   it("Needs to decode Person from clean input.", function () {

      var caught: boolean = false;

      try {
         codec.decode({
            _persistenceDetails: { _key: "id", _schemaVersion: 0, _sequenceNumber: 0 },
            _personaDetails : {
               _name: "Joe" ,
               _thumbnailUrl: "https://jo.pics.com"
            },
            _email: "Joe@mail.com",
            _roles: roles 
         });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to encode Person.", function () {

      let Joe = PersonTestHelper.createJoeMember();
      let encoded: PersonMemento = codec.encode(Joe);

      expect(encoded._persistenceDetails._key).to.equal(Joe.persistenceDetails.key);
      expect(encoded._persistenceDetails._schemaVersion).to.equal(Joe.persistenceDetails.schemaVersion);
      expect(encoded._persistenceDetails._sequenceNumber).to.equal(Joe.persistenceDetails.sequenceNumber);
   });

   it("Needs to encode then decode Person.", function () {

      let initial = PersonTestHelper.createJoeMember();
      let encoded = codec.encode(initial);
      let decoded: Person;

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

   it("Needs to encode & decode multiple People", function () {

      let initial = PersonTestHelper.createJoeMember();

      var people: Array<Person> = new Array<Person>();
      people.push(initial);
      people.push(initial);

      var peopleCodec: PeopleCodec = new PeopleCodec();
      var encoded = peopleCodec.encode(people);

      var newPeople: Array<Person> = peopleCodec.tryCreateFrom(encoded);

      expect(newPeople[0].equals(initial)).to.equal(true);
   });
});