'use strict';
// Copyright TXPCo ltd, 2021
// Implements IMeasurementStore over a web API

import { CohortPresenterCodec } from '../../core/src/IOCohortPresenter';
import { CohortPresenter, ICohortPresenterStoreBySession} from '../../core/src/CohortPresenter';
import { LoadApiHelper } from './ApiHelp';

import { EPresenterApiUrls } from './ApiUrls';


export class CohortPresenterApiFromSession implements ICohortPresenterStoreBySession {
   private _apiHelper: LoadApiHelper<CohortPresenter>;

   constructor(serverUrl: string) {
      this._apiHelper = new LoadApiHelper<CohortPresenter>(serverUrl, EPresenterApiUrls.QueryCohortPresenterFromSession, new CohortPresenterCodec());
   }


   /**
    * load a CohortPresenter
    * @param id - id for the object to load
    * @returns - a constructed object or null if not found. 
    */
   async loadOne(id: string): Promise<CohortPresenter | null> {

      return this._apiHelper.loadOne(id);
   }

}