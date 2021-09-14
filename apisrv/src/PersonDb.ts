'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";
import { Logger } from '../../core/src/Logger';
import { Person, IPersonStore } from '../../core/src/Person';
import { PersonCodec } from '../../core/src/IOPerson';


export class PersonDb implements IPersonStore {
   private _codec;

   constructor() {
      this._codec = new PersonCodec();;
   }

   async loadOne(id: string): Promise<Person | null>  {

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

   async loadMany(ids: Array<string>): Promise<Array<Person>> {

      const result = await personModel.find().where('_id').in(ids).exec();

      if (result && result.length > 0) {
         var i: number;
         var people: Array<Person> = new Array<Person>();

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

   async save(person: Person): Promise<Person | null> {
      try {
         if (! person.persistenceDetails.hasValidKey()) {
            // If the record has not already been saved, look to see if we have an existing record for same email
            const existing = await personModel.findOne().where('_email._email').eq(person.email.email).exec();

            // if the saved version has a later or equal sequence number, do not overwrite it
            if (existing && existing._doc._persistenceDetails._sequenceNumber >= person.persistenceDetails.sequenceNumber) {

               // If we saved a new document, copy the new Mongo ID to persistenceDetails
               if (existing._doc._persistenceDetails._key !== existing._doc._id.toString())
                  existing._doc._persistenceDetails._key = existing._doc._id.toString();

               return this._codec.tryCreateFrom(existing._doc);
            }
         }
         // only save if we are a later sequence number 
         let result = await (new personModel(person)).save({ isNew: person.persistenceDetails._id ? true : false });

         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._doc._persistenceDetails._key !== result._doc._id.toString())
            result._doc._persistenceDetails._key = result._doc._id.toString();

         return this._codec.tryCreateFrom(result._doc);
      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("PersonDb", "save", "Error:", err);
         return null;
      }

   }
}

const personSchema = new mongoose.Schema({
   _persistenceDetails: {
      _key: {
         type: String,
         required: false
      },
      _schemaVersion: {
         type: Number,
         required: true
      },
      _sequenceNumber: {
         type: Number,
         required: true
      }
   },
   _loginDetails: {
      _provider: {
         type: String,
         enum: ["Apple", "Google", "Private"],
         required: true
      },
      _token: {
         type: String,
         required: true,
         index: true
      }
   },
   _name: {
      _displayName: {
         type: String,
         required: true,
         index: true
      }
   },
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
   _thumbnailUrl: {
      _url: {
         type: String,
         required: false
      },
      _isUrlVerified: {
         type: Boolean,
         required: false
      }
   },
   roles: {
      type: [String],
      enum: ["Prospect", "Member", "Coach"],
      required: false
   }
},
{  // Enable timestamps for archival 
      timestamps: true
});

const personModel = mongoose.model("Person", personSchema);
