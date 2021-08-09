'use strict';
// Copyright TXPCo ltd, 2020, 2021

import express from 'express';
export var ApiRoutes = express.Router();

import { NameCodec, LoginDetailsCodec, EmailAddressCodec, UrlCodec, RolesCodec, PersonCodec } from '../../core/src/IOPerson';
import { Person } from '../../core/src/Person';
import { PersonDb } from './PersonDb';

// Retrieve a Person
ApiRoutes.get('/api/person/:id', function (req, res) {

   res.send(true);
})

// Save a Person
ApiRoutes.put('/api/person', function (req, res) {

   let encoded = req.body;

   let name = new NameCodec().tryCreateFrom(encoded.name);
   let login = new LoginDetailsCodec().tryCreateFrom(encoded.loginDetails);
   let email = new EmailAddressCodec().tryCreateFrom(encoded.email);
   let thumb = new UrlCodec().tryCreateFrom(encoded.thumbnailUrl);
   let roles = new RolesCodec().tryCreateFrom(encoded.roles);

   let codec = new PersonCodec();

   try {
      console.log(encoded);
      let decoded = codec.tryCreateFrom(encoded);

      try {
         let personDb = new PersonDb();
         personDb.save(decoded);
         res.send(true);
      } catch (err) {
         console.log(err);
         res.send(false);
      }
   } catch (err) {
      console.log(err);
      res.send(false);
   }
});

