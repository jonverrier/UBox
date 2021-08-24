'use strict';
// Copyright TXPCo ltd, 2020, 2021
// Implements IMeasurementStore over a Mongo DB schema

import mongoose from "mongoose";
import { Logger } from '../../core/src/Logger';
import { MeasurementUnitType, MeasurementOf, IMeasurementStore, EMeasurementType, EMeasurementUnitType, EPositiveTrend } from '../../core/src/Observation';
import { WeightMeasurementCodec, TimeMeasurementCodec } from '../../core/src/IOObservation';
import { TimeUnits, WeightUnits, RepUnits } from "../../core/src/Quantity";


export class MeasurementDb implements IMeasurementStore {
   private _weightCodec: WeightMeasurementCodec;
   private _timeCodec: TimeMeasurementCodec;

   constructor() {
      this._weightCodec = new WeightMeasurementCodec();
      this._timeCodec = new TimeMeasurementCodec();
   }

   /**
    * load a measurement object async
    * @param id - id for the object to load
    * @returns - a constructed object or null if not found. 
    */
   async load(id: string): Promise<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits> |null>  {

      try {
         const result = await measurementModel.findOne().where('_id').eq(id).exec();

         if (result) {
            // If we saved a new document, copy the new Mongo ID to persistenceDetails
            if (result._doc._persistenceDetails._key !== result._doc._id.toString())
               result._doc._persistenceDetails._key = result._doc._id.toString();

            if (MeasurementUnitType.isWeightUnitType(result._doc._measurementType._unitType)) {
               return this._weightCodec.tryCreateFrom(result._doc);
            }
            else {
               return this._timeCodec.tryCreateFrom(result._doc);
            }
         } else {
            return null;
         }
      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("MeasurementDb", "load", "Error:", err);
         return null;
      }
   }

   /**
    * helper function to process arrays froma  loadXXX query.
    */

   private processManyResults(result: any): Array<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits>> {
      if (result && result.length > 0) {
         var i: number;
         var measurements: Array<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits>>
            = new Array<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits>>();

         for (i = 0; i < result.length; i++) {
            // If we saved a new document, copy the new Mongo ID up to persistenceDetails
            if (result[i]._doc._persistenceDetails._key !== result[i]._doc._id.toString())
               result[i]._doc._persistenceDetails._key = result[i]._doc._id.toString();

            var measurement: MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits>;
            if (MeasurementUnitType.isWeightUnitType(result[i]._doc._measurementType._unitType)) {
               measurement = this._weightCodec.tryCreateFrom(result[i]._doc);
            }
            else {
               measurement = this._timeCodec.tryCreateFrom(result[i]._doc);
            }
            measurements.push(measurement);
         }

         return measurements;
      } else {
         return null;
      }
   }

   /**
    * load multiple measurement objects
    * @param ids - an array of ids for the objects to load
    * @returns - an array of constructed object or null if not found.
    */
   async loadMany(ids: Array<string>): Promise<Array<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits>>> {

      try {
         const result = await measurementModel.find().where('_id').in(ids).exec();

         return this.processManyResults(result);

      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("MeasurementDb", "loadMany", "Error:", err);
         return null;
      }
   }   

   /**
    * load multiple measurement objects
    * @param ids - an array of ids for people on which measurements apply 
    * @returns - an array of constructed object or null if not found.
    */
   async loadManyForPeople (ids: Array<string>): Promise<Array<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits>>> {

      try {
         const result = await measurementModel.find().where('_subjectKey').in(ids).exec();

         return this.processManyResults(result);

      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("MeasurementDb", "loadMany", "Error:", err);
         return null;
      }
   }

   /**
    * save a measurement object
    * @param measurement - the object to save
    * @returns - a copy of what was saved - useful if saving a new object, as the store will assign a new key
    */
   async save(measurement: MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits>): Promise<MeasurementOf<WeightUnits> | MeasurementOf<TimeUnits> | null> {
      try {
         let result = await (new measurementModel(measurement)).save({ isNew: measurement.persistenceDetails._key ? true : false });

         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._doc._persistenceDetails._key !== result._doc._id.toString())
            result._doc._persistenceDetails._key = result._doc._id.toString();

         if (measurement.measurementType.unitType === EMeasurementUnitType.Weight)
            return this._weightCodec.tryCreateFrom(result._doc);
         else
            return this._timeCodec.tryCreateFrom(result._doc);
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
   _subjectKey: {
      type: String,
      required: true
   }
},
{  // Enable timestamps for archival 
      timestamps: true
});

const measurementModel = mongoose.model("Measurement", measurementSchema);
