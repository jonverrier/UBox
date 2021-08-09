'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";
import { Person } from '../../core/src/Person';

export class PersonDb {

   save(person: Person) : void {
      new personModel(person).save();
   }
}

const personSchema = new mongoose.Schema({
   persistenceDetails: {
   },
   loginDetails: {
      provider: {
         type: String,
         enum: ["Apple", "Google", "Private"],
         required: true
      },
      token: {
         type: String,
         required: true,
         index: true
      },
   },
   name: {
      name: {
         type: String,
         required: true,
         index: true
      },
      surname: {
         type: String,
         required: false,
         index: true
      },
   },
   email: {
      email: {
         type: String,
         required: true,
         index: true
      },
      isEmailVerified: {
         type: Boolean,
         required: true
      }
   },
   thumbnailUrl: {
      url: {
         type: String,
         required: true
      },
      isUrlVerified: {
         type: Boolean,
         required: true
      }
   },
   roles: {
      type: [String],
      enum: ["Prospect", "Member", "Coach"],
      required: true
   }
},
{  // Enable timestamps for archival 
      timestamps: true
});

const personModel = mongoose.model("Person", personSchema);
