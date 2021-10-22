'use strict';
// Copyright TXPCo ltd, 2021

import { Logger } from '../src/Logger';
import { PersistenceDetails } from '../src/Persistence';
import { IdList, IdListCodec, PersistenceDetailsCodec } from '../src/IOCommon';


var expect = require("chai").expect;


describe("IOPersistenceDetails", function () {

   var codec: PersistenceDetailsCodec;

   beforeEach(function () {
      codec = new PersistenceDetailsCodec();
   });

   it("Needs to decode PersistenceDetails from clean input.", function () {

      var caught: boolean = false;

      try {
         codec.decode({ _key: "Joe", _schemaVersion: 0, _sequenceNumber: 0 });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to encode PersistenceDetails.", function () {

      let encoded = codec.encode(new PersistenceDetails("Joe", 0, 0));

      expect(encoded._key).to.equal("Joe");
      expect(encoded._schemaVersion).to.equal(0);
      expect(encoded._sequenceNumber).to.equal(0);
   });

   it("Needs to encode then decode PersistenceDetails.", function () {

      let initial = new PersistenceDetails("Joe", 0, 0);
      let encoded = codec.encode(initial);
      let decoded: PersistenceDetails;

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

describe("IdListCodec", function () {

   var codec: IdListCodec = new IdListCodec();
   var idList: IdList = new IdList(new Array<string> ('One', 'Two'));

   it("Needs to decode an IdList from clean input.", function () {

      var caught: boolean = false;

      try {

         codec.decode({
            _ids: ['One', 'Two']
         });

      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });


   it("Needs to encode IdList.", function () {

      let encoded = codec.encode(idList);     

      expect(idList.equals(encoded)).to.equals(true);
   });

   it("Needs to encode then decode IdList.", function () {

      let encoded = codec.encode(idList);
      let decoded: IdList;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom(encoded);
      } catch (e) {
         var logger = new Logger();
         logger.logError("IdList", "Decode", "Error", e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(idList)).to.equal(true);
   });
});
