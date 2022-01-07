'use strict';
// Copyright TXPCo ltd, 2020, 2021

import express from 'express';

import { Logger } from '../../core/src/Logger';
import { PersonCodec } from '../../core/src/IOPerson';
import { PersonByEmailDb } from './PersonDb';
import { PersonaCodec, PersonasCodec } from '../../core/src/IOPersona';
import { CohortDbByEmail } from './CohortDb';
import { CohortsPresenterMemento } from '../../core/src/CohortsPresenter';

import { EPresenterApiUrls } from './ApiUrls';

export var PresenterApiRoutes = express.Router();

var logger = new Logger();

// Retrieve a Person from the session
// This version uses the session to get user email, query looks up the person
PresenterApiRoutes.get(EPresenterApiUrls.QueryPersonFromSession, (req: any, res) => {

   if ((!req.user) || (!req.user.loginContext)) {
      logger.logError("PresenterApiRoutes", EPresenterApiUrls.QueryPersonFromSession, "Error - no user session.", '');
      res.send(null);
      return;
   }

   try {
      let personCodec = new PersonCodec();
      let personDb = new PersonByEmailDb();

      let personResult = personDb.loadOne(req.user.email);
      personResult.then(person => {
         res.send(person ? personCodec.encode(person) : null);
      });

   } catch (e) {

      logger.logError("PresenterApiRoutes", EPresenterApiUrls.QueryPersonFromSession, "Error", e.toString());
      res.send(null);
   }
})

// Retrieve Personas for multiple Cohort objects
// This version uses the session to get user email, - query looks up the person, then inside each business object to see of the supplied id is a member or an admin.
PresenterApiRoutes.get(EPresenterApiUrls.QueryCohortsPresenterFromSession, (req: any, res) => {

   if ((!req.user) || (!req.user.loginContext)) {
      logger.logError("PresenterApiRoutes", EPresenterApiUrls.QueryCohortsPresenterFromSession, "Error - no user session.", '');
      res.send(null);
      return;
   }

   try {
      let personaCodec = new PersonaCodec();
      let personDb = new PersonByEmailDb();

      let personasCodec = new PersonasCodec();
      let cohortDb = new CohortDbByEmail();

      let cohortResult = cohortDb.loadMany(req.user.email);
      let personResult = personDb.loadOne(req.user.email);

      cohortResult.then(cohorts => {
         personResult.then(person => {

            if ((!person) || (!cohorts)) {
               logger.logError("PresenterApiRoutes", EPresenterApiUrls.QueryCohortsPresenterFromSession, "Error - no user session.", '');
               res.send(null);
            }
            else {
               let cohortsPresenter: CohortsPresenterMemento = new CohortsPresenterMemento(personaCodec.encode(person), personasCodec.encode(cohorts));
               res.send(cohortsPresenter);
            }
         });
      });

   } catch (e) {

      logger.logError("PresenterApiRoutes", EPresenterApiUrls.QueryCohortsPresenterFromSession, "Error", e.toString());
      res.send(null);
   }
})
