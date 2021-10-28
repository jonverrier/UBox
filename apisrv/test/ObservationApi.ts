'use strict';
// Copyright TXPCo ltd, 2021
// Implements IMeasurementStore over a web API

import axios from 'axios';

import { Logger } from '../../core/src/Logger';
import { EBaseUnitDimension } from '../../core/src/Unit';
import { MeasurementTypes } from '../../core/src/ObservationTypeDictionary';
import { Measurement, IMeasurementStore } from '../../core/src/Observation';
import { IdListCodec, IdList } from '../../core/src/IOCommon';
import { MeasurementCodec, MeasurementsCodec} from '../../core/src/IOObservation';

import { EApiUrls } from '../src/ApiUrls';

export class MeasurementApi implements IMeasurementStore {
   private _codec: MeasurementCodec;
   private _saveUrl: string;
   private _queryUrl: string;
   private _queryManyUrl: string;
   private _queryManyForPeopleUrl: string;


   constructor(serverUrl: string) {
      this._codec = new MeasurementCodec();

      this._saveUrl = serverUrl + EApiUrls.SaveMeasurement;
      this._queryUrl = serverUrl + EApiUrls.QueryMeasurement;
      this._queryManyUrl = serverUrl + EApiUrls.QueryMeasurements;
      this._queryManyForPeopleUrl = serverUrl + EApiUrls.QueryMeasurementsForPeople;
   }

   /**
    * load a measurement object 
    * @param id - id for the object to load
    * @returns - a constructed object or null if not found. 
    */
   async loadOne (id: any): Promise<Measurement | null> {

      var decoded;
      var response;

      try {
         var etype: EBaseUnitDimension;

         response = await axios.get(this._queryUrl, { params: { _key: id.toString() } });

         this._codec.tryCreateFrom(response.data);
      }
      catch (e) {
         let logger: Logger = new Logger();
         logger.logError("MeasurementApi", "load", "Error:", e.toString());
         return null;
      }
   }

   /**
    * load multiple measurement objects
    * @param ids - an array of ids for the objects to load
    * @returns - an array of constructed object or null if not found.
    */
   async loadMany(ids: Array<any>): Promise<Array<Measurement>> {

      var response;

      try {
         let inputCodec = new IdListCodec();

         // Build array query 
         let idList: IdList = new IdList(ids);
         let encoded = inputCodec.encode(idList);

         // ask for a list
         response = await axios.put(this._queryManyUrl, encoded);

         // reconstruct proper objects & return
         let measurementsCodec = new MeasurementsCodec();
         return measurementsCodec.tryCreateFrom(response.data);

      } catch (e) {
         let logger: Logger = new Logger();
         logger.logError("MeasurementApi", "loadMany", "Error:", e.toString() );
         return null;
      }
   }

   async loadManyForPeople(ids: Array<string>): Promise<Array<Measurement>> {

      try {
         let inputCodec = new IdListCodec();

         // Build array query 
         let idList: IdList = new IdList(ids);
         let encoded = inputCodec.encode(idList);

         // ask for a list
         const response = await axios.put(this._queryManyForPeopleUrl, encoded);

         // reconstruct proper objects & return
         let measurementsCodec = new MeasurementsCodec();
         return measurementsCodec.tryCreateFrom(response.data);

      } catch (e) {
         let logger: Logger = new Logger();
         logger.logError("MeasurementApi", "loadManyForPeople", "Error:", e);
         return null;
      }
   }

   /**
    * save a measurement object
    * @param measurement - the object to save
    * @returns - a copy of what was saved - useful if saving a new object, as the store will assign a new key
    */
   async save(measurement: Measurement): Promise<Measurement | null> {

      var encoded;

      encoded = this._codec.encode(measurement);


      try {
         const response = await axios.put(this._saveUrl, encoded);

         return this._codec.tryCreateFrom(response.data);

      } catch (e) {
         let logger: Logger = new Logger();
         logger.logError("MeasurementApi", "save", "Error:", e);
         return null;
      }
   }
}
