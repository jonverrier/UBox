'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";

export const personaSchema = new mongoose.Schema({
   _name: {
      _displayName: {
         type: String,
         required: true,
         index: true
      }
   },
   _thumbnailUrl: {
      _url: {
         type: String,
         required: true
      },
      _isUrlVerified: {
         type: Boolean,
         required: true
      }
   }
});
