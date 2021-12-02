'use strict';
// Copyright TXPCo ltd, 2021
// Implements IMeasurementStore over a web API

import { Cohort, ICohortStore} from '../../core/src/Cohort';
import { CohortCodec, CohortsCodec} from '../../core/src/IOCohort';
import { LoadApiHelper, SaveApiHelper, KeyMultiApiHelper} from './ApiHelp';

import { EApiUrls } from './ApiUrls';

export class CohortApi implements ICohortStore {
   private _loadApiHelper: LoadApiHelper<Cohort>;
   private _saveApiHelper: SaveApiHelper<Cohort>;
   private _multiApiHelper: KeyMultiApiHelper<Cohort>;

   constructor(serverUrl: string) {

      this._loadApiHelper = new LoadApiHelper<Cohort>(serverUrl, EApiUrls.QueryCohort, new CohortCodec());
      this._saveApiHelper = new SaveApiHelper<Cohort>(serverUrl, EApiUrls.SaveCohort, new CohortCodec());
      this._multiApiHelper = new KeyMultiApiHelper<Cohort>(serverUrl, EApiUrls.QueryMyCohorts, new CohortsCodec());
   }

   /**
    * load a Cohort
    * @param id - id for the object to load
    * @returns - a constructed object or null if not found. 
    */
   async loadOne(id: string): Promise<Cohort | null> {

      return this._loadApiHelper.loadOne(id);
   }

   /**
    * save a Cohort
    * @param cohort - the object to save
    * @returns - a copy of what was saved - useful if saving a new object, as the store will assign a new key
    */
   async save(cohort: Cohort): Promise<Cohort | null> {

      return this._saveApiHelper.save(cohort);
   }


   /**
    * load multiple Entity objects
    * @param id - aid for the objects to load
    * @returns - an array of constructed object or null if not found.
    */
   async loadMany(id: string): Promise<Array<Cohort>> {

      return this._multiApiHelper.loadMany(id);
   }

}
