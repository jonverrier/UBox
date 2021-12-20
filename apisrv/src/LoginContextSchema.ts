'use strict';
// Copyright TXPCo ltd, 2020, 2021

import { ELoginProvider } from '../../core/src/LoginContext';

const providerTypes: Array<string> = (Object.values(ELoginProvider));

export const loginContextSchema = {
   _provider: {
      type: String,
      enum: providerTypes,
      required: true
   },
   _externalId: {
      type: String,
      required: true
   }
};

