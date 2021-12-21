'use strict';
// Copyright TXPCo ltd, 2020, 2021

import express from 'express';
import path from 'path';

import { EAppUrls } from './AppUrls';

export var AppRoutes = express.Router();


AppRoutes.get(EAppUrls.Login, (req, res) => {
   var options = {
      root: path.join(__dirname, '../public')
   };

   res.sendFile('/whiteboard.html', options);
});

AppRoutes.get(EAppUrls.Cohorts, (req, res) => {
   var options = {
      root: path.join(__dirname, '../public')
   };

   res.sendFile('/whiteboard.html', options);
});

AppRoutes.get(EAppUrls.Cohort, (req, res) => {
   var options = {
      root: path.join(__dirname, '../public')
   };

   res.sendFile('/whiteboard.html', options);
});