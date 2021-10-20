'use strict';
// Copyright TXPCo ltd, 2021

import { Logger } from '../src/Logger';
import { PersistenceDetails } from '../src/Persistence';
import { IdList, IdListCodec } from '../src/IOCommon';


var expect = require("chai").expect;

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
