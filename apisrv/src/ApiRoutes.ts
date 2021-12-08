'use strict';
// Copyright TXPCo ltd, 2020, 2021

import express from 'express';
import { URL, URLSearchParams} from 'url';

import { Logger } from '../../core/src/Logger';
import { IdListCodec, IdList } from '../../core/src/IOCommon';
import { PersonasCodec } from '../../core/src/IOPersona';
import { PersonCodec, PeopleCodec } from '../../core/src/IOPerson';
import { PersonDb, MyPersonDb} from './PersonDb';
import { MeasurementCodec, MeasurementsCodec } from '../../core/src/IOObservation';
import { MeasurementDb } from './ObservationDb';
import { CohortCodec, CohortsCodec } from '../../core/src/IOCohort';
import { CohortDb, MyCohortsDb, MyEmailCohortsDb} from './CohortDb';
import { BusinessCodec, BusinessesCodec } from '../../core/src/IOBusiness';
import { BusinessDb, MyBusinessesDb} from './BusinessDb';

import { EApiUrls } from './ApiUrls';

export var ApiRoutes = express.Router();

// Retrieve multiple Persona objects
// This uses the fact that Personas are a compatible subset of Person in wire/Db format, so you can just restore a Persona from a saved representation of a Person
ApiRoutes.put(EApiUrls.QueryPersonas, function (req, res) {

   try {
      let personasCodec = new PersonasCodec();
      let db = new PersonDb();

      let idCodec = new IdListCodec();
      var ids: IdList = idCodec.decode(req.body);

      let result = db.loadMany(ids._ids);
      result.then(data => {
         res.send(data ? personasCodec.encode(data) : null);
      });

   } catch (e) {
      var logger = new Logger();
      logger.logError("People", "Query", "Error", e.toString());
      res.send(null);
   }
})

// Retrieve a Person
ApiRoutes.get(EApiUrls.QueryPerson, function (req, res) {

   try {
      let codec = new PersonCodec();
      let db = new PersonDb();

      let url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
      let params = new URLSearchParams(url.search);

      let result = db.loadOne(params.get('_key'));
      result.then(data => {
         res.send(data ? codec.encode(data) : null);
      });

   } catch (e) {
      var logger = new Logger();
      logger.logError("Person", "Query", "Error", e.toString());
      res.send(null);
   }
})

// Retrieve a Person
ApiRoutes.get(EApiUrls.QueryPersonByEmail, function (req, res) {

   try {
      let codec = new PersonCodec();
      let db = new MyPersonDb();

      let url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
      let params = new URLSearchParams(url.search);

      let result = db.loadOne(params.get('_key'));
      result.then(data => {
         res.send(data? codec.encode(data) : null);
      });

   } catch (e) {
      var logger = new Logger();
      logger.logError("Person", "QueryByEmail", "Error", e.toString());
      res.send(null);
   }
})

// Retrieve multiple Person objects
ApiRoutes.put(EApiUrls.QueryPeople, function (req, res) {

   try {
      let peopleCodec = new PeopleCodec();
      let db = new PersonDb();

      let idCodec = new IdListCodec();

      var ids: IdList = idCodec.decode(req.body);

      let result = db.loadMany(ids._ids);
      result.then(data => {
         res.send(data ? peopleCodec.encode(data) : null);
      });

   } catch (e) {
      var logger = new Logger();
      logger.logError("People", "Query", "Error", e.toString());
      res.send(null);
   }
})

// Save a Person
ApiRoutes.put(EApiUrls.SavePerson, function (req, res) {

   try {
      let codec = new PersonCodec();
      let db = new PersonDb();

      let encoded = req.body;
      let decoded = codec.tryCreateFrom(encoded);

      let result = db.save(decoded);
      result.then(data => {
         res.send(data ? codec.encode(data) : null);
      });
   } catch (e) {
      var logger = new Logger();
      logger.logError("Person", "Save", "Error", e.toString());
      res.send(null);
   }
});

// Retrieve a Measurement
ApiRoutes.get(EApiUrls.QueryMeasurement, function (req, res) {

   try {
      let codec = new MeasurementCodec();
      let db = new MeasurementDb();

      let url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
      let params = new URLSearchParams(url.search);

      let result = db.loadOne (params.get('_key'));
      result.then(data => {
         if (data) {
            res.send(data ? codec.encode(data) : null);
         }
         else {
            res.send(null);
         }
      });

   } catch (e) {
      var logger = new Logger();
      logger.logError("Measurement", "QueryMeasurement", "Error", e.toString());
      res.send(null);
   }
})

// Save a Measurement
ApiRoutes.put(EApiUrls.SaveMeasurement, function (req, res) {

   try {
      let codec = new MeasurementCodec();
      let db = new MeasurementDb();

      let encoded = req.body;     
      var decoded = codec.tryCreateFrom(encoded);

      let result = db.save(decoded);
      result.then(data => {
         if (data) {
            res.send(data ? codec.encode(data) : null);
         }
         else {
            res.send(null);
         }
      });
   } catch (e) {
      var logger = new Logger();
      logger.logError("Measurement", "SaveMeasurement", "Error:", e.toString());
      res.send(null);
   }
});

// Retrieve multiple Measurement objects
ApiRoutes.put(EApiUrls.QueryMeasurements, function (req, res) {

   try {
      let measurementsCodec = new MeasurementsCodec();
      let db = new MeasurementDb();

      let idCodec = new IdListCodec();

      var ids: IdList = idCodec.decode(req.body);

      let result = db.loadMany(ids._ids);
      result.then(data => {
         res.send(data ? measurementsCodec.encode(data) : null);
      });

   } catch (e) {
      var logger = new Logger();
      logger.logError("Measurements", "QueryMeasurements", "Error", e.toString());
      res.send(null);
   }
})

// Retrieve multiple Measurement objects
ApiRoutes.put(EApiUrls.QueryMeasurementsForPeople, function (req, res) {

   try {
      let measurementsCodec = new MeasurementsCodec();
      let db = new MeasurementDb();

      let idCodec = new IdListCodec();

      var ids: IdList = idCodec.decode(req.body);

      let result = db.loadManyForPeople (ids._ids);
      result.then(data => {
         res.send(data ? measurementsCodec.encode(data) : null);
      });

   } catch (e) {
      var logger = new Logger();
      logger.logError("Measurements", "QueryMeasurementsForPeople", "Error", e.toString());
      res.send(null);
   }
})

// Retrieve multiple Measurement objects
ApiRoutes.put(EApiUrls.QueryMeasurementsForCohort, function (req, res) {

   try {
      let measurementsCodec = new MeasurementsCodec();
      let db = new MeasurementDb();

      let result = db.loadManyForCohort(req.body.key);
      result.then(data => {
         res.send(data ? measurementsCodec.encode(data) : null);
      });

   } catch (e) {
      var logger = new Logger();
      logger.logError("Measurements", "QueryMeasurementsForCohort", "Error", e.toString());
      res.send(null);
   }
})

// Retrieve a Cohort
ApiRoutes.get(EApiUrls.QueryCohort, function (req, res) {

   try {
      let codec = new CohortCodec();
      let db = new CohortDb();

      let url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
      let params = new URLSearchParams(url.search);

      let result = db.loadOne (params.get('_key'));
      result.then(data => {
         res.send(data ? codec.encode(data) : null);
      });

   } catch (e) {
      var logger = new Logger();
      logger.logError("Cohort", "Load", "Error", e.toString());
      res.send(null);
   }
})

// Save a Cohort
ApiRoutes.put(EApiUrls.SaveCohort, function (req, res) {

   try {
      let codec = new CohortCodec();
      let db = new CohortDb();

      let encoded = req.body;
      let decoded = codec.tryCreateFrom(encoded);

      let result = db.save(decoded);
      result.then(data => {
         res.send(data ? codec.encode(data) : null);
      });
   } catch (e) {
      var logger = new Logger();
      logger.logError("Cohort", "Save", "Error", e.toString());
      res.send(null);
   }
});

// Retrieve multiple Cohort objects
// This version takes person key as query parameter - query looks inside each business object to see of the supplied id is a member or an admin.
ApiRoutes.put(EApiUrls.QueryMyCohorts, function (req, res) {

   try {
      let codec = new CohortsCodec();
      let db = new MyCohortsDb();

      let result = db.loadMany(req.body.key);
      result.then(data => {
         res.send(data ? codec.encode(data) : null);
      });

   } catch (e) {
      var logger = new Logger();
      logger.logError("Cohort", "QueryMany", "Error", e.toString());
      res.send(null);
   }
})

// Retrieve multiple Cohort objects
// This version takes person email as query parameter - query looks up the person, then inside each business object to see of the supplied id is a member or an admin.
ApiRoutes.put(EApiUrls.QueryMyCohortsByEmail, function (req, res) {

   try {
      let codec = new CohortsCodec();
      let db = new MyEmailCohortsDb();

      let result = db.loadMany(req.body.key);
      result.then(data => {
         res.send(data ? codec.encode(data) : null);
      });

   } catch (e) {
      var logger = new Logger();
      logger.logError("Cohort", "QueryManyByEmail", "Error", e.toString());
      res.send(null);
   }
})

// Retrieve a Business
ApiRoutes.get(EApiUrls.QueryBusiness, function (req, res) {

   try {
      let codec = new BusinessCodec();
      let db = new BusinessDb();

      let url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
      let params = new URLSearchParams(url.search);

      let result = db.loadOne(params.get('_key'));
      result.then(data => {
         res.send(data ? codec.encode(data) : null);
      });

   } catch (e) {
      var logger = new Logger();
      logger.logError("Business", "Load", "Error", e.toString());
      res.send(null);
   }
})

// Save a Business
ApiRoutes.put(EApiUrls.SaveBusiness, function (req, res) {

   try {
      let codec = new BusinessCodec();
      let db = new BusinessDb();

      let encoded = req.body;
      let decoded = codec.tryCreateFrom(encoded);

      let result = db.save(decoded);
      result.then(data => {
         res.send(data ? codec.encode(data) : null);
      });
   } catch (e) {
      var logger = new Logger();
      logger.logError("Business", "Save", "Error", e.toString());
      res.send(null);
   }
});

// Retrieve multiple Business objects
// This version takes person key as query parameter - query looks inside each business object to see of the supplied id is a member or an admin.
ApiRoutes.put(EApiUrls.QueryMyBusinesses, function (req, res) {

   try {
      let codec = new BusinessesCodec();
      let db = new MyBusinessesDb();

      let result = db.loadMany(req.body.key);
      result.then(data => {
         res.send(data ? codec.encode(data) : null);
      });

   } catch (e) {
      var logger = new Logger();
      logger.logError("Businesses", "QueryMany", "Error", e.toString());
      res.send(null);
   }
})