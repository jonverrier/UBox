'use strict';
// Copyright TXPCo ltd, 2021
// Implements IMeasurementStore over a web API

import { Person, IPersonStore} from '../../core/src/Person';
import { PersonCodec, PeopleCodec } from '../../core/src/IOPerson';
import { SingletonApiHelper, MultiApiHelper } from './ApiHelp';

import { EApiUrls } from './ApiUrls';

export class PersonApi implements IPersonStore {
   private _singletonApiHelper: SingletonApiHelper<Person>;
   private _multiApiHelper: MultiApiHelper<Person>;

   constructor(serverUrl: string) {

      this._singletonApiHelper = new SingletonApiHelper<Person>(serverUrl, EApiUrls.QueryPerson, EApiUrls.SavePerson, new PersonCodec());
      this._multiApiHelper = new MultiApiHelper<Person>(serverUrl, EApiUrls.QueryPeople, new PeopleCodec());
   }

   /**
    * load a Person
    * @param id - id for the object to load
    * @returns - a constructed object or null if not found. 
    */
   async loadOne(id: string): Promise<Person | null> {

      return this._singletonApiHelper.loadOne(id);
   }


   /**
    * save a Person
    * @param person - the object to save
    * @returns - a copy of what was saved - useful if saving a new object, as the store will assign a new key
    */
   async save(person: Person): Promise<Person | null> {

      return this._singletonApiHelper.save(person);
   }

   /**
    * load multiple Person objects
    * @param ids - an array of ids for the objects to load
    * @returns - an array of constructed object or null if not found.
    */
   async loadMany(ids: Array<string>): Promise<Array<Person>> {

      return this._multiApiHelper.loadMany(ids);
   }

}
