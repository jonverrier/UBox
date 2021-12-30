'use strict';
// Copyright TXPCo ltd, 2020, 2021

export const personaDetailsSchema = {
   _name: {
      type: String,
      required: true,
      index: true
   },
   _thumbnailUrl: {
      type: String,
      required: true
   },
   _bio: {
      type: String,
      required: false,
      index: false
   },
};
