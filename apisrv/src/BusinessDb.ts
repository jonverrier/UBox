'use strict';
// Copyright TXPCo ltd, 2020, 2021

import mongoose from "mongoose";
import { Logger } from '../../core/src/Logger';
import { Person, PersonMemento } from '../../core/src/Person';
import { Business, IBusinessStore } from '../../core/src/Business';
import { BusinessCodec } from '../../core/src/IOBusiness';
import { PersonDb } from './PersonDb';
import { persistenceDetailsSchema } from './PersistenceDb';
import { personaDetailsSchema } from './PersonaDb';

export class BusinessDb implements IBusinessStore {
   private _codec;

   constructor() {
      this._codec = new BusinessCodec();;
   }

   private makeIdArray(input: Array<any>) : Array<string> {
      var output: Array<string> = new Array<string>(input.length);

      for (var i = 0; i < input.length; i++) {
         output[i] = input[i].toString();
      }
      return output;
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
         return this.postProcessFromLoad(result._doc);

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
               '_persona._personaDetails._name._displayName': business.personaDetails.name.displayName
            };

            const existing = await businessModel.findOne(whereClause).exec();

            // if the saved version has a later or equal sequence number, do not overwrite it, just return the existing one
            if (existing && existing._doc._persistenceDetails._sequenceNumber >= business.persistenceDetails.sequenceNumber) {

               return this.postProcessFromSave(existing._doc, prevAdmins, prevMembers);
            }
         }

         let doc = new businessModel(memento);
         let result = await (doc).save({ isNew : business.persistenceDetails.key ? true : false});

         return this.postProcessFromSave(result._doc, prevAdmins, prevMembers);

      } catch (err) {
         let logger: Logger = new Logger();
         logger.logError("BusinessDb", "save", "Error:", err);
         return null;
      }

   }

   postProcessFromSave(doc,
      prevAdmins: Array<Person>, prevMembers: Array<Person>): Business {

      var newBusiness: Business;

      // If we saved a new document, copy the new Mongo ID to persistenceDetails
      if (doc._persistenceDetails._key !== doc._id.toString())
         doc._persistenceDetails._key = doc._id.toString();
      
      doc._administrators = new Array();
      doc._members = new Array();

      newBusiness = this._codec.tryCreateFrom(doc);

      // Restore the object arrays before sending back to client
      newBusiness.administrators = prevAdmins;
      newBusiness.members = prevMembers;

      return newBusiness;
   }

   async postProcessFromLoad(doc): Promise<Business> {

      var newBusiness: Business;

      // If we saved a new document, copy the new Mongo ID to persistenceDetails
      if (doc._persistenceDetails._key !== doc._id.toString())
         doc._persistenceDetails._key = doc._id.toString();

      var personDb: PersonDb = new PersonDb();

      // Switch adminstrators from an array of Ids to an array of objects by loading them up 
      let adminIds = this.makeIdArray(doc._administratorIds);
      let admins = await personDb.loadMany(adminIds);

      // Switch members from an array of Ids to an array of objects by loading them up 
      let memberIds = this.makeIdArray(doc._memberIds);
      let members = await personDb.loadMany(memberIds);

      doc._administrators = new Array();
      doc._members = new Array();

      newBusiness = this._codec.tryCreateFrom(doc);

      newBusiness.administrators = admins ? admins : new Array<Person>();
      newBusiness.members = members ? members : new Array<Person>();

      return newBusiness;
   }
}

const businessSchema = new mongoose.Schema({
   _persistenceDetails: persistenceDetailsSchema,
   _personaDetails: personaDetailsSchema,
   _administratorIds: {
      type: [String],
      required: true
   },
   _memberIds: {
      type: [String],
      required: true
   }
},
{  // Enable timestamps for archival 
      timestamps: true
});

const businessModel = mongoose.model("Business", businessSchema);
