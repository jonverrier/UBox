'use strict';
// Copyright TXPCo ltd, 2020, 2021

var passport = require("passport");
var passportGoogle = require('passport-google-oauth20').Strategy;
const GoogleStrategy = passportGoogle.Strategy;

import { PersistenceDetails } from '../../core/src/Persistence';
import { PersonaDetails } from '../../core/src/Persona';
import { Roles, ERoleType, Person } from '../../core/src/Person';
import { PersonDb, PersonByEmailDb, PersonByExternalIdDb} from './PersonDb';
import { ELoginProvider, LoginContext } from '../../core/src/LoginContext';

async function save(user, accessToken): Promise<Person | null> {

   const email = user.email;
   const name = user.name;
   const thumbnailUrl = user.picture;
   const externalId = user.sub;

   let myDb = new PersonByEmailDb();

   let person = await myDb.loadOne(email);

   if (person) {
      // Person record found in DB - increment version and overwrite
      person = new Person(PersistenceDetails.incrementSequenceNo(person.persistenceDetails),
         new PersonaDetails(name, thumbnailUrl),
         new LoginContext(ELoginProvider.Google, externalId),
         email,
         person.roles);

      return person;
   }
   else {
      // Person is not found, create them as a prospect
      let roles = new Roles(new Array<ERoleType>(ERoleType.Prospect));

      let db = new PersonDb();
      person = new Person(PersistenceDetails.newPersistenceDetails(),
         new PersonaDetails(name, thumbnailUrl),
         new LoginContext(ELoginProvider.Google, externalId),
         email, roles);

      return db.save(person); 
   }
};

function find(id, fn) {
   let db = new PersonByExternalIdDb();
   let result = db.loadOne(id);

   result.then(function (person) {
      if (person) {
         fn(null, person);
      } else
         fn(new Error('Cannot find Person with ID:' + JSON.stringify(id)), null);
   }).catch(err => {

      fn(new Error('Cannot find Person with ID:' + JSON.stringify(id)), null);
   })
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
   'google', new GoogleStrategy(
      {
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: process.env.GOOGLE_APP_CALLBACK,
         scope: ["email", "profile"]
      },
      function (accessToken, refreshToken, profile, done) {

         save(profile._json, accessToken);

         done(null, profile); 
      }
   )
);
