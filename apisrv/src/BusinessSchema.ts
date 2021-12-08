'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";
import { persistenceDetailsSchema } from './PersistenceSchema';
import { personaDetailsSchema } from './PersonaSchema';
import { checkPersonReference} from './PersonSchema';

// Check the entries refer to an entry in Person collection 
export async function checkBusinessReference(item: string): Promise<boolean> {
   var rec = await businessModel.findById(item);

   var ok: boolean = (rec !== null);

   return ok;
};

// Check we have an array, that it is non zero length (optional), and all entries refer to People
async function checkPersonReferences(arr, nonZero: boolean): Promise<boolean> {

   if (!Array.isArray(arr))
      return false;

   if (nonZero) {
      if (arr.length === 0)
         return false;

   } else {
      if (arr.length === 0)
         return true;
   }

   for (var item of arr) {
      var ok: boolean = await checkPersonReference(item);
      if (!ok)
         return false;
   }

   return true;
}


export const businessSchema = new mongoose.Schema({
   _persistenceDetails: persistenceDetailsSchema,
   _personaDetails: personaDetailsSchema,
   _administratorIds: {
      type: [String],
      ref: 'Person',
      required: true,

      validate: {
         validator: async function (v) { return checkPersonReferences(v, true) },
         message: 'Invalid ID reference for Administrator'
      }
   },
   _memberIds: {
      type: [String],
      ref: 'Person',
      required: true,

      validate: {
         validator: async function (v) { return checkPersonReferences(v, false) },
         message: 'Invalid ID reference for Member'
      }
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
