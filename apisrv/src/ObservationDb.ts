'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";
import { Logger } from '../../core/src/Logger';
import { MeasurementOf, IMeasurementStore, EMeasurementType, EMeasurementUnitType, EPositiveTrend } from '../../core/src/Observation';
import { WeightMeasurementCodec } from '../../core/src/IOObservation';
import { TimeUnits, WeightUnits, RepUnits } from "../../core/src/Quantity";


export class MeasurementDb implements IMeasurementStore {
   private _codec;

   constructor() {
      this._codec = new WeightMeasurementCodec();;
   }

   async load(id: any): Promise<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits> |null>  {

      try {
         const result = await measurementModel.findOne().where('_id').eq(id).exec();

         if (result) {
            // If we saved a new document, copy the new Mongo ID to persistenceDetails
            if (result._doc._persistenceDetails._id !== result._doc._id)
               result._doc._persistenceDetails._id = result._doc._id;

            return this._codec.tryCreateFrom(result._doc);
         } else {
            return null;
         }
      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("MeasurementDb", "load", "Error:", err);
         return null;
      }
   }

   async loadMany(ids: Array<any>): Promise<Array<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits>>> {

      try {
         const result = await measurementModel.find().where('_id').in(ids).exec();

         if (result && result.length > 0) {
            var i: number;
            var measurements: Array<MeasurementOf<WeightUnits>> = new Array<MeasurementOf<WeightUnits>>();

            for (i = 0; i < result.length; i++) {
               // If we saved a new document, copy the new Mongo ID up to persistenceDetails
               if (result[i]._doc._persistenceDetails._id !== result[i]._doc._id)
                  result[i]._doc._persistenceDetails._id = result[i]._doc._id;

               measurements.push(this._codec.tryCreateFrom(result[i]._doc));
            }

            return measurements;
         } else {
            return null;
         }
      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("MeasurementDb", "loadMany", "Error:", err);
         return null;
      }
   }


   async save(measurement: MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits>): Promise<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits> | null> {
      try {
         let result = await (new measurementModel(measurement)).save({ isNew: measurement.persistenceDetails._id ? true : false });

         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._doc._persistenceDetails._id !== result._doc._id)
            result._doc._persistenceDetails._id = result._doc._id;

         return this._codec.tryCreateFrom(result._doc);
      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("MeasurementDb", "save", "Error:", err);
         return null;
      }
   }
}


const measurementTypeValues: Array<string> = (Object.values(EMeasurementType));
const measurementUnitTypeValues: Array<string> = (Object.values(EMeasurementUnitType));
const allUnitValues: Array<string> = WeightUnits.allowedValues().concat(TimeUnits.allowedValues()).concat(RepUnits.allowedValues());
const trendValues: Array<string> = (Object.values(EPositiveTrend));

export const measurementTypeSchema = new mongoose.Schema({
   _measurementType: {
      type: String,
      enum: measurementTypeValues,
      required: true
   },
   _unitType: {
      type: String,
      enum: measurementUnitTypeValues,
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
            enum: allUnitValues,
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
            enum: allUnitValues,
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
      enum: trendValues,
      required: true
   }
});

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
         enum: allUnitValues,
         required: true
      },
   },
   _repeats: {
      type: Number,
      required: true
   },
   _cohortPeriod: {
       type: Number,
       required: true
   },
   _measurementType: measurementTypeSchema,
   _subjectExternalId: {
      type: String,
      required: true
   }
},
{  // Enable timestamps for archival 
      timestamps: true
});

const measurementModel = mongoose.model("Measurement", measurementSchema);
