'use strict';
// Copyright TXPCo ltd, 2020, 2021

import { Logger } from '../../core/src/Logger';
import { PersistenceDetails } from '../../core/src/Persistence';
import { Person, PersonMemento, IPersonStore, IPersonStoreByEmail, IPersonStoreByExternalId} from '../../core/src/Person';
import { ICodec } from '../../core/src/IOCommon';
import { PersonCodec } from '../../core/src/IOPerson';
import { personModel } from './PersonSchema';

var ObjectID = require("mongodb").ObjectID;

class StoreImplFor<T> {
   private _codec;

   constructor(codec: ICodec<T>) {
      this._codec = codec;
   }

   async loadOne(id: string): Promise<T | null> {

      if (!ObjectID.isValid(id))
         return null;

      const result = await personModel.findOne().where('_id').eq(id).exec();

      if (result && result._doc) {
         var doc = result.toObject({ transform: true });

         return this._codec.tryCreateFrom(doc);
      } else {
         return null;
      }
   }

   async loadOneFromEmail (email: string): Promise<T | null> {

      const result = await personModel.findOne().where('_email').eq(email).exec();

      if (result) {
         var doc = result.toObject({ transform: true });

         return this._codec.tryCreateFrom(doc);
      } else {
         return null;
      }
   }

   async loadOneFromExternalId(externalId: string): Promise<T | null> {

      const result = await personModel.findOne().where('_loginContext._externalId').eq(externalId).exec();

      if (result) {
         var doc = result.toObject({ transform: true });

         return this._codec.tryCreateFrom(doc);
      } else {
         return null;
      }
   }

   async loadMany (ids: Array<string>): Promise<Array<T>> {

      const result = await personModel.find().where('_id').in(ids).exec();

      if (result && result.length > 0) {
         var i: number;
         var people: Array<T> = new Array<T>();

         for (i = 0; i < result.length; i++) {

            var doc = result[i].toObject({ transform: true });

            people.push(this._codec.tryCreateFrom(doc));
         }

         return people;
      } else {
         return null;
      }
   }
}

export class PersonDb implements IPersonStore {
   private _personCodec: PersonCodec;
   private _personStore: StoreImplFor<Person>;

   constructor() {
      this._personCodec = new PersonCodec();
      this._personStore = new StoreImplFor<Person>(this._personCodec);
   }

   loadOne(id: string): Promise<Person | null>  {

      return this._personStore.loadOne(id);
   }

   loadMany(ids: Array<string>): Promise<Array<Person>> {

      return this._personStore.loadMany(ids);
   }

   async save(person: Person): Promise<Person | null> {
      try {
         // Look to see if we have an existing record for same email
         const existing = await personModel.findOne().where('_email').eq(person.email).exec();

         // if the saved version has same email & later or equal sequence number, do not overwrite it
         if (existing &&
            existing._persistenceDetails._sequenceNumber >= person.persistenceDetails.sequenceNumber) {

            var docPost = existing.toObject({ transform: true });

            return this._personCodec.tryCreateFrom(docPost);
         }

         var result;
         let encoded:PersonMemento = this._personCodec.encode(person);

         if (existing) {
            // Copy across fields to update (excl email), with incremented sequence number
            existing._persistenceDetails = PersistenceDetails.incrementSequenceNo(
               new PersistenceDetails(existing._persistenceDetails._key,
                  existing._persistenceDetails._schemaVersion,
                  existing._persistenceDetails._sequenceNumber));
            existing._personaDetails = encoded._personaDetails;
            existing._loginContext = encoded._loginContext;
            existing._roles = encoded._roles;
            result = await (existing.save({ isNew: false }));
         }
         else {
            let doc = new personModel(encoded);
            // Set schema version if it is currently clear
            if (doc._persistenceDetails._schemaVersion === PersistenceDetails.newSchemaIndicator())
               doc._persistenceDetails._schemaVersion = 0;
            result = await (doc.save({ isNew: true }));
         }

         var docPost = result.toObject({ transform: true });
         return this._personCodec.tryCreateFrom(docPost);

      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("PersonDb", "save", "Error:", err);
         return null;
      }

   }
}

export class PersonByEmailDb implements IPersonStoreByEmail {
   private _personCodec: PersonCodec;
   private _personStore: StoreImplFor<Person>;

   constructor() {
      this._personCodec = new PersonCodec();
      this._personStore = new StoreImplFor<Person>(this._personCodec);
   }

   loadOne(email: string): Promise<Person | null> {

      return this._personStore.loadOneFromEmail(email);
   }
}

export class PersonByExternalIdDb implements IPersonStoreByExternalId {
   private _personCodec: PersonCodec;
   private _personStore: StoreImplFor<Person>;

   constructor() {
      this._personCodec = new PersonCodec();
      this._personStore = new StoreImplFor<Person>(this._personCodec);
   }

   loadOne(externalId: string): Promise<Person | null> {

      return this._personStore.loadOneFromExternalId(externalId);
   }
}