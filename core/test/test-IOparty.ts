'use strict';
// Copyright TXPCo ltd, 2021
import { Logger } from '../src/Logger';
import { Url, Name } from "../src/Party";
import { NameCodec, UrlCodec } from '../src/IOParty';

var expect = require("chai").expect;

describe("IOName", function () {


   var codec: NameCodec;

   beforeEach(function () {
      codec = new NameCodec();
   });

   it("Needs to decode a name from name input.", function () {

      var caught: boolean = false;

      try {
         codec.decode({ _displayName: "Joe"});
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to throw exception if name is null.", function () {

      var caught: boolean = false;

      try {
         codec.decode({ _displayName: null});
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
         decoded = codec.tryCreateFrom (encoded);
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
