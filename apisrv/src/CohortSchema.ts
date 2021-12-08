'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";
import { ECohortType } from '../../core/src/Cohort';
import { persistenceDetailsSchema } from './PersistenceSchema';
import { personaDetailsSchema } from './PersonaSchema';
import { checkBusinessReference } from './BusinessSchema';


const cohortTypes: Array<string> = (Object.values(ECohortType));

// Check the entries refer to an entry in Person collection 
export async function checkCohortReference(item: string): Promise<boolean> {
   var rec = await cohortModel.findById(item);

   var ok: boolean = (rec !== null);

   return ok;
};

export const cohortSchema = new mongoose.Schema({
   _persistenceDetails: persistenceDetailsSchema,
   _personaDetails: personaDetailsSchema,
   _creationTimestamp: {
      type: Number,
      required: true
   },
   _businessId: {
      type: String,
      ref: 'Business',
      required: true,

      validate: {
         validator: async function (v) { return checkBusinessReference(v) },
         message: 'Invalid ID reference for Business'
      }
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
      // Copy the _id into the persistenceDetails structure. 
      ret._persistenceDetails._key = doc._id.toString();
      return ret;
   }
});

// Additional indices - by name of the persona, and by email
cohortSchema.index({ _businessId: 1 });
cohortSchema.index({ '_personaDetails._name': 1 }); 

export const cohortModel = mongoose.model("Cohort", cohortSchema);
