'use strict';
// Copyright TXPCo ltd, 2020, 2021

import express from 'express';
import { URL, URLSearchParams} from 'url';

import { Logger } from '../../core/src/Logger';

import { PersonCodec } from '../../core/src/IOPerson';
import { PersonDb } from './PersonDb';

import { WeightMeasurementCodec } from '../../core/src/IOObservation';
import { MeasurementDb } from './ObservationDb';

import { CohortCodec } from '../../core/src/IOCohort';
import { CohortDb } from './CohortDb';

export var ApiRoutes = express.Router();

// Retrieve a Person
ApiRoutes.get('/api/personQuery', function (req, res) {

   try {
      let codec = new PersonCodec();
      let db = new PersonDb();

      let url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
      let params = new URLSearchParams(url.search);

      let result = db.load(params.get('_id'));
      result.then(data => {
         res.send(codec.encode(data ? data : null));
      });

   } catch (e) {
      var logger = new Logger();
      logger.logError("Person", "Query", "Error", e.toString());
      res.send(null);
   }
})

// Save a Person
ApiRoutes.put('/api/personSave', function (req, res) {

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
ApiRoutes.get('/api/measurementQuery', function (req, res) {

   try {
      let codec = new WeightMeasurementCodec();
      let db = new MeasurementDb();

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
ApiRoutes.put('/api/measurementSave', function (req, res) {

   try {
      let codec = new WeightMeasurementCodec();
      let db = new MeasurementDb();

      let encoded = req.body;
      let decoded = codec.tryCreateFrom(encoded);

      let result = db.save(decoded);
      result.then(data => {
         res.send(codec.encode(data ? data : null));
      });
   } catch (e) {
      var logger = new Logger();
      logger.logError("Measurement", "Save", "Error", e.toString());
      res.send(null);
   }
});

// Retrieve a Cohort
ApiRoutes.get('/api/cohortQuery', function (req, res) {

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
ApiRoutes.put('/api/cohortSave', function (req, res) {

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