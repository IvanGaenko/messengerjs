// Imports
import express, { json, urlencoded } from 'express';

// App Imports
import database from './loaders/database';
import middlewares from './loaders/middlewares';
import cluster from './loaders/cluster';
// import start from './loaders/start';

// Create express server
const app = express();

// Database
database();

// Setup middlewares
middlewares(app, json, urlencoded);

// Start server
// start(app);
cluster(app);
