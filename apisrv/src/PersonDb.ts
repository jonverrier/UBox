'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";
import { Logger } from '../../core/src/Logger';
import { Person, IPersonStore, IMyPersonStore } from '../../core/src/Person';
import { ICodec } from '../../core/src/IOCommon';
import { PersonCodec } from '../../core/src/IOPerson';
import { persistenceDetailsSchema } from './PersistenceDb';
import { personaDetailsSchema } from './PersonaDb';

class StoreImplFor<T> {
   private _codec;

   constructor(codec: ICodec<T>) {
      this._codec = codec;
   }

   async loadOne(id: string): Promise<T | null> {

      const result = await personModel.findOne().where('_id').eq(id).exec();

      if (result) {
         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._doc._persistenceDetails._key !== result._doc._id.toString())
            result._doc._persistenceDetails._key = result._doc._id.toString();

         return this._codec.tryCreateFrom(result._doc);
      } else {
         return null;
      }
   }

   async loadOneFromEmail (email: string): Promise<T | null> {

      const result = await personModel.findOne().where('_email._email').eq(email).exec();

      if (result) {
         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._doc._persistenceDetails._key !== result._doc._id.toString())
            result._doc._persistenceDetails._key = result._doc._id.toString();

         return this._codec.tryCreateFrom(result._doc);
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
            // If we saved a new document, copy the new Mongo ID up to persistenceDetails
            if (result[i]._doc._persistenceDetails._key !== result[i]._doc._id.toString())
               result[i]._doc._persistenceDetails._key = result[i]._doc._id.toString();

            people.push(this._codec.tryCreateFrom(result[i]._doc));
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
         if (! person.persistenceDetails.hasValidKey()) {
            // If the record has not already been saved, look to see if we have an existing record for same email
            const existing = await personModel.findOne().where('_email._email').eq(person.email.email).exec();

            // if the saved version has a later or equal sequence number, do not overwrite it
            if (existing && existing._doc._persistenceDetails._sequenceNumber >= person.persistenceDetails.sequenceNumber) {

               // If we have an existing document, copy the new Mongo ID to persistenceDetails
               if (existing._doc._persistenceDetails._key !== existing._doc._id.toString())
                  existing._doc._persistenceDetails._key = existing._doc._id.toString();

               return this._personCodec.tryCreateFrom(existing._doc);
            }
         }

         // only save if we are a later sequence number 
         let result = await (new personModel(this._personCodec.encode(person))).save ({ isNew: person.persistenceDetails.key ? true : false });

         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._doc._persistenceDetails._key !== result._doc._id.toString())
            result._doc._persistenceDetails._key = result._doc._id.toString();

         return this._personCodec.tryCreateFrom(result._doc);
      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("PersonDb", "save", "Error:", err);
         return null;
      }

   }
}

export class MyPersonDb implements IMyPersonStore {
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

const personSchema = new mongoose.Schema({
   _persistenceDetails: persistenceDetailsSchema,
   _personaDetails: personaDetailsSchema,
   _email: {
      _email: {
         type: String,
         required: false,
         index: true
      },
      _isEmailVerified: {
         type: Boolean,
         required: false
      }
   },
   _roles: {
      _roles: {
         type: [String],
         enum: ["Prospect", "Member", "Coach"],
         required: true
      }
   }
},
{  // Enable timestamps for archival 
      timestamps: true
});

const personModel = mongoose.model("Person", personSchema);
