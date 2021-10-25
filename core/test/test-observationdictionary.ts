'use strict';
// Copyright TXPCo ltd, 2021
import { EMeasurementType } from '../src/Observation';
import { ObservationDictionary } from '../src/ObservationDictionary';

var expect = require("chai").expect;

describe("ObservationDictionary", function () {

   var _dictionary: ObservationDictionary = new ObservationDictionary();
   
   it("Needs to correctly look up Olympic Lifts", function () {

      expect(_dictionary.lookupWeightMeasurementType(EMeasurementType.Snatch)).to.not.equal(null);
      expect(_dictionary.lookupWeightMeasurementType(EMeasurementType.Clean)).to.not.equal(null);
      expect(_dictionary.lookupWeightMeasurementType(EMeasurementType.Jerk)).to.not.equal(null);
      expect(_dictionary.lookupWeightMeasurementType(EMeasurementType.CleanAndJerk)).to.not.equal(null);
   });

   it("Needs to correctly look up Speed benchmarks", function () {

      expect(_dictionary.lookupTimeMeasurementType(EMeasurementType.Row250)).to.not.equal(null);
      expect(_dictionary.lookupTimeMeasurementType(EMeasurementType.Run800)).to.not.equal(null);
   });

});

