'use strict';
// Copyright TXPCo ltd, 2021
// Implements IMeasurementStore over a web API

import axios from 'axios';

import { InvalidServerResponseError } from '../../core/src/CoreError'
import { IdListCodec, IdList, ICodec} from '../../core/src/IOCommon';

export class LoadApiHelper<Entity> {
   private _codec: ICodec<Entity>;
   private _queryUrl: string;


   constructor(serverUrl: string, loadUrl:string, codec: ICodec<Entity>) {
      this._codec = codec;
      this._queryUrl = serverUrl + loadUrl;
   }

   /**
    * load an Entity
    * @param id - id for the object to load
    * @returns - a constructed object or null if not found. 
    */
   async loadOne(id: string): Promise<Entity | null> {

      var response;

      response = await axios.get(this._queryUrl, { params: { _key: id } });
      if (response.data)
         return this._codec.tryCreateFrom(response.data);
      else
         throw new InvalidServerResponseError();
   }
}

export class SaveApiHelper<Entity> {
   private _codec: ICodec<Entity>;
   private _saveUrl: string;


   constructor(serverUrl: string, saveUrl: string, codec: ICodec<Entity>,) {
      this._codec = codec;

      this._saveUrl = serverUrl + saveUrl;
   }

   /**
    * save an Entity
    * @param entity - the object to save
    * @returns - a copy of what was saved - useful if saving a new object, as the store will assign a new key
    */
   async save(entity: Entity): Promise<Entity | null> {

      var encoded = this._codec.encode(entity);
      var response;

      response = await axios.put(this._saveUrl, encoded);
      if (response.data)
         return this._codec.tryCreateFrom(response.data);
      else
         throw new InvalidServerResponseError();
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
    * @param id - an array of ids for the objects to load
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
      if (response.data)
         return this._codec.tryCreateFrom(response.data);
      else
         throw new InvalidServerResponseError();
   }
}

export class KeyMultiApiHelper<Entity> {
   private _codec: ICodec<Array<Entity>>;
   private _queryManyUrl: string;


   constructor(serverUrl: string, queryManyUrl: string, codec: ICodec<Array<Entity>>,) {
      this._codec = codec;

      this._queryManyUrl = serverUrl + queryManyUrl;
   }


   /**
    * load multiple Entity objects
    * @param id - aid for the objects to load
    * @returns - an array of constructed object or null if not found.
    */
   async loadMany(id: string): Promise<Array<Entity>> {

      // ask for a list
      const response = await axios.put(this._queryManyUrl, { key: id });

      // reconstruct proper objects & return
      if (response.data)
         return this._codec.tryCreateFrom(response.data);
      else
         throw new InvalidServerResponseError();
   }
}

