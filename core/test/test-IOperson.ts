'use strict';
// Copyright TXPCo ltd, 2021
import { Logger } from '../src/Logger';
import { PersistenceDetails } from '../src/Persistence';
import { Url, Name, Persona } from "../src/Persona";
import { LoginDetails, EmailAddress, Roles, Person, ERoleType, ELoginProvider, PersonMemento } from '../src/Person';
import { LoginDetailsCodec, EmailAddressCodec, RolesCodec, PersonCodec, PeopleCodec } from '../src/IOPerson';

var expect = require("chai").expect;


describe("IOLoginDetails", function () {


   var codec: LoginDetailsCodec;

   beforeEach(function () {
      codec = new LoginDetailsCodec();
   });

   it("Needs to decode LoginDetails from clean input.", function () {

      var caught: boolean = false;

      try {
         codec.decode({ _provider: ELoginProvider.Apple, _token: "123" });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to throw exception if token is null.", function () {

      var caught: boolean = false;

      try {
         codec.decode({ _provider: ELoginProvider.Apple});
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(true);
   });

   it("Needs to encode LoginDetails.", function () {

      let encoded = codec.encode(new LoginDetails(ELoginProvider.Apple, "123"));

      expect(encoded._provider).to.equal(ELoginProvider.Apple);
      expect(encoded._token).to.equal("123");
   });

   it("Needs to encode then decode LoginDetails.", function () {

      let initial = new LoginDetails(ELoginProvider.Apple, "123");
      let encoded = codec.encode(initial);
      let decoded: LoginDetails;

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

   beforeEach(function () {
      codec = new PersonCodec();
   });

   it("Needs to decode Person from clean input.", function () {

      var caught: boolean = false;

      try {
         codec.decode({
            _persistenceDetails: { _key: "Joe", _schemaVersion: 0, _sequenceNumber: 0 },
            _loginDetails: { _provider: ELoginProvider.Apple, _token: "123" },
            _persona: {
               _name: { _displayName: "Joe" },
               _thumbnailUrl: { _url: "https://jo.pics.com", _isUrlVerified: true },
            },
            _email: { _email: "Joe@mail.com", _isEmailVerified: false },
            _roles: { _roles: null } 
         });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to encode Person.", function () {

      let encoded: PersonMemento = codec.encode(new Person(new PersistenceDetails(1, 1, 1),
         new LoginDetails(ELoginProvider.Apple, "123"),
         new Persona(new Name("Joe"), new Url("https://jo.pics.com", false)),
         new EmailAddress("Joe@mail.com", true), null));

      expect(encoded._persistenceDetails._key).to.equal(1);
      expect(encoded._persistenceDetails._schemaVersion).to.equal(1);
      expect(encoded._persistenceDetails._sequenceNumber).to.equal(1);
   });

   it("Needs to encode then decode Person.", function () {

      let initial = new Person(new PersistenceDetails(1, 1, 1),
         new LoginDetails(ELoginProvider.Apple, "123"),
         new Persona(new Name("Joe"), new Url("https://jo.pics.com", false)),
         new EmailAddress("Joe@mail.com", true), null);
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

      let initial = new Person(new PersistenceDetails(1, 1, 1),
         new LoginDetails(ELoginProvider.Apple, "123"),
         new Persona(new Name("Joe"), new Url("https://jo.pics.com", false)),
         new EmailAddress("Joe@mail.com", true), null);

      var people: Array<Person> = new Array<Person>();
      people.push(initial);
      people.push(initial);

      var peopleCodec: PeopleCodec = new PeopleCodec();
      var encoded = peopleCodec.encode(people);

      var newPeople: Array<Person> = peopleCodec.tryCreateFrom(encoded);

      expect(newPeople[0].equals(initial)).to.equal(true);
   });
});