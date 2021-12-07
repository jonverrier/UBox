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

export const personModel = mongoose.model("Person", personSchema);
