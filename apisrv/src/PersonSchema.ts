'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";
import { persistenceDetailsSchema } from './PersistenceSchema';
import { personaDetailsSchema } from './PersonaSchema';

export const personSchema = new mongoose.Schema({
   _persistenceDetails: persistenceDetailsSchema,
   _personaDetails: personaDetailsSchema,
   _email: {
      type: String,
      required: false,
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

// Additional indices - by name of the persona, and by email
personSchema.index({ _email: 1 }); 
personSchema.index({ '_personaDetails._name': 1 }); 

export const personModel = mongoose.model("Person", personSchema);
