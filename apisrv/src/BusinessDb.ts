'use strict';
// Copyright TXPCo ltd, 2020, 2021

import { Logger } from '../../core/src/Logger';
import { Person, PersonMemento } from '../../core/src/Person';
import { Business, BusinessMemento, IBusinessStore, IMyBusinessesStore } from '../../core/src/Business';
import { BusinessCodec, BusinessesCodec} from '../../core/src/IOBusiness';
import { PersonDb } from './PersonDb';
import { businessModel } from './BusinessSchema';

function makeIdArray(input: Array<any>) : Array < string > {
   var output: Array<string> = new Array<string>(input.length);

   for(var i = 0; i<input.length; i++) {
      output[i] = input[i].toString();
   }
   return output;
}

async function postProcessFromLoad(doc: any, codec: BusinessCodec): Promise <Business> {

   var newBusiness: Business;

   var personDb: PersonDb = new PersonDb();

   // Switch adminstrators from an array of Ids to an array of objects by loading them up
   let adminIds = makeIdArray(doc._administratorIds);
   let admins = await personDb.loadMany(adminIds);

   // Switch members from an array of Ids to an array of objects by loading them up
   let memberIds = makeIdArray(doc._memberIds);
   let members = await personDb.loadMany(memberIds);

   doc._administrators = new Array();
   doc._members = new Array();

   newBusiness = codec.tryCreateFrom(doc);

   newBusiness.administrators = admins ? admins : new Array<Person>();;
   newBusiness.members = members ? members : new Array<Person>();

   return newBusiness;
}

export class BusinessDb implements IBusinessStore {
   private _codec: BusinessCodec;

   constructor() {
      this._codec = new BusinessCodec();
   }


   postProcessFromSave(doc,
      prevAdmins: Array<Person>, prevMembers: Array<Person>): Business {

      var newBusiness: Business;

      doc._administrators = new Array();
      doc._members = new Array();

      newBusiness = this._codec.tryCreateFrom(doc);

      // Restore the object arrays before sending back to client
      newBusiness.administrators = prevAdmins;
      newBusiness.members = prevMembers;

      return newBusiness;
   }

   private makePersonIds(people: Array<Person>): Array<string> {
      var ids: Array<string> = new Array<string>();
      var i: number;

      for (i = 0; i < people.length; i++) {
         ids.push(people[i].persistenceDetails.key);
      }
      return ids;

   }

   async loadOne(id: string): Promise<Business | null>  {

      const result = await businessModel.findOne().where('_id').eq(id).exec();

      if (result) {
         var docPost = result.toObject({ transform: true });
         return postProcessFromLoad(docPost, this._codec);

      } else {
         return null;
      }
   }

   async save(business: Business): Promise<Business | null> {
      try {
         var prevAdmins: Array<Person> = business.administrators;
         var prevMembers: Array<Person> = business.members;

         var personDb: PersonDb = new PersonDb();

         // For any Admins that do not have valid key, save them
         for (var i = 0; i < prevAdmins.length; i++) {
            if (!prevAdmins[i].persistenceDetails.hasValidKey()) {
               prevAdmins[i] = await personDb.save(prevAdmins[i]);
            }
         }

         // For any Members that do not have valid key, save them
         for (var i = 0; i < prevMembers.length; i++) {
            if (!prevMembers[i].persistenceDetails.hasValidKey()) {
               prevMembers[i] = await personDb.save(prevMembers[i]);
            }
         }

         // Before saving to DB, we convert object references to Ids, save the Ids on the memento, and remove object references from the Cohort.
         // We do the reverse on load.
         let memento = business.memento();

         memento._administratorIds = this.makePersonIds(prevAdmins);
         memento._administrators = new Array<PersonMemento>();
         memento._memberIds = this.makePersonIds(prevMembers);
         memento._members = new Array<PersonMemento>();

         if (!business.persistenceDetails.hasValidKey()) {
            // If the record has not already been saved, look to see if we have an existing record that is otherwise the same
            // Records are the same if they are: 
            //    same name 
            var whereClause = {
               '_personaDetails._name': business.personaDetails.name
            };

            const existing = await businessModel.findOne(whereClause).exec();

            // if the saved version has a later or equal sequence number, do not overwrite it, just return the existing one
            if (existing && existing._doc._persistenceDetails._sequenceNumber >= business.persistenceDetails.sequenceNumber) {
               var docPost = existing.toObject({ transform: true });
               return this.postProcessFromSave(docPost, prevAdmins, prevMembers);
            }
         }

         let doc = new businessModel(memento);
         let result = await (doc).save({ isNew : business.persistenceDetails.key ? true : false});

         var docPost = result.toObject({ transform: true });
         return this.postProcessFromSave(docPost, prevAdmins, prevMembers);

      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("BusinessDb", "save", "Error:", err);
         return null;
      }

   }
}


export class MyBusinessesDb implements IMyBusinessesStore {
   private _codec;

   constructor() {
      this._codec = new BusinessCodec();
   }

   processResults(results: any): Array<BusinessMemento> {
      var businesses: Array<BusinessMemento> = new Array<BusinessMemento>();

      if (results && results.length > 0) {
         var i: number;

         for (i = 0; i < results.length; i++) {
            var docPost = results[i].toObject({ transform: true });
            businesses.push(docPost);
         }
      }
      return businesses;
   }

   async loadMany(id: string): Promise<Array<Business>> {

      // Build lists of the business entities with ids[0] as a member
      const admins = await businessModel.find().where({ _administratorIds: id }).exec();
      const members = await businessModel.find().where({ _memberIds: id }).exec();

      // Concatenate
      var results: Array<BusinessMemento> = this.processResults(admins);
      var results2: Array<BusinessMemento> = this.processResults(members);
      results.concat(results2);

      // Build a list of IDs
      var ids: Array<string> = new Array<string>(results.length);
      var postProcessed: Array<Business> = new Array<Business>();

      for (var i = 0; i < results.length; i++) {
         ids.push(results[i]._persistenceDetails._key);
         postProcessed[i] = await postProcessFromLoad(results[i], this._codec);
      }

      // Query all cohorts with the ids as key
      if (postProcessed.length > 0) {

         return postProcessed;
      } else {
         return null;
      }
   }
}

