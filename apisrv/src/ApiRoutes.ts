'use strict';
// Copyright TXPCo ltd, 2020, 2021

import express from 'express';
import { URL, URLSearchParams} from 'url';

import { Logger } from '../../core/src/Logger';

import { IdListCodec, IdList } from '../../core/src/IOCommon';

import { PersonCodec, PeopleCodec } from '../../core/src/IOPerson';
import { PersonDb } from './PersonDb';

import { WeightMeasurementCodec, WeightMeasurementsCodec } from '../../core/src/IOObservation';
import { WeightMeasurementDb } from './ObservationDb';

import { CohortCodec } from '../../core/src/IOCohort';
import { CohortDb } from './CohortDb';

import { EApiUrls } from './ApiUrls';

export var ApiRoutes = express.Router();

// Retrieve a Person
ApiRoutes.get(EApiUrls.QueryPerson, function (req, res) {

   try {
      let codec = new PersonCodec();
      let db = new PersonDb();

      let url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
      let params = new URLSearchParams(url.search);

      let result = db.loadOne(params.get('_id'));
      result.then(data => {
         res.send(codec.encode(data ? data : null));
      });

   } catch (e) {
      var logger = new Logger();
      logger.logError("Person", "Query", "Error", e.toString());
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
         res.send(peopleCodec.encode(data ? data : null));
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
         res.send(codec.encode(data ? data : null));
      });
   } catch (e) {
      var logger = new Logger();
      logger.logError("Person", "Save", "Error", e.toString());
      res.send(null);
   }
});

// Retrieve a Measurement
ApiRoutes.get(EApiUrls.QueryWeightMeasurement, function (req, res) {

   try {
      let codec = new WeightMeasurementCodec();
      let db = new WeightMeasurementDb();

      let url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
      let params = new URLSearchParams(url.search);

      let result = db.load(params.get('_id'));
      result.then(data => {
         res.send(data ? codec.encode(data) : null);
      });

   } catch (e) {
      var logger = new Logger();
      logger.logError("Measurement", "Load", "Error", e.toString());
      res.send(null);
   }
})

// Save a Measurement
ApiRoutes.put(EApiUrls.SaveWeightMeasurement, function (req, res) {

   try {
      let codec = new WeightMeasurementCodec();
      let db = new WeightMeasurementDb();

      let encoded = req.body;
      let decoded = codec.tryCreateFrom(encoded);

      let result = db.save(decoded);
      result.then(data => {
         res.send(codec.encode(data ? data : null));
      });
   } catch (e) {
      var logger = new Logger();
      logger.logError("Measurement", "SaveWeight", "Error", e.toString());
      res.send(null);
   }
});

// Retrieve multiple Measurement objects
ApiRoutes.put(EApiUrls.QueryWeightMeasurements, function (req, res) {

   try {
      let weightsCodec = new WeightMeasurementsCodec();
      let db = new WeightMeasurementDb();


      let idCodec = new IdListCodec();

      var ids: IdList = idCodec.decode(req.body);

      let result = db.loadMany(ids._ids);
      result.then(data => {
         res.send(weightsCodec.encode(data ? data : null));
      });

   } catch (e) {
      var logger = new Logger();
      logger.logError("Measurements", "QueryWeight", "Error", e.toString());
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

      let result = db.load(params.get('_id'));
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
         res.send(codec.encode(data ? data : null));
      });
   } catch (e) {
      var logger = new Logger();
      logger.logError("Cohort", "Save", "Error", e.toString());
      res.send(null);
   }
});