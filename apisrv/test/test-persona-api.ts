'use strict';
// Copyright TXPCo ltd, 2021

import { Logger } from '../../core/src/Logger';
import { Persona } from "../../core/src/Persona";
import { PersonaApi } from '../src/PersonaApi';
import { Person } from "../../core/src/Person";
import { PersonApi } from '../src/PersonApi';
import { PersonTestHelper } from '../../core/test/testHelpers';

var root: string = 'http://localhost:4000';

describe("PersonaApi", function () {
   var person1: Person;
   var personaApi: PersonaApi;
   var personApi: PersonApi;

   beforeEach(function () {
      person1 = PersonTestHelper.createMeForInsert();

      personaApi = new PersonaApi(root);
      personApi = new PersonApi(root);
   });


   it("Needs to save and then retrieve a Persona using lists", async function (done) {

      try {
         // Save a new Person object then read it back
         const response = await personApi.save(person1);

         // Build array query & ask for a list
         let ids = new Array<string>();
         ids.push(response.persistenceDetails.key);

         const decodedPersonas = await personaApi.loadMany(ids);

         // test is that we get the same person back as array[0] as we got from the first save operation 
         if (decodedPersonas[0].equals(response)) {
            done();
         } else {
            var logger = new Logger();
            var e: string = "Returned: " + decodedPersonas[0] + "original: " + response;
            logger.logError("PersonaApi", "Save-LoadMany", "Error", e);
            done (e)
         }

      } catch (e) {
         var logger = new Logger();
         logger.logError("PersonaApi", "Save-LoadMany", "Error", e.toString());
         done(e);
      }
   });
});


