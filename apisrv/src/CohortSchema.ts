'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";
import { ECohortType } from '../../core/src/Cohort';
import { persistenceDetailsSchema } from './PersistenceSchema';
import { personaDetailsSchema } from './PersonaSchema';


const cohortTypes: Array<string> = (Object.values(ECohortType));

export const cohortSchema = new mongoose.Schema({
   _persistenceDetails: persistenceDetailsSchema,
   _personaDetails: personaDetailsSchema,
   _creationTimestamp: {
      type: Number,
      required: true
   },
   _businessId: {
      type: String,
      required: true
   },
   _cohortType: {
      type: String,
      enum: cohortTypes,
      required: true
   }
},
{  // Enable timestamps for archival 
      timestamps: true
});

cohortSchema.set('toObject', {
   transform: function (doc, ret) {
      // Copy the _id into the persistenceCetails structure. 
      ret._persistenceDetails._key = doc._id.toString();
      return ret;
   }
});

export const cohortModel = mongoose.model("Cohort", cohortSchema);
