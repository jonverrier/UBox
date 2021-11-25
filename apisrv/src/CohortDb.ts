'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";
import { Logger } from '../../core/src/Logger';
import { ECohortType, Cohort, ICohortStore } from '../../core/src/Cohort';
import { Person, PersonMemento } from '../../core/src/Person';
import { Business } from '../../core/src/Business';
import { CohortCodec } from '../../core/src/IOCohort';
import { PersonDb } from './PersonDb';
import { BusinessDb } from './BusinessDb';

export class CohortDb implements ICohortStore {
   private _codec;

   constructor() {
      this._codec = new CohortCodec();;
   }


   private makeId(business: Business): string {

      return business.persistenceDetails.key;
   }

   async loadOne (id: string): Promise<Cohort | null>  {

      const result = await cohortModel.findOne().where('_id').eq(id).exec();

      if (result) {
         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._doc._persistenceDetails._key !== result._doc._id.toString())
            result._doc._persistenceDetails._key = result._doc._id.toString();

         var businessDb: BusinessDb = new BusinessDb();
         var personDb: PersonDb = new PersonDb();

         let business = await businessDb.loadOne(result._doc._businessId);

         result._doc._business = business;

         return this._codec.tryCreateFrom(result._doc);

      } else {
         return null;
      }
   }

   async save(cohort: Cohort): Promise<Cohort | null> {
      try {

         var prevBusiness:Business = cohort.business;

         var businessDb: BusinessDb = new BusinessDb();
         var personDb: PersonDb = new PersonDb();

         // if the embedded Business not have valid key, save them
         if (!prevBusiness.persistenceDetails.hasValidKey()) {
            prevBusiness = await businessDb.save(prevBusiness);
         }

         // Before saving to DB, we convert object references to Ids, save the Ids on the memento, and remove object references from the Cohort.
         // We do the reverse on load.
         let memento = cohort.memento();

         memento._businessId = this.makeId(prevBusiness);

         if (!cohort.persistenceDetails.hasValidKey()) {
            // If the record has not already been saved, look to see if we have an existing record that is otherwise the same
            // Records are the same if they are: 
            // same business, same name, same cohortType
            var whereClause = {
               '_businessId': memento._business._persistenceDetails._key,
               '_name._displayName': memento._name._displayName,
               '_cohortType': memento._cohortType
            };

            const existing = await cohortModel.findOne(whereClause).exec();

            // if the saved version has a later or equal sequence number, do not overwrite it, just return the existing one
            if (existing && existing._doc._persistenceDetails._sequenceNumber >= cohort.persistenceDetails.sequenceNumber) {

               // If we have an existing document, copy the Mongo ID to persistenceDetails
               if (existing._doc._persistenceDetails._key !== existing._doc._id.toString())
                  existing._doc._persistenceDetails._key = existing._doc._id.toString();

               // Restore the object arrays before sending back to client
               existing._doc._business = prevBusiness;

               // Return a constructed object via codec 
               return this._codec.tryCreateFrom(existing._doc);
            }
         }

         let doc = new cohortModel(memento);
         let result = await doc.save({ isNew: cohort.persistenceDetails.key ? true : false });

         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._doc._persistenceDetails._key !== result._doc._id.toString())
            result._doc._persistenceDetails._key = result._doc._id.toString();

         // Restore the object arrays before sending back to client
         result._doc._business = prevBusiness;

         return this._codec.tryCreateFrom(result._doc);
      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("CohortDb", "save", "Error:", err);
         return null;
      }

   }
}

const cohortTypes: Array<string> = (Object.values(ECohortType));

const cohortSchema = new mongoose.Schema({
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
   _period: {
      _startDate: {
         type: Date,
         required: true
      },
      _period: {
         type: String,
         enum: ["One Week",  "Two Weeks",  "Three Weeks", "Four Weeks", "One Month"],
         required: true
      },
      _numberOfPeriods: {
         type: Number,
         required: true
      }
   },
   _businessId: {
      type: String,
      required: true
   },
   _cohortType: {
      type: String,
      enum: cohortTypes,
      required: true
   }
},
{  // Enable timestamps for archival 
      timestamps: true
});

const cohortModel = mongoose.model("Cohort", cohortSchema);
