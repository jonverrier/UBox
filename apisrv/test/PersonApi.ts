'use strict';
// Copyright TXPCo ltd, 2021
// Implements IMeasurementStore over a web API

import axios from 'axios';

import { Logger } from '../../core/src/Logger';
import { Person, IPersonStore} from '../../core/src/Person';
import { IdListCodec, IdList } from '../../core/src/IOCommon';
import { PersonCodec, PeopleCodec } from '../../core/src/IOPerson';

import { EApiUrls } from '../src/ApiUrls';

export class PersonApi implements IPersonStore {
   private _personCodec: PersonCodec;
   private _peopleCodec: PeopleCodec;
   private _saveUrl: string;
   private _queryUrl: string;
   private _queryManyUrl: string;


   constructor(serverUrl: string) {
      this._personCodec = new PersonCodec();
      this._peopleCodec = new PeopleCodec();

      this._saveUrl = serverUrl + EApiUrls.SavePerson;
      this._queryUrl = serverUrl + EApiUrls.QueryPerson;
      this._queryManyUrl = serverUrl + EApiUrls.QueryPeople;
   }

   /**
    * load a Person
    * @param id - id for the object to load
    * @returns - a constructed object or null if not found. 
    */
   async loadOne(id: string): Promise<Person | null> {

      var decoded;

      try {

         const response = await axios.get(this._queryUrl, { params: { _key: id.toString() } });

         return this._personCodec.tryCreateFrom(response.data);
      }
      catch (e) {
         let logger: Logger = new Logger();
         logger.logError("PersonApi", "loadOne", "Error:", e);
         return null;
      }
   }

   /**
    * load multiple Person objects
    * @param ids - an array of ids for the objects to load
    * @returns - an array of constructed object or null if not found.
    */
   async loadMany(ids: Array<string>): Promise<Array<Person>> {

      try {
         let inputCodec = new IdListCodec();

         // Build array query 
         let idList: IdList = new IdList(ids);
         let encoded = inputCodec.encode(idList);

         // ask for a list
         const response = await axios.put(this._queryManyUrl, encoded);

         // reconstruct proper objects & return
         return this._peopleCodec.tryCreateFrom(response.data);

      } catch (e) {
         let logger: Logger = new Logger();
         logger.logError("MeasurementApi", "loadMany", "Error:", e);
         return null;
      }
   }

   /**
    * save a Person
    * @param person - the object to save
    * @returns - a copy of what was saved - useful if saving a new object, as the store will assign a new key
    */
   async save(person: Person): Promise<Person | null> {

      var encoded = this._personCodec.encode(person);

      try {
         const response = await axios.put(this._saveUrl, encoded);

         return this._personCodec.tryCreateFrom(response.data);

      } catch (e) {
         let logger: Logger = new Logger();
         logger.logError("PersonApi", "save", "Error:", e);
         return null;
      }
   }
}
