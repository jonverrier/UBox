'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";
import { Logger } from '../../core/src/Logger';
import { ECohortType, Cohort, IBusinessStore } from '../../core/src/Cohort';
import { Person, PersonMemento } from '../../core/src/Person';
import { Business } from '../../core/src/Business';
import { CohortCodec } from '../../core/src/IOCohort';
import { PersonDb } from './PersonDb';
import { BusinessDb } from './BusinessDb';

export class CohortDb implements IBusinessStore {
   private _codec;

   constructor() {
      this._codec = new CohortCodec();;
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

         // Switch members & business from Ids to objects by loading them up 
         let memberIds = this.makeIdArray(result._doc._memberIds);

         // TODO - should be able to run these in parallel and then chain them. Does not seem to work per below ... 
         let members = await personDb.loadMany(memberIds);
         let business = await businessDb.loadOne(result._doc._businessId);

         /* members.then(data => {
            result._doc._members = data ? data : new Array<Person>();
            return members;
         })
         .then(data => {
            result._doc.business = data;
            return this._codec.tryCreateFrom(result._doc);
         }); */

         result._doc._business = business;
         result._doc._members = members ? members : new Array<Person>();

         return this._codec.tryCreateFrom(result._doc);

      } else {
         return null;
      }
   }

   async save(cohort: Cohort): Promise<Cohort | null> {
      try {

         var prevBusiness:Business = cohort.business;
         var prevMembers: Array<Person> = cohort.members;

         var businessDb: BusinessDb = new BusinessDb();
         var personDb: PersonDb = new PersonDb();

         // if the embedded Business not have valid key, save them
         if (!prevBusiness.persistenceDetails.hasValidKey()) {
            prevBusiness = await businessDb.save(prevBusiness);
         }

         // For any Members that do not have valid key, save them
         for (var i = 0; i < prevMembers.length; i++) {
            if (!prevMembers[i].persistenceDetails.hasValidKey()) {
               prevMembers[i] = await personDb.save(prevMembers[i]);
            }
         }

         // Before saving to DB, we convert object references to Ids, save the Ids on the memento, and remove object references from the Cohort.
         // We do the reverse on load.
         let memento = cohort.memento();

         memento._businessId = this.makeId(prevBusiness);
         memento._memberIds = this.makePersonIds(prevMembers);
         memento._members = new Array<PersonMemento>();

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
               existing._doc._members = prevMembers;

               // Return a constructed object via codec 
               return this._codec.tryCreateFrom(existing._doc);
            }
         }

         let result = await (new cohortModel(memento)).save({ isNew: cohort.persistenceDetails.key ? true : false });

         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._doc._persistenceDetails._key !== result._doc._id.toString())
            result._doc._persistenceDetails._key = result._doc._id.toString();

         // Restore the object arrays before sending back to client
         result._doc._business = prevBusiness;
         result._doc._members = prevMembers;

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
   _memberIds: {
      type: [String],
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
