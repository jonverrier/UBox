'use strict';
// Copyright TXPCo ltd, 2021
import { Logger } from '../src/Logger';
import { LoginContext, ELoginProvider } from '../src/LoginContext';
import { LoginContextCodec} from '../src/IOLoginContext';

var expect = require("chai").expect;

describe("IOLoginContext", function () {


   var codec: LoginContextCodec;

   beforeEach(function () {
      codec = new LoginContextCodec();
   });

   it("Needs to decode LoginContext from clean input.", function () {

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

      let encoded = codec.encode(new LoginContext(ELoginProvider.Apple, "123"));

      expect(encoded._provider).to.equal(ELoginProvider.Apple);
      expect(encoded._token).to.equal("123");
   });

   it("Needs to encode then decode LoginDetails.", function () {

      let initial = new LoginContext(ELoginProvider.Apple, "123");
      let encoded = codec.encode(initial);
      let decoded: LoginContext;

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

