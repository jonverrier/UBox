'use strict';
// Copyright TXPCo ltd, 2020, 2021

var path = require('path');
var express = require('express');
var passport = require('passport');

// Not directly used here, but passport needs to be initialised with a Strategy
var authController = require("./AuthController.js");

import { PersonDb } from './PersonDb';

export var AuthRoutes = express.Router();

AuthRoutes.get("/auth/google", (req, res, next) => {

   return passport.authenticate("Google")(req, res, next);
});

var options = {
   root: path.join(__dirname, "..")
};

AuthRoutes.get(
   "/auth/google/callback",
   passport.authenticate("Google", {
      successRedirect: "/successg",
      failureRedirect: "/failg"
   })
);

AuthRoutes.get("/failg", (req, res) => {
   res.sendFile('public/logonnotallowed.html', options);
});

AuthRoutes.get("/successg", (req, res) => {

   let db = new PersonDb();
   let result = db.loadOne(req.user.id);

   result.then (function (person) {

      if (person)
         res.redirect("cohorts");
      else
         res.sendFile('public/logonnotallowed.html', options);
   });
});

AuthRoutes.post("/auth/logout", (req, res) => {

   if (req.user)
      req.logout();
   
   if (req.session) {
      req.session.destroy(function (err) {
         res.send(true);
      });
   } else
      res.send(false);
});

