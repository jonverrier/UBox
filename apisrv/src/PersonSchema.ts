'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";
import { persistenceDetailsSchema } from './PersistenceSchema';
import { personaDetailsSchema } from './PersonaSchema';
import { loginContextSchema } from './LoginContextSchema';

// Check the entries refer to an entry in Person collection 
export async function checkPersonReference(item: string): Promise<boolean> {
   var rec = await personModel.findById(item);

   var ok: boolean = (rec !== null);

   return ok;
};

export const personSchema = new mongoose.Schema({
   _persistenceDetails: persistenceDetailsSchema,
   _personaDetails: personaDetailsSchema,
   _loginContext: loginContextSchema,
   _email: {
      type: String,
      required: true,
      index: true
   },
   _roles: {
      _roles: {
         type: [String],
         enum: ["Prospect", "Member", "Coach"],
         required: true
      }
   }
},
{  // Enable timestamps for archival 
      timestamps: true
});

personSchema.set('toObject', {
   transform: function (doc, ret) {
      // Copy the _id into the persistenceCetails structure. 
      ret._persistenceDetails._key = doc._id.toString();
      return ret;
   }
});

// Additional indices - by name of the persona, by email, and by the extrnal login identifier
personSchema.index({ _email: 1 }); 
personSchema.index({ '_personaDetails._name': 1 }); 
personSchema.index({ '_loginContext._externalId': 1 }); 

export const personModel = mongoose.model("Person", personSchema);
