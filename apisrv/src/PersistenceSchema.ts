'use strict';
// Copyright TXPCo ltd, 2020, 2021

export const persistenceDetailsSchema = {
   _key: {
      type: String,
      required: false
   },
   _schemaVersion: {
      type: Number,
      required: true
   },
   _sequenceNumber: {
      type: Number,
      required: true
   }
};
