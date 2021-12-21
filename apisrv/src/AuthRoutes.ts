'use strict';
// Copyright TXPCo ltd, 2020, 2021

var path = require('path');
var express = require('express');
var passport = require('passport');

// Not directly used in this file, but passport needs to be initialised with a Strategy so the module has to be loaded
var authController = require("./AuthController.js");

import { PersonByExternalIdDb } from './PersonDb';
import { EAuthUrls } from './AuthUrls';
import { EAppUrls } from './AppUrls';

export var AuthRoutes = express.Router();

AuthRoutes.get(EAuthUrls.GoogleRoot, (req, res, next) => {

   return passport.authenticate("google")(req, res, next);
});

var options = {
   root: path.join(__dirname, "..")
};

AuthRoutes.get(
   EAuthUrls.GoogleCallback,
   passport.authenticate("google", {
      successRedirect: EAuthUrls.GoogleSuccess,
      failureRedirect: EAuthUrls.GoogleFail
   })
);

AuthRoutes.get(EAuthUrls.GoogleFail, (req, res) => {
   res.sendFile('public/logonnotallowed.html', options);
});

AuthRoutes.get(EAuthUrls.GoogleSuccess, (req, res) => {

   let db = new PersonByExternalIdDb();
   
   let result = db.loadOne(req.user.loginContext.externalId);

   result.then (function (person) {

      if (person)
         res.redirect(EAppUrls.Cohorts);
      else
         res.sendFile('public/logonnotallowed.html', options);
   })
   .catch(err => {
      res.sendFile('public/internalerror.html', options);
   })
});

AuthRoutes.put (EAuthUrls.GoogleLogout, (req, res) => {

   if (req.user)
      req.logout();
   
   if (req.session) {
      req.session.destroy(function (err) {
         res.send(true);
      });
   } else
      res.send(false);
});

