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

   async load (id: any): Promise<Person | null>  {

      const result = await personModel.findOne().where('_id').eq(id).exec();

      if (result) {
         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._doc._persistenceDetails._id !== result._doc._id)
            result._doc._persistenceDetails._id = result._doc._id;

         return this._codec.tryCreateFrom(result._doc);
      } else {
         return null;
      }
   }

   async save(person: Person): Promise<Person | null> {
      try {
         let result = await (new personModel(person)).save({ isNew: person.persistenceDetails._id ? true : false });

         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._doc._persistenceDetails._id !== result._doc._id)
            result._doc._persistenceDetails._id = result._doc._id;

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
      _id: {
         type: Object,
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
      _name: {
         type: String,
         required: true,
         index: true
      },
      _surname: {
         type: String,
         required: false,
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
