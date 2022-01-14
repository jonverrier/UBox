'use strict';
// Copyright TXPCo ltd, 2021
import { EMeasurementType } from '../src/ObservationType';
import { MeasurementTypes } from '../src/ObservationTypeDictionary';

var expect = require("chai").expect;

describe("ObservationDictionary", function () {

   
   it("Needs to correctly look up Olympic Lifts", function () {

      var _dictionary: MeasurementTypes = new MeasurementTypes();

      expect(_dictionary.lookup(EMeasurementType.Snatch)).to.not.equal(null);
      expect(_dictionary.lookup(EMeasurementType.Clean)).to.not.equal(null);
      expect(_dictionary.lookup(EMeasurementType.Jerk)).to.not.equal(null);
      expect(_dictionary.lookup(EMeasurementType.CleanAndJerk)).to.not.equal(null);
   });

   it("Needs to correctly look up Power Lifts", function () {

      var _dictionary: MeasurementTypes = new MeasurementTypes();

      expect(_dictionary.lookup(EMeasurementType.Bench)).to.not.equal(null);
      expect(_dictionary.lookup(EMeasurementType.Backsquat)).to.not.equal(null);
      expect(_dictionary.lookup(EMeasurementType.Deadlift)).to.not.equal(null);
   });

   it("Needs to correctly look up Speed benchmarks", function () {

      var _dictionary: MeasurementTypes = new MeasurementTypes();

      expect(_dictionary.lookup(EMeasurementType.Row250)).to.not.equal(null);
      expect(_dictionary.lookup(EMeasurementType.Run800)).to.not.equal(null);
   });

   it("Needs to detect incorrect types", function () {

      var _dictionary: MeasurementTypes = new MeasurementTypes();

      expect(_dictionary.lookup("Notamovement")).to.equal(null);
      expect(_dictionary.isValid("Notamovement")).to.equal(false);
   });

});

