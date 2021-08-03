'use strict';
// Copyright TXPCo ltd, 2021
import { EmailAddress, Url, Name, Roles, Person, personArraysAreEqual, ERoleType } from '../src/Person';
import { decodeWith, encodeWith } from '../src/PersistenceIO';
import { nameCodec, tryNameDecode, emailCodec, tryEmailDecode, urlCodec, tryUrlDecode, rolesCodec, tryRolesDecode } from '../src/PersonIO';

var expect = require("chai").expect;

describe("NameIO", function () {

   it("Needs to decode a name from clean name & null surname input.", function () {

      var caught: boolean = false;

      try {
         decodeWith(nameCodec)({ name: "Joe", surname: null });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to decode a name from name & no surname input.", function () {

      var caught: boolean = false;

      try {
         decodeWith(nameCodec)({ name: "Joe"});
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to decode a name from clean name & surname input.", function () {

      var caught: boolean = false;

      try {
         decodeWith(nameCodec)({ name: "Joe", surname: "Bloggs" });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to throw exception if name is null.", function () {

      var caught: boolean = false;

      try {
         decodeWith(nameCodec)({ name: null, surname: "Bloggs" });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(true);
   });

   it("Needs to encode a Name.", function () {

      let encoded = encodeWith(nameCodec)(new Name ("Joe", "Bloggs"));

      expect(encoded.name).to.equal("Joe");
      expect(encoded.surname).to.equal("Bloggs");
   });

   it("Needs to encode then decode a Name.", function () {

      let initial = new Name("Joe", "Bloggs");
      let encoded = encodeWith(nameCodec)(initial);
      let decoded: Name;

      var caught: boolean = false;

      try {
         decoded = tryNameDecode(encoded);
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(initial)).to.equal(true);
   });
});

describe("EmailIO", function () {


   it("Needs to decode a name from clean email & isEmailVerified input.", function () {

      var caught: boolean = false;

      try {
         decodeWith(emailCodec)({ email: "Joe", isEmailVerified: true });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to throw exception if email is null.", function () {

      var caught: boolean = false;

      try {
         decodeWith(emailCodec)({ email: null, isEmailVerified: true });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(true);
   });

   it("Needs to throw exception if isEmailVerified is null.", function () {

      var caught: boolean = false;

      try {
         decodeWith(emailCodec)({ email: "Joe", isEmailVerified: null });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(true);
   });

   it("Needs to encode then decode an EmailAddress.", function () {

      let initial = new EmailAddress ("Joe@mail.com", true);
      let encoded = encodeWith(emailCodec)(initial);
      let decoded: EmailAddress;

      var caught: boolean = false;

      try {
         decoded = tryEmailDecode(encoded);
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(initial)).to.equal(true);
   });

});

describe("UrlIO", function () {


   it("Needs to decode a name from clean URL & isUrlVerified input.", function () {

      var caught: boolean = false;

      try {
         decodeWith(urlCodec)({ url: "Joe", isUrlVerified: true });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to throw exception if URL is null.", function () {

      var caught: boolean = false;

      try {
         decodeWith(urlCodec)({ url: null, isUrlVerified: true });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(true);
   });

   it("Needs to throw exception if isUrlVerified is null.", function () {

      var caught: boolean = false;

      try {
         decodeWith(urlCodec)({ url: "Joe", isUrlVerified: null });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(true);
   });

   it("Needs to encode then decode a Url.", function () {

      let initial = new Url("https://jo.pics.com", true);
      let encoded = encodeWith(urlCodec)(initial);
      let decoded: Url;

      var caught: boolean = false;

      try {
         decoded = tryUrlDecode(encoded);
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(initial)).to.equal(true);
   });

});

describe("RolesIO", function () {


   it("Needs to decode roles from clean input.", function () {

      let initial = new Roles(new Array<ERoleType>(ERoleType.Coach, ERoleType.Member));
      var caught: boolean = false;

      try {
         decodeWith(rolesCodec)(initial);
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to throw exception if invalid type.", function () {

      var caught: boolean = false;

      try {
         decodeWith(rolesCodec)([1, 2]);
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(true);
   });

   it("Needs to encode then decode Roles.", function () {

      let initial = new Roles(new Array<ERoleType>(ERoleType.Coach, ERoleType.Member));
      let encoded = encodeWith(rolesCodec)(initial);
      let decoded: Roles;

      var caught: boolean = false;

      try {
         decoded = tryRolesDecode(encoded);
      } catch (e) {
         console.log(e);
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(initial)).to.equal(true);
   });

});