// Imports
import express from 'express';

// App Imports
import database from './loaders/database';
import middlewares from './loaders/middlewares';
import endpoint from './loaders/endpoint';
import start from './loaders/start';

// Create express server
const app = express();

// Database
database();

// Setup middlewares
middlewares(app);

// Setup endpoint
endpoint(app);

// Start server
start(app);
