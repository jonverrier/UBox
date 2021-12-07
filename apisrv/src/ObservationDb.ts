'use strict';
// Copyright TXPCo ltd, 2020, 2021
// Implements IMeasurementStore over a Mongo DB schema

import mongoose from "mongoose";
import { Logger } from '../../core/src/Logger';
import { EBaseUnitDimension, EBaseUnit } from '../../core/src/Unit';
import { EMeasurementType, EPositiveTrend } from '../../core/src/ObservationType';
import { MeasurementTypes } from '../../core/src/ObservationTypeDictionary';
import { Measurement, IMeasurementStore } from '../../core/src/Observation';
import { MeasurementCodec } from '../../core/src/IOObservation';
import { persistenceDetailsSchema } from './PersistenceSchema';

export class MeasurementDb implements IMeasurementStore {
   private _codec: MeasurementCodec;
   private _measurementTypes: MeasurementTypes = new MeasurementTypes();

   constructor() {
      this._codec = new MeasurementCodec();
   }

   /**
    * load a measurement object async
    * @param id - id for the object to load
    * @returns - a constructed object or null if not found. 
    */
   async loadOne (id: string): Promise<Measurement | null>  {

      try {
         const result = await measurementModel.findOne().where('_id').eq(id).exec();

         if (result) {
            // If we saved a new document, copy the new Mongo ID to persistenceDetails
            if (result._doc._persistenceDetails._key !== result._doc._id.toString())
               result._doc._persistenceDetails._key = result._doc._id.toString();

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

   /**
    * helper function to process arrays froma  loadXXX query.
    */

   private processManyResults(result: any): Array<Measurement> {
      if (result && result.length > 0) {
         var i: number;
         var measurements: Array<Measurement>
            = new Array<Measurement>();

         for (i = 0; i < result.length; i++) {
            // If we saved a new document, copy the new Mongo ID up to persistenceDetails
            if (result[i]._doc._persistenceDetails._key !== result[i]._doc._id.toString())
               result[i]._doc._persistenceDetails._key = result[i]._doc._id.toString();

            var measurement: Measurement;
            measurement = this._codec.tryCreateFrom(result[i]._doc);
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
   async loadMany(ids: Array<string>): Promise<Array<Measurement>> {

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
   async loadManyForPeople (ids: Array<string>): Promise<Array<Measurement>> {

      try {
         const result = await measurementModel.find().where('_subjectKey').in(ids).exec();

         return this.processManyResults(result);

      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("MeasurementDb", "loadManyForPeople", "Error:", err);
         return null;
      }
   }

   /**
    * load multiple measurement objects
    * @param id - athe cohort ID
    * @returns - an array of constructed object or null if not found.
    */
   async loadManyForCohort(id: string): Promise<Array<Measurement>> {

      try {
         const result = await measurementModel.find().where({ '_cohortKey': id }).exec();

         return this.processManyResults(result);

      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("MeasurementDb", "loadManyForCohort", "Error:", err);
         return null;
      }
   }

   /**
    * save a measurement object
    * @param measurement - the object to save
    * @returns - a copy of what was saved - useful if saving a new object, as the store will assign a new key
    */
   async save(measurement: Measurement): Promise<Measurement | null> {
      try {
         if (!measurement.persistenceDetails.hasValidKey()) {
            // If the record has not already been saved, look to see if we have an existing record that is otherwise the same
            // Records are the same if they are: 
            // same subject, same measurementType, same timestampRounded.
            var whereClause = {
               '_subjectKey': measurement.subjectKey,
               '_measurementType': measurement.measurementType.measurementType,
               '_timestampRounded': measurement.timestamp
            };

            const existing = await measurementModel.findOne(whereClause).exec();

            // if the saved version has a later or equal sequence number, do not overwrite it, just return the existing one
            if (existing && existing._doc._persistenceDetails._sequenceNumber >= measurement.persistenceDetails.sequenceNumber) {

               // If we have an existing document, copy the new Mongo ID to persistenceDetails
               if (existing._doc._persistenceDetails._key !== existing._doc._id.toString())
                  existing._doc._persistenceDetails._key = existing._doc._id.toString();

               // Return a constructed object via codec 
               return this._codec.tryCreateFrom(existing._doc);
            }
         }
         let doc = new measurementModel(measurement.memento());
         let result = await doc.save({ isNew: measurement.persistenceDetails.key ? true : false});

         // If we saved a new document, copy the new Mongo ID to persistenceDetails
         if (result._persistenceDetails._key !== result._id.toString())
            result._doc._persistenceDetails._key = result._doc._id.toString();

         return this._codec.tryCreateFrom(result._doc);

      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("MeasurementDb", "save", "Error:", err);
         return null;
      }
   }
}


const measurementTypeValues: Array<string> = (Object.values(EMeasurementType));
const measurementUnitTypeValues: Array<string> = (Object.values(EBaseUnitDimension));
const trendValues: Array<string> = (Object.values(EPositiveTrend));

const baseUnitDemensions: Array<string> = (Object.values(EBaseUnitDimension));
const baseUnits: Array<string> = (Object.values(EBaseUnit));

export const quantitySchema = new mongoose.Schema({
   _amount: {
      type: Number,
      required: true
   },
   _unit: {
      _dimension: {
         type: String,
         enum: baseUnitDemensions,
         required: true
      },
      _name: {
         type: String,
         enum: baseUnits,
         required: true
      }
   }
});

export const rangeSchema = new mongoose.Schema({
   _lo: quantitySchema,
   _loInclEq: {
      type: Boolean,
      required: true
   },
   _hi: quantitySchema,
   _hiInclEq: {
      type: Boolean,
      required: true
   },
});

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
   _range: rangeSchema,
   _trend: {
      type: String,
      enum: trendValues,
      required: true
   }
});

const measurementSchema = new mongoose.Schema({
   _persistenceDetails: persistenceDetailsSchema,
   _quantity: quantitySchema,
   _repeats: {
      type: Number,
      required: true
   },
   _timestamp: {
       type: Number,
       required: true
   },
   _measurementType: {
      type: String,
      required: true
   },
   _subjectKey: {
      type: String,
      required: true
   },
   _cohortKey: {
      type: String,
      required: true
   }
},
{  // Enable timestamps for archival 
      timestamps: true
});

const measurementModel = mongoose.model("Measurement", measurementSchema);
