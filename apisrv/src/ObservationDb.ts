'use strict';
// Copyright TXPCo ltd, 2020, 2021
// Implements IMeasurementStore over a Mongo DB schema

import { Logger } from '../../core/src/Logger';
import { PersistenceDetails } from '../../core/src/Persistence';
import { Measurement, MeasurementMemento, IMeasurementStore } from '../../core/src/Observation';
import { MeasurementCodec } from '../../core/src/IOObservation';
import { measurementModel } from './ObservationSchema';

export class MeasurementDb implements IMeasurementStore {
   private _codec: MeasurementCodec;

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
            var docPost = result.toObject({ transform: true });

            return this._codec.tryCreateFrom(docPost);

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
            var docPost = result[i].toObject({ transform: true });

            var measurement: Measurement;
            measurement = this._codec.tryCreateFrom(docPost);
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
         // Look to see if we have an existing record that is otherwise the same
         // Records are the same if they are: 
         // same subject, same cohort, same measurementType, same timestampRounded.
         var whereClause = {
            '_subjectKey': measurement.subjectKey,
            '_cohortKey': measurement.cohortKey,
            '_measurementType': measurement.measurementType.measurementType,
            '_timestamp': measurement.timestamp
         };

         const existing = await measurementModel.findOne(whereClause).exec();

         // if the saved version has a later or equal sequence number, do not overwrite it, just return the existing one
         if (existing && existing._doc._persistenceDetails._sequenceNumber >= measurement.persistenceDetails.sequenceNumber) {
            var docPost = existing.toObject({ transform: true });

            // Return a constructed object via codec 
            return this._codec.tryCreateFrom(docPost);
         }

         var result;
         let encoded: MeasurementMemento = this._codec.encode(measurement);

         if (existing) {

            // Copy across fields to update (excl those used to check for existence), with incremented sequence number
            existing._persistenceDetails = PersistenceDetails.incrementSequenceNo(
               new PersistenceDetails(existing._persistenceDetails._key,
                  existing._persistenceDetails._schemaVersion,
                  existing._persistenceDetails._sequenceNumber));
            existing._quantity = encoded._quantity;
            existing._repeats = encoded._repeats;

            result = await existing.save({ isNew: false });

         } else {
            let doc = new measurementModel(measurement.memento());

            // Set schema version if it is currently clear
            if (doc._persistenceDetails._schemaVersion === PersistenceDetails.newSchemaIndicator())
               doc._persistenceDetails._schemaVersion = 0;

            result = await doc.save({ isNew: true });
         }

         var docPost = result.toObject({ transform: true });
         return this._codec.tryCreateFrom(docPost);

      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("MeasurementDb", "save", "Error:", err);
         return null;
      }
   }
}

