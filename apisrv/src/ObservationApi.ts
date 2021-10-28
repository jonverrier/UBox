'use strict';
// Copyright TXPCo ltd, 2021
// Implements IMeasurementStore over a web API

import axios from 'axios';

import { Logger } from '../../core/src/Logger';
import { Measurement, IMeasurementStore } from '../../core/src/Observation';
import { IdListCodec, IdList } from '../../core/src/IOCommon';
import { MeasurementCodec, MeasurementsCodec} from '../../core/src/IOObservation';
import { SingletonApiHelper, MultiApiHelper } from './ApiHelp';

import { EApiUrls } from './ApiUrls';

export class MeasurementApi implements IMeasurementStore {
   private _singletonApiHelper: SingletonApiHelper<Measurement>;
   private _multiApiHelper: MultiApiHelper<Measurement>;
   private _multiApiHelper2: MultiApiHelper<Measurement>;

   constructor(serverUrl: string) {

      this._singletonApiHelper = new SingletonApiHelper<Measurement>(serverUrl, EApiUrls.QueryMeasurement, EApiUrls.SaveMeasurement, new MeasurementCodec());
      this._multiApiHelper = new MultiApiHelper<Measurement>(serverUrl, EApiUrls.QueryMeasurements, new MeasurementsCodec());
      this._multiApiHelper2 = new MultiApiHelper<Measurement>(serverUrl, EApiUrls.QueryMeasurementsForPeople, new MeasurementsCodec());
   }

   /**
    * load a measurement object 
    * @param id - id for the object to load
    * @returns - a constructed object or null if not found. 
    */
   async loadOne (id: any): Promise<Measurement | null> {

      return this._singletonApiHelper.loadOne(id);
   }

   /**
    * save a measurement object
    * @param measurement - the object to save
    * @returns - a copy of what was saved - useful if saving a new object, as the store will assign a new key
    */
   async save(measurement: Measurement): Promise<Measurement | null> {

      return this._singletonApiHelper.save(measurement);
   }

   /**
    * load multiple measurement objects
    * @param ids - an array of ids for the objects to load
    * @returns - an array of constructed object or null if not found.
    */
   async loadMany(ids: Array<any>): Promise<Array<Measurement>> {

      return this._multiApiHelper.loadMany(ids);
   }

   /**
    * load multiple measurement objects
    * @param ids - an array of ids of the subjects for the objects to load
    * @returns - an array of constructed object or null if not found.
    */
   async loadManyForPeople(ids: Array<string>): Promise<Array<Measurement>> {

      return this._multiApiHelper2.loadMany(ids);
   }

}
