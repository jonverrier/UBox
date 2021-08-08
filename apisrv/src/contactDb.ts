'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";

export class ContactDb {

   save(email: string, deletionRequest: boolean = false) {
      new contactModel({ email: email, deletionRequest: deletionRequest }).save();
   }
}

const contactSchema = new mongoose.Schema({
   email: {
      type: String,
      required: true,
      index: true
   },   
   deletionRequest: {
      type: Boolean,
      required: false,
      index: true
   }
},
{  // Enable timestamps for archival 
      timestamps: true
});

const contactModel = mongoose.model("Contact", contactSchema);
