'use strict';
// Copyright TXPCo ltd, 2021
// Implements IMeasurementStore over a web API

import { CohortsPresenterCodec } from '../../core/src/IOCohortsPresenter';
import { CohortsPresenter, ICohortsPresenterStoreBySession} from '../../core/src/CohortsPresenter';
import { LoadApiHelper } from './ApiHelp';

import { EPresenterApiUrls } from './ApiUrls';


export class CohortsPresenterApiFromSession implements ICohortsPresenterStoreBySession {
   private _apiHelper: LoadApiHelper<CohortsPresenter>;

   constructor(serverUrl: string) {
      this._apiHelper = new LoadApiHelper<CohortsPresenter>(serverUrl, EPresenterApiUrls.QueryCohortsPresenterFromSession, new CohortsPresenterCodec());
   }


   /**
    * load a CohortsPresenter
    * @param id - id for the object to load
    * @returns - a constructed object or null if not found. 
    */
   async loadOne(id: string): Promise<CohortsPresenter | null> {

      return this._apiHelper.loadOne(id);
   }

}