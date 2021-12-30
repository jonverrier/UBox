'use strict';
// Copyright TXPCo ltd, 2021
import { Logger } from '../src/Logger';
import { PersonaMemento, Persona } from "../src/Persona";
import { PersonaCodec, PersonasCodec} from '../src/IOPersona';

import { PersonaTestHelper } from './testHelpers';

var expect = require("chai").expect;


describe("IOPersona", function () {

   var codec: PersonaCodec;

   beforeEach(function () {
      codec = new PersonaCodec();
   });

   it("Needs to decode Persona from clean input.", function () {

      var caught: boolean = false;

      try {
         codec.decode({
            _persistenceDetails: { _key: "Joe", _schemaVersion: 0, _sequenceNumber: 0 },
            _personaDetails: {
               _name: "Joe",
               _thumbnailUrl: "https://jo.pics.com",
               _bio: "bio string"
            }
         });
      } catch (e) {
         caught = true;
      }

      expect(caught).to.equal(false);
   });

   it("Needs to encode Persona.", function () {

      let encoded: PersonaMemento = codec.encode(
         PersonaTestHelper.createJoe());

      expect(encoded._persistenceDetails._key).to.equal("1");
      expect(encoded._persistenceDetails._schemaVersion).to.equal(0);
      expect(encoded._persistenceDetails._sequenceNumber).to.equal(0);
   });

   it("Needs to encode then decode Persona.", function () {

      let initial = PersonaTestHelper.createJoe();
      let encoded = codec.encode(initial);
      let decoded: Persona;

      var caught: boolean = false;

      try {
         decoded = codec.tryCreateFrom(encoded);
      } catch (e) {
         var logger = new Logger();
         logger.logError("Persona", "Encode-Decode", "Error", e.toString());
         caught = true;
      }

      expect(caught).to.equal(false);
      expect(decoded.equals(initial)).to.equal(true);
   });

   it("Needs to encode & decode multiple Personas", function () {

      let initial = PersonaTestHelper.createJoe();

      var people: Array<Persona> = new Array<Persona>();
      people.push(initial);
      people.push(initial);

      var peopleCodec: PersonasCodec = new PersonasCodec();
      var encoded = peopleCodec.encode(people);

      var newPeople: Array<Persona> = peopleCodec.tryCreateFrom(encoded);

      expect(newPeople[0].equals(initial)).to.equal(true);
   });
});