'use strict';
// Copyright TXPCo ltd, 2021
// Implements IMeasurementStore over a web API

import { Business, IBusinessStore} from '../../core/src/Business';
import { BusinessCodec, BusinessesCodec} from '../../core/src/IOBusiness';
import { LoadApiHelper, SaveApiHelper, KeyMultiApiHelper} from './ApiHelp';

import { EApiUrls } from './ApiUrls';

export class BusinessApi implements IBusinessStore {
   private _loadApiHelper: LoadApiHelper<Business>;
   private _saveApiHelper: SaveApiHelper<Business>;
   private _multiApiHelper: KeyMultiApiHelper<Business>;

   constructor(serverUrl: string) {

      this._loadApiHelper = new LoadApiHelper<Business>(serverUrl, EApiUrls.QueryBusiness, new BusinessCodec());
      this._saveApiHelper = new SaveApiHelper<Business>(serverUrl, EApiUrls.SaveBusiness, new BusinessCodec());
      this._multiApiHelper = new KeyMultiApiHelper<Business>(serverUrl, EApiUrls.QueryMyBusinesses, new BusinessesCodec());
   }

   /**
    * load a Business
    * @param id - id for the object to load
    * @returns - a constructed object or null if not found. 
    */
   async loadOne(id: string): Promise<Business | null> {

      return this._loadApiHelper.loadOne(id);
   }

   /**
    * save a Business
    * @param cohort - the object to save
    * @returns - a copy of what was saved - useful if saving a new object, as the store will assign a new key
    */
   async save(cohort: Business): Promise<Business | null> {

      return this._saveApiHelper.save(cohort);
   }


   /**
    * load multiple Entity objects
    * @param id - aid for the objects to load
    * @returns - an array of constructed object or null if not found.
    */
   async loadMany(id: string): Promise<Array<Business>> {

      return this._multiApiHelper.loadMany(id);
   }
}
