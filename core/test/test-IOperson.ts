'use strict';
// Copyright TXPCo ltd, 2021
import { Logger } from '../src/Logger';
import { EmailAddress, Roles, Person, ERoleType, PersonMemento } from '../src/Person';
import { EmailAddressCodec, RolesCodec, PersonCodec, PeopleCodec } from '../src/IOPerson';

import { PersonTestHelper } from './testHelpers';

var expect = require("chai").expect;

describe("IOEmail", function () {

   var codec: EmailAddressCodec;

   beforeEach(function () {
      codec = new EmailAddressCodec();
   });

   it("Needs to decode a name from clean email & isEmailVerified input.", function () {

      var caught: boolean = false;

      try {
         codec.decode ({ _email: "Joe", _isEmailVerified: true });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to throw exception if email is null.", function () {

      var caught: boolean = false;

      try {
         codec.decode({ _email: null, _isEmailVerified: true });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(true);
   });

   it("Needs to throw exception if isEmailVerified is null.", function () {

      var caught: boolean = false;

      try {
         codec.decode({ _email: "Joe", _isEmailVerified: null });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(true);
   });

   it("Needs to encode then decode an EmailAddress.", function () {

      let initial = new EmailAddress ("Joe@mail.com", true);
      let encoded = codec.encode (initial);
      let decoded: EmailAddress;

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
            _persistenceDetails: { _key: "Joe", _schemaVersion: 0, _sequenceNumber: 0 },
            _personaDetails : {
               _name: { _displayName: "Joe" },
               _thumbnailUrl: { _url: "https://jo.pics.com", _isUrlVerified: true }
            },
            _email: { _email: "Joe@mail.com", _isEmailVerified: false },
            _roles: roles 
         });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to encode Person.", function () {

      let encoded: PersonMemento = codec.encode(PersonTestHelper.createJoeMember());

      expect(encoded._persistenceDetails._key).to.equal("1");
      expect(encoded._persistenceDetails._schemaVersion).to.equal(1);
      expect(encoded._persistenceDetails._sequenceNumber).to.equal(1);
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