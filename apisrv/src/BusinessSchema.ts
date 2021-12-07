'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";
import { persistenceDetailsSchema } from './PersistenceSchema';
import { personaDetailsSchema } from './PersonaSchema';


export const businessSchema = new mongoose.Schema({
   _persistenceDetails: persistenceDetailsSchema,
   _personaDetails: personaDetailsSchema,
   _administratorIds: {
      type: [String],
      required: true
   },
   _memberIds: {
      type: [String],
      required: true
   }
},
{  // Enable timestamps for archival 
      timestamps: true
});

businessSchema.set('toObject', {
   transform: function (doc, ret) {
      // Copy the _id into the persistenceCetails structure. 
      ret._persistenceDetails._key = doc._id.toString();
      return ret;
   }
});

export const businessModel = mongoose.model("Business", businessSchema);
