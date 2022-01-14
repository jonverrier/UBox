'use strict';
// Copyright TXPCo ltd, 2021
import { Logger } from '../src/Logger';
import { InvalidParameterError } from '../src/CoreError';

var expect = require("chai").expect;


describe("Logger", function () {

   
   it("Needs to log info", function () {

      var caught: boolean = false;

      try {
         let logger: Logger = new Logger(false);
         logger.logInfo("TestLogger", "LogInfo", "Data:", "Some Data");
      } catch (ex) {
         caught = true
      }

      expect(caught).to.equal(false);
   });

   it("Needs to log info with no data", function () {

      var caught: boolean = false;

      try {
         let logger: Logger = new Logger(false);
         logger.logInfo("TestLogger", "LogInfo", "Data:");
      } catch (ex) {
         caught = true
      }

      expect(caught).to.equal(false);
   });

   it("Needs to log error", function () {

      var caught: boolean = false;

      try {
         let logger: Logger = new Logger(false);
         logger.logError("TestLogger", "LogError", "Data:", "Some Data");
      } catch (ex) {
         caught = true
      }

      expect(caught).to.equal(false);
   });

   it("Needs to log error with no data", function () {

      var caught: boolean = false;

      try {
         let logger: Logger = new Logger(false);
         logger.logError("TestLogger", "LogError", "Data:");
      } catch (ex) {
         caught = true
      }

      expect(caught).to.equal(false);
   });

   it("Needs to log error to server", function () {

      var caught: boolean = false;

      try {
         let logger: Logger = new Logger(true);
         logger.logError("TestLogger", "LogError", "Data:", "Some Data");
      } catch (ex) {
         caught = true
      }

      expect(caught).to.equal(false);
   });
});

