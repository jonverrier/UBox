'use strict';
// Copyright TXPCo ltd, 2021
import { ITextLocaliser, ELanguage } from '../src/Localisation';
import { InvalidParameterError } from '../src/CoreError';

var expect = require("chai").expect;

enum TestStrings { Test = 1 };

class TestStringLocaliser implements ITextLocaliser {
   private _language: ELanguage;

   constructor(language: ELanguage) {
      if (language !== ELanguage.EnglishUK)
         throw new InvalidParameterError();
      this._language = language;
   }

   /**
   * set of 'getters' and setters for private variables
   */
   get language(): ELanguage {
      return this._language;
   }

   get lowestValue() : number { return 1 }
   get highestValue() : number { return 1 }

   load(id: number): string {
      if (id === 1 && this._language === ELanguage.EnglishUK)
         return "Test";
      else
         throw new RangeError();
   }
}


describe("Localisation", function () {

   var testStringLocaliser: TestStringLocaliser = new TestStringLocaliser(ELanguage.EnglishUK);
   
   it("Needs to return a valid localised string", function () {
      let localisedString = testStringLocaliser.load(1);

      expect(localisedString).to.equal("Test");
   });

   it("Needs to throw exception on invalid localised string ID", function () {

      var caught: boolean = false;

      try {
         testStringLocaliser.load(2);
      } catch (ex) {
         caught = true
      }

      expect(caught).to.equal(true);
   });

   it("Needs to throw exception on invalid localised language ID", function () {

      var caught: boolean = false;

      try {
         var testStringLocaliser: TestStringLocaliser = new TestStringLocaliser(ELanguage.French);
      } catch (ex) {
         caught = true
      }

      expect(caught).to.equal(true);
   });

});

