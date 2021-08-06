
import express from 'express'
import path from 'path';
import errorHandler from 'errorhandler';
import compression from 'compression';

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

if (inDevelopment) {
   // Set error handler. 
   app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}

app.get('/ping', (req, res) => {
   res.send('pong')
});

const port = process.env.PORT || 4000

app.listen(port, () => {
   console.log(`Server is listening on port ${port}`)
})