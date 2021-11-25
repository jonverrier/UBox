'use strict';
// Copyright TXPCo ltd, 2021
// Implements IMeasurementStore over a web API

import { Cohort, ICohortStore} from '../../core/src/Cohort';
import { CohortCodec } from '../../core/src/IOCohort';
import { SingletonApiHelper } from './ApiHelp';

import { EApiUrls } from './ApiUrls';

export class CohortApi implements ICohortStore {
   private _singletonApiHelper: SingletonApiHelper<Cohort>;

   constructor(serverUrl: string) {

      this._singletonApiHelper = new SingletonApiHelper<Cohort>(serverUrl, EApiUrls.QueryCohort, EApiUrls.SaveCohort, new CohortCodec());
   }

   /**
    * load a Cohort
    * @param id - id for the object to load
    * @returns - a constructed object or null if not found. 
    */
   async loadOne(id: string): Promise<Cohort | null> {

      return this._singletonApiHelper.loadOne(id);
   }

   /**
    * save a Cohort
    * @param cohort - the object to save
    * @returns - a copy of what was saved - useful if saving a new object, as the store will assign a new key
    */
   async save(cohort: Cohort): Promise<Cohort | null> {

      return this._singletonApiHelper.save(cohort);
   }

}
