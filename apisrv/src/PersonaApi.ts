'use strict';
// Copyright TXPCo ltd, 2021
// Implements IMeasurementStore over a web API

import { Persona, IPersonaStore} from '../../core/src/Persona';
import { PersonasCodec } from '../../core/src/IOPersona';
import { MultiApiHelper } from './ApiHelp';

import { EApiUrls } from './ApiUrls';

export class PersonaApi implements IPersonaStore {

   private _multiApiHelper: MultiApiHelper<Persona>;

   constructor(serverUrl: string) {

      this._multiApiHelper = new MultiApiHelper<Persona>(serverUrl, EApiUrls.QueryPersonas, new PersonasCodec());
   }

   /**
    * load multiple Persona objects
    * @param ids - an array of ids for the objects to load
    * @returns - an array of constructed object or null if not found.
    */
   async loadMany(ids: Array<string>): Promise<Array<Persona>> {

      return this._multiApiHelper.loadMany(ids);
   }
}
