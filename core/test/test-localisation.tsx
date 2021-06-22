'use strict';
// Copyright TXPCo ltd, 2021
import { ITextLocaliser, ELanguage } from '../src/Localisation';

var expect = require("chai").expect;

enum TestStrings { Test = 1 };

class TestStringLocaliser implements ITextLocaliser {

   load(id: number, language: ELanguage): string {
      if (id === 1 && language === ELanguage.EnglishUK)
         return "Test";
      else
         throw new RangeError();
   }
}


describe("Localisation", function () {

   var testStringLocaliser: TestStringLocaliser = new TestStringLocaliser;
   
   it("Needs to return a valid localised string", function () {
      let localisedString = testStringLocaliser.load(1, ELanguage.EnglishUK);

      expect(localisedString).to.equal("Test");
   });

   it("Needs to throw exception on invalid localised string ID", function () {

      var caught: boolean = false;

      try {
         let localisedString = testStringLocaliser.load(2, ELanguage.EnglishUK);
      } catch (ex) {
         caught = true
      }

      expect(caught).to.equal(true);
   });

   it("Needs to throw exception on invalid localised language ID", function () {

      var caught: boolean = false;

      try {
         let localisedString = testStringLocaliser.load(1, 3);
      } catch (ex) {
         caught = true
      }

      expect(caught).to.equal(true);
   });

});

