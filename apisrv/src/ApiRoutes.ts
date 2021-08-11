'use strict';
// Copyright TXPCo ltd, 2020, 2021

import express from 'express';
export var ApiRoutes = express.Router();
import { URL, URLSearchParams} from 'url';

import { PersonCodec } from '../../core/src/IOPerson';
import { PersonDb } from './PersonDb';
import { WeightMeasurementCodec } from '../../core/src/IOObservation';
import { MeasurementDb } from './ObservationDb';

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

   } catch (err) {
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
   } catch (err) {
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

   } catch (err) {
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
   } catch (err) {
      res.send(null);
   }
});