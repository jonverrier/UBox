'use strict';
// Copyright TXPCo ltd, 2021
import { EMeasurementType } from '../src/Observation';
import { OlympicLiftMeasurementTypeFactory, SpeedMeasurementTypeFactory } from '../src/ObservationDictionary';

var expect = require("chai").expect;

describe("ObservationDictionary", function () {

   
   it("Needs to correctly look up Olympic Lifts", function () {

      var _dictionary: OlympicLiftMeasurementTypeFactory = new OlympicLiftMeasurementTypeFactory();

      expect(_dictionary.lookup(EMeasurementType.Snatch)).to.not.equal(null);
      expect(_dictionary.lookup(EMeasurementType.Clean)).to.not.equal(null);
      expect(_dictionary.lookup(EMeasurementType.Jerk)).to.not.equal(null);
      expect(_dictionary.lookup(EMeasurementType.CleanAndJerk)).to.not.equal(null);
   });

   it("Needs to correctly look up Speed benchmarks", function () {

      var _dictionary: SpeedMeasurementTypeFactory = new SpeedMeasurementTypeFactory();

      expect(_dictionary.lookup(EMeasurementType.Row250)).to.not.equal(null);
      expect(_dictionary.lookup(EMeasurementType.Run800)).to.not.equal(null);
   });

});

