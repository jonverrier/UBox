'use strict';
// Copyright TXPCo ltd, 2021
// Implements IMeasurementStore over a web API

import axios from 'axios';

import { EMeasurementUnitType, MeasurementOf, IMeasurementStore } from '../../core/src/Observation';
import { IdListCodec, IdList } from '../../core/src/IOCommon';
import { WeightMeasurementCodec, MeasurementsCodec, TimeMeasurementCodec} from '../../core/src/IOObservation';
import { WeightUnits, TimeUnits } from "../../core/src/Quantity";

import { EApiUrls } from '../src/ApiUrls';

var root: string = 'http://localhost:4000';

export class MeasurementApi implements IMeasurementStore {
   private _weightCodec: WeightMeasurementCodec;
   private _timeCodec: TimeMeasurementCodec;
   private _saveUrl: string;
   private _queryUrl: string;
   private _queryManyUrl: string;


   constructor(serverUrl: string) {
      this._weightCodec = new WeightMeasurementCodec();
      this._timeCodec = new TimeMeasurementCodec();

      this._saveUrl = serverUrl + EApiUrls.SaveMeasurement;
      this._queryUrl = serverUrl + EApiUrls.QueryMeasurement;
      this._queryManyUrl= serverUrl + EApiUrls.QueryMeasurements;
   }

   /**
    * load a measurement object 
    * @param id - id for the object to load
    * @returns - a constructed object or null if not found. 
    */
   async load(id: any): Promise<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits> | null> {

      var decoded;

      try {
         var etype: EMeasurementUnitType;

         const response = await axios.get(this._queryUrl, { params: { _id: id.toString() } });

         if (response.data.measurementType.unitType === EMeasurementUnitType.Weight) {
            etype = EMeasurementUnitType.Weight;
         }
         else {
            etype = EMeasurementUnitType.Time;
         }

         let created = etype === EMeasurementUnitType.Weight ?
            this._weightCodec.tryCreateFrom(response.data) :
            this._timeCodec.tryCreateFrom(response.data);

         return created;
      }
      catch (e) {
         return null;
      }
   }

   /**
    * load multiple measurement objects
    * @param ids - an array of ids for the objects to load
    * @returns - an array of constructed object or null if not found.
    */
   async loadMany(ids: Array<any>): Promise<Array<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits>>> {

      try {
         let inputCodec = new IdListCodec();

         // Build array query 
         let idList: IdList = new IdList(ids);
         let encoded = inputCodec.encode(idList);

         // ask for a list
         const response = await axios.put(this._queryManyUrl, encoded);

         // reconstruct proper objects & return
         let measurementsCodec = new MeasurementsCodec();
         return measurementsCodec.tryCreateFrom(response.data);

      } catch {
         return null;
      }
   }

   /**
    * save a measurement object
    * @param measurement - the object to save
    * @returns - a copy of what was saved - useful if saving a new object, as the store will assign a new _id
    */
   async save(measurement: MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits>): Promise<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits> | null> {

      var encoded;
      var etype: EMeasurementUnitType;

      if (measurement.measurementType.unitType === EMeasurementUnitType.Weight) {
         encoded = this._weightCodec.encode(measurement);
         etype = EMeasurementUnitType.Weight;
      }
      else {
         encoded = this._timeCodec.encode(measurement);
         etype = EMeasurementUnitType.Time;
      }

      try {
         const response = await axios.put(this._saveUrl, encoded);

         let created = etype === EMeasurementUnitType.Weight ?
            this._weightCodec.tryCreateFrom (response.data) :
            this._timeCodec.tryCreateFrom(response.data);

         return created;

      } catch (e) {
         return null;
      }
   }
}
