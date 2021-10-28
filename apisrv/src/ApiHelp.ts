'use strict';
// Copyright TXPCo ltd, 2021
// Implements IMeasurementStore over a web API

import axios from 'axios';

import { Logger } from '../../core/src/Logger';
import { IdListCodec, IdList, ICodec} from '../../core/src/IOCommon';

const getCircularReplacer = () => {
   const seen = new WeakSet();
   return (key, value) => {
      if (typeof value === "object" && value !== null) {
         if (seen.has(value)) {
            return;
         }
         seen.add(value);
      }
      return value;
   };
};

export class SingletonApiHelper<Entity> {
   private _codec: ICodec<Entity>;
   private _saveUrl: string;
   private _queryUrl: string;
   private _queryManyUrl: string;


   constructor(serverUrl: string, loadUrl:string, saveUrl:string, codec: ICodec<Entity>, ) {
      this._codec = codec;

      this._saveUrl = serverUrl + saveUrl;
      this._queryUrl = serverUrl + loadUrl;
   }

   /**
    * load a Entity
    * @param id - id for the object to load
    * @returns - a constructed object or null if not found. 
    */
   async loadOne(id: string): Promise<Entity | null> {

      var response;

      try {
         response = await axios.get(this._queryUrl, { params: { _key: id } });

         return this._codec.tryCreateFrom(response.data);
      } catch (e) {
         console.log("LoadOne:\n" + JSON.stringify(response, getCircularReplacer));
         throw (e);
      }
   }


   /**
    * save a Entity
    * @param entity - the object to save
    * @returns - a copy of what was saved - useful if saving a new object, as the store will assign a new key
    */
   async save(entity: Entity): Promise<Entity | null> {

      var encoded = this._codec.encode(entity);
      var response;

      try {
         response = await axios.put(this._saveUrl, encoded);
         return this._codec.tryCreateFrom(response.data);
      } catch (e) {
         console.log("save:\n" + JSON.stringify(response, getCircularReplacer));
         throw (e);
      }
   }
}

export class MultiApiHelper<Entity> {
   private _codec: ICodec<Array<Entity>>;
   private _queryManyUrl: string;


   constructor(serverUrl: string, queryManyUrl: string, codec: ICodec<Array<Entity>>,) {
      this._codec = codec;

      this._queryManyUrl = serverUrl + queryManyUrl;
   }


   /**
    * load multiple Entity objects
    * @param ids - an array of ids for the objects to load
    * @returns - an array of constructed object or null if not found.
    */
   async loadMany(ids: Array<string>): Promise<Array<Entity>> {

      let inputCodec = new IdListCodec();

      // Build array query 
      let idList: IdList = new IdList(ids);
      let encoded = inputCodec.encode(idList);

      // ask for a list
      const response = await axios.put(this._queryManyUrl, encoded);

      // reconstruct proper objects & return
      return this._codec.tryCreateFrom(response.data);
   }
}