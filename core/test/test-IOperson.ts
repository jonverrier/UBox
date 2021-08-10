'use strict';
// Copyright TXPCo ltd, 2021
import { PersistenceDetails } from '../src/Persistence';
import { PersistenceDetailsCodec } from '../src/IOCommon';
import { LoginDetails, EmailAddress, Url, Name, Roles, Person, ERoleType, ELoginProvider } from '../src/Person';
import { NameCodec, LoginDetailsCodec, EmailAddressCodec, UrlCodec, RolesCodec, PersonCodec } from '../src/IOPerson';

var expect = require("chai").expect;

describe("IOName", function () {


   var codec: NameCodec;

   beforeEach(function () {
      codec = new NameCodec();
   });

   it("Needs to decode a name from clean name & null surname input.", function () {

      var caught: boolean = false;

      try {
         codec.decode ({ _name: "Joe", _surname: null });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to decode a name from name & no surname input.", function () {

      var caught: boolean = false;

      try {
         codec.decode({ _name: "Joe"});
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to decode a name from clean name & surname input.", function () {

      var caught: boolean = false;

      try {
         codec.decode({ _name: "Joe", _surname: "Bloggs" });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to throw exception if name is null.", function () {

      var caught: boolean = false;

      try {
         codec.decode({ _name: null, _surname: "Bloggs" });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(true);
   });

   it("Needs to encode a Name.", function () {

      let encoded = codec.encode (new Name ("Joe", "Bloggs"));

      console.log(encoded);
      expect(encoded.name).to.equal("Joe");
      expect(encoded.surname).to.equal("Bloggs");
   });

   it("Needs to encode then decode a Name.", function () {

      let initial = new Name("Joe", "Bloggs");
      let encoded = codec.encode(initial);
      let decoded: Name;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom (encoded);
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(initial)).to.equal(true);
   });
});

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

      expect(encoded.provider).to.equal(ELoginProvider.Apple);
      expect(encoded.token).to.equal("123");
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

describe("IOUrl", function () {

   var codec: UrlCodec;

   beforeEach(function () {
      codec = new UrlCodec();
   });

   it("Needs to decode a name from clean URL & isUrlVerified input.", function () {

      var caught: boolean = false;

      try {
         codec.decode ({ _url: "Joe", _isUrlVerified: true });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to throw exception if URL is null.", function () {

      var caught: boolean = false;

      try {
         codec.decode ({ _url: null, _isUrlVerified: true });
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
      let encoded = codec.encode (initial);
      let decoded: Url;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom (encoded);
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
         console.log(e);
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(initial)).to.equal(true);
   });

});

describe("IOPersistenceDetails", function () {


   var codec: PersistenceDetailsCodec;

   beforeEach(function () {
      codec = new PersistenceDetailsCodec();
   });

   it("Needs to decode PersistenceDetails from clean input.", function () {

      var caught: boolean = false;

      try {
         codec.decode({ _id: "Joe", _schemaVersion: 0, _sequenceNumber: 0 });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to encode PersistenceDetails.", function () {

      let encoded = codec.encode(new PersistenceDetails("Joe", 0, 0));

      expect(encoded.id).to.equal("Joe");
      expect(encoded.schemaVersion).to.equal(0);
      expect(encoded.sequenceNumber).to.equal(0);
   });

   it("Needs to encode then decode PersistenceDetails.", function () {

      let initial = new PersistenceDetails("Joe", 0, 0);
      let encoded = codec.encode(initial);
      let decoded: PersistenceDetails;

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

describe("IOPerson", function () {


   var codec: PersonCodec;

   beforeEach(function () {
      codec = new PersonCodec();
   });

   it("Needs to decode Person from clean input.", function () {

      var caught: boolean = false;

      try {
         codec.decode({
            _persistenceDetails: { _id: "Joe", _schemaVersion: 0, _sequenceNumber: 0 },
            _loginDetails: { _provider: ELoginProvider.Apple, _token: "123" },
            _name: { _name: "Joe", _surname: "Bloggs" },
            _email: { _email: "Joe@mail.com", _isEmailVerified: false },
            _thumbnailUrl: { _url: "https://jo.pics.com", _isUrlVerified: true },
            _roles: { _roles: null } 
         });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to encode Person.", function () {

      let encoded = codec.encode(new Person(new PersistenceDetails(1, 1, 1),
         new LoginDetails(ELoginProvider.Apple, "123"),
         new Name("Joe"),
         new EmailAddress("Joe@mail.com", true), new Url("https://jo.pics.com", false), null));

      expect(encoded.persistenceDetails.id).to.equal(1);
      expect(encoded.persistenceDetails.schemaVersion).to.equal(1);
      expect(encoded.persistenceDetails.sequenceNumber).to.equal(1);
   });

   it("Needs to encode then decode Person.", function () {

      let initial = new Person(new PersistenceDetails(1, 1, 1),
         new LoginDetails(ELoginProvider.Apple, "123"),
         new Name("Joe"),
         new EmailAddress("Joe@mail.com", true), new Url("https://jo.pics.com", false), null);
      let encoded = codec.encode(initial);
      let decoded: Person;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom(encoded);
      } catch (e) {
         console.log(e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(initial)).to.equal(true);
   });
});