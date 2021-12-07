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

export const personModel = mongoose.model("Person", personSchema);
