'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";
import { Logger } from '../../core/src/Logger';
import { Person, PersonMemento } from '../../core/src/Person';
import { Business, IBusinessStore } from '../../core/src/Business';
import { BusinessCodec } from '../../core/src/IOBusiness';
import { PersonDb } from './PersonDb';


export class BusinessDb implements IBusinessStore {
   private _codec;

   constructor() {
      this._codec = new BusinessCodec();;
   }

   private makeIdArray(input: Array<any>) : Array<string> {
      var output: Array<string> = new Array<string>(input.length);

      for (var i = 0; i < input.length; i++) {
         output[i] = input[i].toString();
      }
      return output;
   }

   private makePersonIds(people: Array<Person>): Array<string> {
      var ids: Array<string> = new Array<string>();
      var i: number;

      for (i = 0; i < people.length; i++) {
         ids.push(people[i].persistenceDetails.key);
      }
      return ids;

   }

   async loadOne(id: string): Promise<Business | null>  {

      const result = await businessModel.findOne().where('_id').eq(id).exec();

      if (result) {
         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._doc._persistenceDetails._key !== result._doc._id.toString())
            result._doc._persistenceDetails._key = result._doc._id.toString();

         var personDb: PersonDb = new PersonDb();

         // Switch adminstrators from an array of Ids to an array of objects by loading them up 
         let adminIds = this.makeIdArray(result._doc._administratorIds);
         let admins = await personDb.loadMany(adminIds);
         result._doc._administrators = admins ? admins : new Array<Person>();

         return this._codec.tryCreateFrom(result._doc);

      } else {
         return null;
      }
   }

   async save(business: Business): Promise<Business | null> {
      try {
         var prevAdmins: Array<Person> = business.administrators;

         var personDb: PersonDb = new PersonDb();

         // For any Admins that do not have valid key, save them
         for (var i = 0; i < prevAdmins.length; i++) {
            if (!prevAdmins[i].persistenceDetails.hasValidKey()) {
               prevAdmins[i] = await personDb.save(prevAdmins[i]);
            }
         }

         // Before saving to DB, we convert object references to Ids, save the Ids on the memento, and remove object references from the Cohort.
         // We do the reverse on load.
         let memento = business.memento();

         memento._administratorIds = this.makePersonIds(prevAdmins);
         memento._administrators = new Array<PersonMemento>();

         if (!business.persistenceDetails.hasValidKey()) {
            // If the record has not already been saved, look to see if we have an existing record that is otherwise the same
            // Records are the same if they are: 
            //    same name 
            var whereClause = {
               '_name._displayName': business.name.displayName
            };

            const existing = await businessModel.findOne(whereClause).exec();

            // if the saved version has a later or equal sequence number, do not overwrite it, just return the existing one
            if (existing && existing._doc._persistenceDetails._sequenceNumber >= business.persistenceDetails.sequenceNumber) {

               // If we have an existing document, copy the Mongo ID to persistenceDetails
               if (existing._doc._persistenceDetails._key !== existing._doc._id.toString())
                  existing._doc._persistenceDetails._key = existing._doc._id.toString();

               // Restore the object arrays before sending back to client
               existing._doc._administrators = prevAdmins;

               // Return a constructed object via codec 
               return this._codec.tryCreateFrom(existing._doc);
            }
         }

         let result = await (new businessModel(memento)).save({ isNew: business.persistenceDetails.key ? true : false });

         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._doc._persistenceDetails._key !== result._doc._id.toString())
            result._doc._persistenceDetails._key = result._doc._id.toString();

         // Restore the object arrays before sending back to client
         result._doc._administrators = prevAdmins;

         return this._codec.tryCreateFrom(result._doc);
      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("BusinessDb", "save", "Error:", err);
         return null;
      }

   }
}

const businessSchema = new mongoose.Schema({
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
   _name: {
      _displayName: {
         type: String,
         required: true
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
   _administratorIds: {
      type: [String],
      required: true
   }
},
{  // Enable timestamps for archival 
      timestamps: true
});

const businessModel = mongoose.model("Business", businessSchema);
