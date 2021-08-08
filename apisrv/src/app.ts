
// external modules
import express from 'express';
import path from 'path';
import errorHandler from 'errorhandler';
import compression from 'compression';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import axios from 'axios';
import qs from 'qs';

// Internal classes
import { ContactDb } from './contactDb';

// Control variables for development / production
var inDevelopment = false;
if (process.env.NODE_ENV === 'development') {
   inDevelopment = true;
   console.log('Using development options');
} else {
   console.log('Using production options');
}

// Initialize status middleware - files, cache etc
// Set cache parameter to one day unless in development, and include 'dev' directory if we are in development mode
// Note: do this BEFORE adding sessions, else sessions get called multiple times, 
// once for each asset including static ones
var cacheAge = 86400000; // 86400000 is One Day
if (inDevelopment)
   cacheAge = 0;

// Insert versioning middleware before static
var currentVersion = '0.1';
// var versionator = require('versionator').create(currentVersion);

var app = express();

// Force https
function requireHTTPS(req, res, next) {
   // The 'x-forwarded-proto' check is for Heroku
   if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
      return res.redirect('https://' + req.get('host') + req.url);
   }
   next();
}

app.use(function (req, res, next) {
   return requireHTTPS(req, res, next);
});

// Use compression for static files
app.use(compression());

// Allow files from ../public to be used 
app.use(express.static(path.join(__dirname, '../public')));

// Parse body of API requests
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.text()); // for parsing application/json

app.use(                    // Use Mongo session store
   session({
      store: new connectMongo({
         mongoUrl: process.env.MONGODB_URI,
         ttl: 691200000 // = 8 days - if coach logs in weekly, session outlasts that -> fewer facebook login messes. 
      }),
      cookie: { maxAge: 691200000 },
      secret: process.env.NODE_SESSION_SECRET,
      saveUninitialized: true,
      resave: true,
      httpOnly: true,   // https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions/
      secure: true,     // use cookies only accessible from http, that get deleted when browser closes
      ephemeral: true
   }));

if (inDevelopment) {
   // Set error handler. 
   app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}

app.post('/contact', (req, res) => {

   const params = {
      secret: process.env.GOOGLE_RECAPTCHA_SECRET,
      response: req.body.recaptchaToken
   };

   const config = {
      headers: {
         'Content-Type': 'application/x-www-form-urlencoded'
      }
   };
   const query: string = qs.stringify(params);

   axios.post('https://www.google.com/recaptcha/api/siteverify', query, config)
      .then(googleRes => {
         console.log(googleRes.data);

         if (googleRes.data.success === true && googleRes.data.score >= 0.5) {
            let contactDb = new ContactDb();
            contactDb.save(req.body.email, false);
            console.log('saved');
         }

         res.send('OK');
      })
      .catch(err => {
         console.log(err);
         res.send('error');
      });
});

app.get('/ping', (req, res) => {
   res.send('pong')
});

const port = process.env.PORT || 4000

// Fix deprecation warning. This one is not a breaking change. 
mongoose.set('useFindAndModify', false);

const connect = async () => {
   const dbConnection = mongoose.connection;

   try {
      // Connect to DB before we start listening
      await mongoose.connect(process.env.MONGODB_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true
      });

      // If using sequence numbers, have to call out to initialise them here before we get incoming requests

      // Listen once initialised
      var server = app.listen(port, function () {
         console.log(`Server is listening on port ${port}`);
      });

   } catch (error) {
      console.log('Error:' + error);
   }
};

connect();
