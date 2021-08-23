'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";
import { Logger } from '../../core/src/Logger';
import { Cohort, ICohortStore } from '../../core/src/Cohort';
import { Person, PersonMemento } from '../../core/src/Person';
import { CohortCodec } from '../../core/src/IOCohort';
import { PersonDb } from './PersonDb';
import { measurementTypeSchema } from './ObservationDb';


export class CohortDb implements ICohortStore {
   private _codec;

   constructor() {
      this._codec = new CohortCodec();;
   }

   private makePersonIds(people: Array<Person>): Array<string> {
      var ids: Array<string> = new Array<string>();
      var i: number;

      for (i = 0; i < people.length; i++) {
         ids.push(people[i].persistenceDetails.id);
      }
      return ids;

   }

   async load(id: any): Promise<Cohort | null>  {

      const result = await cohortModel.findOne().where('_id').eq(id).exec();

      if (result) {
         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._doc._persistenceDetails._id !== result._doc._id)
            result._doc._persistenceDetails._id = result._doc._id;

         var personDb:PersonDb = new PersonDb();

         // Switch adminstrators from an array of Ids to an array of objects by loading them up 
         let admins = personDb.loadMany(result._doc._administratorIds);
         let members = personDb.loadMany(result._doc._memberIds);
         admins.then(data => {
            result._doc._administrators = data ? data : new Array<Person>();
            return members;
         })
         .then(data => {
            result._doc._members = data ? data : new Array<Person>();
            return this._codec.tryCreateFrom(result._doc);
         });

      } else {
         return null;
      }
   }

   async save(cohort: Cohort): Promise<Cohort | null> {
      try {
         var prevAdmins: Array<Person> = cohort.administrators;
         var prevMembers: Array<Person> = cohort.members;

         // Before saving to DB, we convert object references to Ids, save the Ids on the memento, and remove object references from the Cohort.
         // We do the reverse on load.
         let memento = cohort.memento();

         memento._administratorIds = this.makePersonIds(prevAdmins);
         memento._memberIds = this.makePersonIds(prevMembers);
         memento._administrators = new Array<PersonMemento>();
         memento._members = new Array<PersonMemento>();

         let result = await (new cohortModel(memento)).save({ isNew: cohort.persistenceDetails._id ? true : false });

         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._doc._persistenceDetails._id !== result._doc._id)
            result._doc._persistenceDetails._id = result._doc._id;

         // Restore the object arrays before sending back to client
         result._doc._administrators = prevAdmins;
         result._doc._members = prevMembers;

         // TODO This is really a development level check - that when we read back from the database, the saved object passes the ts-io checks. 
         // Could remove from production builds once schema is stable, & just return oroginal object with a new PersistenceDetails _id
         return this._codec.tryCreateFrom(result._doc);
      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("CohortDb", "save", "Error:", err);
         return null;
      }

   }
}

const cohortSchema = new mongoose.Schema({
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
   _name: {
      _name: {
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
         enum: ["Week",  "TwoWeeks",  "ThreeWeeks", "FourWeeks", "Month"],
         required: true
      },
      _numberOfPeriods: {
         type: Number,
         required: true
      }
   },
   _administratorIds: {
      type: [String],
      required: true
   },
   _memberIds: {
      type: [String],
      required: true
   },
   _weightMeasurements: [measurementTypeSchema],
   _timeMeasurements: [measurementTypeSchema]
},
{  // Enable timestamps for archival 
      timestamps: true
});

const cohortModel = mongoose.model("Cohort", cohortSchema);
