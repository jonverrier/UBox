'use strict';
// Copyright TXPCo ltd, 2020, 2021

import express from 'express';
import { URL, URLSearchParams } from 'url';

import { Logger } from '../../core/src/Logger';
import { PersonCodec } from '../../core/src/IOPerson';
import { PersonByEmailDb } from './PersonDb';
import { PersonaCodec, PersonasCodec } from '../../core/src/IOPersona';
import { MeasurementsCodec } from '../../core/src/IOObservation';
import { CohortCodec } from '../../core/src/IOCohort';
import { CohortsPresenterMemento } from '../../core/src/CohortsPresenter';
import { CohortPresenterMemento } from '../../core/src/CohortPresenter';
import { CohortDb, CohortDbByEmail } from './CohortDb';
import { MeasurementDb } from './ObservationDb';
import { EApiUrls, EPresenterApiUrls } from './ApiUrls';

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
      var isAdministrator: boolean = false;

      cohortResult.then(cohorts => {
         personResult.then(person => {

            if ((!person) || (!cohorts)) {
               logger.logError("PresenterApiRoutes", EPresenterApiUrls.QueryCohortsPresenterFromSession, "Error - no user session.", '');
               res.send(null);
            }
            else {
               for (var i in cohorts) {
                  if (cohorts[i].business.includesAdministrator(person)) {
                     isAdministrator = true;
                     break;
                  }
               }
               let cohortsPresenter: CohortsPresenterMemento = new CohortsPresenterMemento(personaCodec.encode(person),
                  isAdministrator,
                  personasCodec.encode(cohorts));
               res.send(cohortsPresenter);
            }
         });
      });

   } catch (e) {

      logger.logError("PresenterApiRoutes", EPresenterApiUrls.QueryCohortsPresenterFromSession, "Error", e.toString());
      res.send(null);
   }
})

// Retrieve Cohort detail and associated measurements
// This version uses the session to get user email, - query looks up the person, then inside each business object to see of the supplied id is a member or an admin.
PresenterApiRoutes.get(EPresenterApiUrls.QueryCohortPresenterFromSession, (req: any, res) => {

   if ((!req.user) || (!req.user.loginContext)) {
      logger.logError("PresenterApiRoutes", EPresenterApiUrls.QueryCohortPresenterFromSession, "Error - no user session.", '');
      res.send(null);
      return;
   }

   try {
      let personaCodec = new PersonaCodec();
      let personDb = new PersonByEmailDb();

      let cohortCodec = new CohortCodec();
      let cohortDb = new CohortDb();

      let measurementdb = new MeasurementDb();
      let measurementsCodec = new MeasurementsCodec();


      let url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
      let params = new URLSearchParams(url.search);
      let key = params.get(EApiUrls.Key);

      let cohortResult = cohortDb.loadOne(key);
      let personResult = personDb.loadOne(req.user.email);
      var isAdministrator: boolean = false;

      let measurementsResult = measurementdb.loadManyForCohort(key);

      cohortResult.then(cohort => {
         personResult.then(person => {
            measurementsResult.then(measurements => {

               if ((!person) || (!cohort)) {
                  logger.logError("PresenterApiRoutes", EPresenterApiUrls.QueryCohortPresenterFromSession, "Error - no user session.", '');
                  res.send(null);
               }
               else {
                  if (cohort.business.includesAdministrator(person)) {
                     isAdministrator = true;
                  }
                  let cohortsPresenter: CohortPresenterMemento = new CohortPresenterMemento(personaCodec.encode(person),
                     isAdministrator,
                     cohortCodec.encode(cohort),
                     measurementsCodec.encode(measurements)
                  );
                  res.send(cohortsPresenter);
               }
            });
         });
      });

   } catch (e) {

      logger.logError("PresenterApiRoutes", EPresenterApiUrls.QueryCohortsPresenterFromSession, "Error", e.toString());
      res.send(null);
   }
})