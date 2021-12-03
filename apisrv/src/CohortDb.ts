'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";
import { Logger } from '../../core/src/Logger';
import { ECohortType, Cohort, ICohortStore, IMyCohortsStore } from '../../core/src/Cohort';
import { Business } from '../../core/src/Business';
import { CohortCodec, CohortsCodec } from '../../core/src/IOCohort';
import { Person } from '../../core/src/Person';
import { PersonDb, MyPersonDb } from './PersonDb';
import { BusinessDb, MyBusinessesDb } from './BusinessDb';
import { persistenceDetailsSchema } from './PersistenceDb';
import { personaDetailsSchema } from './PersonaDb';

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

         result._doc._business = business.memento();

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
               '_personaDetails._name._displayName': memento._personaDetails._name._displayName,
               '_cohortType': memento._cohortType
            };

            const existing = await cohortModel.findOne(whereClause).exec();

            // if the saved version has a later or equal sequence number, do not overwrite it, just return the existing one
            if (existing && existing._doc._persistenceDetails._sequenceNumber >= cohort.persistenceDetails.sequenceNumber) {

               // If we have an existing document, copy the Mongo ID to persistenceDetails
               if (existing._doc._persistenceDetails._key !== existing._doc._id.toString())
                  existing._doc._persistenceDetails._key = existing._doc._id.toString();

               // Restore the object arrays before sending back to client
               existing._doc._business = prevBusiness.memento();

               // Return a constructed object via codec 
               return this._codec.tryCreateFrom(existing._doc);
            }
         }

         let doc = new cohortModel(memento);
         let result = await doc.save({ isNew: cohort.persistenceDetails.key ? true : false });

         return this.postProcessfromSave(result._doc, prevBusiness);

      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("CohortDb", "save", "Error:", err);
         return null;
      }

   }

   postProcessfromSave(doc, prevBusiness: Business): Cohort {
      var cohort: Cohort;

      // If we saved a new document, copy the new Mongo ID to persistenceDetails
      if (doc._persistenceDetails._key !== doc._id.toString())
         doc._persistenceDetails._key = doc._id.toString();

      doc._business = prevBusiness.memento();
      cohort = this._codec.tryCreateFrom(doc);

      return cohort;
   }
}

export class MyCohortsDb implements IMyCohortsStore {
   private _codec;

   constructor() {
      this._codec = new CohortCodec();
   }

   async loadMany(id: string): Promise<Array<Cohort>> {

      // TODO - this is not very efficient - loading a full Business object involves multiple queries.
      // At some point this can be duplicated down so it just loads ids directlt from the DB
      // For the moment we keep the simpler / more encapsulated version

      // Step 1 - load all businesses where the provided ID is an administrator or member
      var businessesDb: MyBusinessesDb = new MyBusinessesDb()
      var businesses: Array<Business> = await businessesDb.loadMany(id);

      // Step 2 - build a list of IDs
      var businessIds: Array<string> = new Array<string>();
      for (var i = 0; i < businesses.length; i++)
         businessIds.push(businesses[i].persistenceDetails.key);

      // Step 2 - Load all the cohorts for the businesses loaded in Step 1
      const result = await cohortModel.find().where('_businessId').in(businessIds).exec();

      if (result && result.length > 0) {
         var i: number;
         var cohorts: Array<Cohort> = new Array<Cohort>();

         for (i = 0; i < result.length; i++) {
            // If we saved a new document, copy the new Mongo ID up to persistenceDetails
            if (result[i]._doc._persistenceDetails._key !== result[i]._doc._id.toString())
               result[i]._doc._persistenceDetails._key = result[i]._doc._id.toString();

            // Put the full Business object on the Cohort
            result[i]._doc._business = businesses[i].memento();

            cohorts.push(this._codec.tryCreateFrom(result[i]._doc));
         }

         return cohorts;
      } else {
         return null;
      }

      var cohorts: Array<Cohort> = new Array<Cohort>();

      return null;
   }
}

// Aapter to load Cohorts associated with an email ID
// First loads the person, then loads Cohorts using the ID
export class MyEmailCohortsDb implements IMyCohortsStore {
   private _myPersonDb:MyPersonDb;
   private _myCohortsDb:MyCohortsDb;

   constructor() {
      this._myPersonDb = new MyPersonDb();
      this._myCohortsDb = new MyCohortsDb();
   }

   async loadMany(id: string): Promise<Array<Cohort>> {
      var person: Person = await this._myPersonDb.loadOne(id);
      if (person) {
         return await this._myCohortsDb.loadMany(person.persistenceDetails.key);
      }
      else
         return null;
   }
}

const cohortTypes: Array<string> = (Object.values(ECohortType));

const cohortSchema = new mongoose.Schema({
   _persistenceDetails: persistenceDetailsSchema,
   _personaDetails: personaDetailsSchema,
   _creationTimestamp: {
      type: Number,
      required: true
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
