'use strict';
// Copyright TXPCo ltd, 2020, 2021

var passport = require("passport");
var passportGoogle = require('passport-google-oauth20').Strategy;

const GoogleStrategy = passportGoogle.Strategy;

import { PersistenceDetails } from '../../core/src/Persistence';
import { PersonaDetails } from '../../core/src/Persona';
import { Roles, ERoleType, Person } from '../../core/src/Person';
import { PersonDb, MyPersonDb } from './PersonDb';

function save(user, accessToken) {
   const email = user.email;
   const name = user.first_name + ' ' + user.last_name;
   const thumbnailUrl = 'https://graph.facebook.com/' + user.id.toString() + '/picture';
   const lastAuthCode = accessToken;
   const externalId = user.id;

   const userData = {
      externalId, email, name, thumbnailUrl, lastAuthCode
   };

   let myDb = new MyPersonDb();

   let result = myDb.loadOne(email);

   result.then(person => {
      if (person) {

         // TODO - what if the profile differs from what we have - name, thumbnailUrl??

      }
      else {
         // Person is not found, create them as a prospect
         let roles = new Roles(new Array<ERoleType>(ERoleType.Prospect));

         let db = new PersonDb();
         person = new Person(PersistenceDetails.newPersistenceDetails(),
            new PersonaDetails(name, thumbnailUrl),
            email, roles);

         db.save(person); 
      }
   });
};

function find(id, fn) {
   let db = new PersonDb();
   let result = db.loadOne(id);

   result.then(function (person) {
      if (person) {
         fn(null, person);
      } else
         fn(new Error ('Cannot find Person.'), null);
   });
};

passport.serializeUser(function (user, done) {
   done(null, user.id);
});

passport.deserializeUser(function (id, done) {
   find(id, function (err, user) {
      done(err, user);
   });
});

passport.use(
   'Google', new GoogleStrategy(
      {
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: process.env.GOOGLE_APP_CALLBACK,
         profileFields: ["email", "name", "displayName"]
      },
      function (accessToken, refreshToken, profile, done) {
         save(profile._json, accessToken);
         done(null, profile); 
      }
   )
);
