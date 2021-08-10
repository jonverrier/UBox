'use strict';
// Copyright TXPCo ltd, 2020, 2021

import express from 'express';
export var ApiRoutes = express.Router();
import { URL, URLSearchParams} from 'url';

import { PersonCodec } from '../../core/src/IOPerson';
import { PersonDb } from './PersonDb';

// Retrieve a Person
ApiRoutes.get('/api/personQuery', function (req, res) {

   try {
      let codec = new PersonCodec();
      let personDb = new PersonDb();

      let url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
      let params = new URLSearchParams(url.search);

      let result = personDb.load(params.get('_id'));
      result.then(data => {
         res.send(codec.encode(data));
      });

   } catch (err) {
      res.send(null);
   }
})

// Save a Person
ApiRoutes.put('/api/personSave', function (req, res) {

   try {
      let codec = new PersonCodec();
      let personDb = new PersonDb();

      let encoded = req.body;
      let decoded = codec.tryCreateFrom(encoded);

      let result = personDb.save(decoded);
      result.then(data => {
         res.send(codec.encode(data));
      });
   } catch (err) {
      res.send(null);
   }
});

