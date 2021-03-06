'use strict';
// Copyright TXPCo ltd, 2020, 2021

import { Logger } from '../../core/src/Logger';
import { PersistenceDetails } from '../../core/src/Persistence';
import { Cohort, ICohortStore, ICohortStoreById, ICohortStoreByEmail } from '../../core/src/Cohort';
import { Business } from '../../core/src/Business';
import { CohortCodec } from '../../core/src/IOCohort';
import { Person } from '../../core/src/Person';
import { PersonDb, PersonByEmailDb } from './PersonDb';
import { BusinessDb, BusinesDbById } from './BusinessDb';
import { cohortModel } from './CohortSchema';

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
         var docPost = result.toObject({ transform: true });

         var businessDb: BusinessDb = new BusinessDb();
         var personDb: PersonDb = new PersonDb();

         let business = await businessDb.loadOne(docPost._businessId);

         docPost._business = business.memento();

         return this._codec.tryCreateFrom(docPost);

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

         // If the record has not already been saved, look to see if we have an existing record that is otherwise the same
         // Records are the same if they are: 
         // same business, same name, same cohortType
         var whereClause = {
            '_businessId': memento._business._persistenceDetails._key,
            '_personaDetails._name': memento._personaDetails._name,
            '_cohortType': memento._cohortType
         };

         const existing = await cohortModel.findOne(whereClause).exec();

         var result;

         if (existing) {

            // Copy across fields to update, with incremented sequence number
            existing._persistenceDetails = PersistenceDetails.incrementSequenceNo(
               new PersistenceDetails(existing._id,
                  existing._persistenceDetails._schemaVersion,
                  existing._persistenceDetails._sequenceNumber)).memento();
            existing._personaDetails = memento._personaDetails;
            existing._business = memento._business;
            existing._businessId = memento._businessId;
            existing._cohortType = memento._cohortType;
            existing._cohortType = memento._cohortType;

            result = await existing.save({ isNew: false });

         } else {
            let doc = new cohortModel(memento);

            // Set schema version if it is currently clear
            if (doc._persistenceDetails._schemaVersion === PersistenceDetails.newSchemaIndicator())
               doc._persistenceDetails._schemaVersion = 0;

            result = await doc.save({ isNew: true });
         }

         var docPost = result.toObject({ transform: true });
         return this.postProcessfromSave(docPost, prevBusiness);

      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("CohortDb", "save", "Error:", err);
         return null;
      }

   }

   postProcessfromSave(doc, prevBusiness: Business): Cohort {
      var cohort: Cohort;

      doc._business = prevBusiness.memento();
      cohort = this._codec.tryCreateFrom(doc);

      return cohort;
   }
}

export class CohortDbById implements ICohortStoreById {
   private _codec;

   constructor() {
      this._codec = new CohortCodec();
   }

   async loadMany(id: string): Promise<Array<Cohort>> {

      // TODO - this is not very efficient - loading a full Business object involves multiple queries.
      // At some point this can be duplicated down so it just loads ids directlt from the DB
      // For the moment we keep the simpler / more encapsulated version

      // Step 1 - load all businesses where the provided ID is an administrator or member
      var businessesDb: BusinesDbById = new BusinesDbById()
      var businesses: Array<Business> = await businessesDb.loadMany(id);

      if (!businesses) {
         return null;
      }

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
            var docPost = result[i].toObject({ transform: true });

            // Put the full Business object on the Cohort
            for (var j = 0; j < businesses.length; j++) {
               if (businesses[j].persistenceDetails.key === docPost._businessId) {
                  docPost._business = businesses[j].memento();
                  break;
               }
            }
            cohorts.push(this._codec.tryCreateFrom(docPost));
         }

         return cohorts;
      } else {
         return null;
      }
   }
}

// Aapter to load Cohorts associated with an email ID
// First loads the person, then loads Cohorts using the ID
export class CohortDbByEmail implements ICohortStoreByEmail {
   private _myPersonDb:PersonByEmailDb;
   private _myCohortsDb:CohortDbById;

   constructor() {
      this._myPersonDb = new PersonByEmailDb();
      this._myCohortsDb = new CohortDbById();
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
