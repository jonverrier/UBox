'use strict';
// Copyright TXPCo ltd, 2021
// Implements IMeasurementStore over a web API

import { Business, IBusinessStore} from '../../core/src/Business';
import { BusinessCodec } from '../../core/src/IOBusiness';
import { SingletonApiHelper } from './ApiHelp';

import { EApiUrls } from './ApiUrls';

export class BusinessApi implements IBusinessStore {
   private _singletonApiHelper: SingletonApiHelper<Business>;

   constructor(serverUrl: string) {

      this._singletonApiHelper = new SingletonApiHelper<Business>(serverUrl, EApiUrls.QueryBusiness, EApiUrls.SaveBusiness, new BusinessCodec());
   }

   /**
    * load a Business
    * @param id - id for the object to load
    * @returns - a constructed object or null if not found. 
    */
   async loadOne(id: string): Promise<Business | null> {

      return this._singletonApiHelper.loadOne(id);
   }

   /**
    * save a Business
    * @param cohort - the object to save
    * @returns - a copy of what was saved - useful if saving a new object, as the store will assign a new key
    */
   async save(cohort: Business): Promise<Business | null> {

      return this._singletonApiHelper.save(cohort);
   }

}
