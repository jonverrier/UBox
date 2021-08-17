'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";
import { Logger } from '../../core/src/Logger';
import { Cohort, ICohortStore } from '../../core/src/Cohort';
import { CohortCodec } from '../../core/src/IOCohort';


export class CohortDb implements ICohortStore {
   private _codec;

   constructor() {
      this._codec = new CohortCodec();;
   }

   async load(id: any): Promise<Cohort | null>  {

      const result = await cohortModel.findOne().where('_id').eq(id).exec();

      if (result) {
         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._doc._persistenceDetails._id !== result._doc._id)
            result._doc._persistenceDetails._id = result._doc._id;

         return this._codec.tryCreateFrom(result._doc);
      } else {
         return null;
      }
   }

   async save(cohort: Cohort): Promise<Cohort | null> {
      try {
         let result = await (new cohortModel(cohort)).save({ isNew: cohort.persistenceDetails._id ? true : false });

         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._doc._persistenceDetails._id !== result._doc._id)
            result._doc._persistenceDetails._id = result._doc._id;

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
   _administrators: {
      type: [String],
      required: true
   },
   _members: {
      type: [String],
      required: true
   },
   _weightMeasurements: {
      type: [String],
      required: true
   },
   _timeMeasurements: {
      type: [String],
      required: true
   }
},
{  // Enable timestamps for archival 
      timestamps: true
});

const cohortModel = mongoose.model("Cohort", cohortSchema);
