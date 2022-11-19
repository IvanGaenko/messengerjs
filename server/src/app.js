// Imports
import express from 'express';

// App Imports
import database from './loaders/database';
import middlewares from './loaders/middlewares';
import start from './loaders/start';

// Create express server
const app = express();

// Database
database();

// Setup middlewares
middlewares(app, express);

// Start server
start(app);
