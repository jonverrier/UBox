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
      ref: 'Person',
      required: true
   },
   _memberIds: {
      type: [String],
      ref: 'Person',
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

// Additional indices - by the name of the business, and by names of members and admins
businessSchema.index({ '_personaDetails._name': 1});  
businessSchema.index({ _administratorIds: 1}); 
businessSchema.index({ _memberIds: 1 }); 

export const businessModel = mongoose.model("Business", businessSchema);
