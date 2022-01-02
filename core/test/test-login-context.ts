'use strict';
// Copyright TXPCo ltd, 2021
import { LoginContext, LoginContextMemento, ELoginProvider} from '../src/LoginContext';

var expect = require("chai").expect;

describe("LoginContext", function () {
   var context1: LoginContext, context2: LoginContext;
   let key1 = "madeupkey", key2 = "madeupkey2";

   beforeEach(function () {
      context1 = new LoginContext(ELoginProvider.Private, key1);
      context2 = new LoginContext(ELoginProvider.Private, key2);
   });

   it("Needs to compare for equality and inequality", function () {

      expect(context1.equals(context1)).to.equal(true);
      expect(context1.equals(context2)).to.equal(false);
   });

   it("Needs to correctly store attributes", function () {

      expect(context1.provider).to.equal(ELoginProvider.Private);
      expect(context1.externalId).to.equal(key1);
   });

   it("Needs to convert to and from memento()", function () {

      let memento: LoginContextMemento = context1.memento();
      let newContext = new LoginContext(memento);

      expect(context1.equals(newContext)).to.equal(true);
   });
});

