'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";
import { Logger } from '../../core/src/Logger';
import { MeasurementOf, IWeightMeasurementStore } from '../../core/src/Observation';
import { WeightMeasurementCodec } from '../../core/src/IOObservation';
import { EWeightUnits } from "../../core/src/Quantity";


export class MeasurementDb implements IWeightMeasurementStore {
   private _codec;

   constructor() {
      this._codec = new WeightMeasurementCodec();;
   }

   async load(id: any): Promise<MeasurementOf<EWeightUnits> | null>  {

      const result = await measurementModel.findOne().where('_id').eq(id).exec();

      if (result) {
         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._doc._persistenceDetails._id !== result._doc._id)
            result._doc._persistenceDetails._id = result._doc._id;

         return this._codec.tryCreateFrom(result._doc);
      } else {
         return null;
      }
   }

   async save(measurement: MeasurementOf<EWeightUnits>): Promise<MeasurementOf<EWeightUnits> | null> {
      try {
         let result = await (new measurementModel(measurement)).save({ isNew: measurement.persistenceDetails._id ? true : false });

         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._doc._persistenceDetails._id !== result._doc._id)
            result._doc._persistenceDetails._id = result._doc._id;

         return this._codec.tryCreateFrom(result._doc);
      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("MeasurementDb", "save", "Info:", JSON.stringify (measurement));
         logger.logError("MeasurementDb", "save", "Error:", err);
         return null;
      }

   }
}

const measurementSchema = new mongoose.Schema({
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
      },
   },
   _quantity: {
      _amount: {
         type: Number,
         required: true
      },
      _unit: {
         type: String,
         enum: ["Kg", "Lbs"],
         required: true
      },
   },
   _repeats: {
      _amount: {
         type: Number,
         required: true
      },
      _unit: {
         type: String,
         enum: ["Reps"],
         required: true
      },
   },
   _cohortPeriod: {
       type: Number,
       required: true
   },
   _measurementType: {
      _measurementType: {
         type: String,
         enum: ["Snatch", "Clean", "Jerk", "CleanAndJerk", "Row", "Run"],
         required: true
      },
      _range: {
         _lo: {
            _amount: {
               type: Number,
               required: true
            },
            _unit: {
               type: String,
               enum: ["Kg", "Lbs"],
               required: true
            },
         },
         _loInclEq: {
            type: Boolean,
            required: true
         },
         _hi: {
            _amount: {
               type: Number,
               required: true
            },
            _unit: {
               type: String,
               enum: ["Kg", "Lbs"],
               required: true
            },
         },
         _hiInclEq: {
            type: Boolean,
            required: true
         },
      },
      _trend: {
         type: String,
         enum: ["Up", "Down"],
         required: true
      }
   },
   _subjectExternalId: {
      type: String,
      required: true
   }
},
{  // Enable timestamps for archival 
      timestamps: true
});

const measurementModel = mongoose.model("Measurement", measurementSchema);
