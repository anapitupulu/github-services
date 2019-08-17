/**
 * This is the main Express file which register all the routes
 */

// Load .env file immediately as many parts of the application relies on it
import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import express from 'express';
import * as bodyParser from 'body-parser';
import expressWinston from 'express-winston';
import winston from 'winston';
import envalid, {str} from 'envalid';
import {database} from './database';
import {logger} from './logger';
import {router as membersRouter} from './router/members';
import {router as commentsRouter} from './router/comments';
import {convertToBase64} from './utils';

// Verify if the required environment variables are set
const env = envalid.cleanEnv(process.env, {
  GITHUB_USERNAME: str(),
  GITHUB_PASSWORD: str(),
  DATABASE_URL: str(),
});

database.sync();
const app = express();

// Set Basic Auth token to the request header as GitHub API requires it
const username: string = env.GITHUB_USERNAME;
const password: string = env.GITHUB_PASSWORD;
const authToken = convertToBase64(`${username}:${password}`);
axios.defaults.headers.common['Authorization'] = `Basic ${authToken}`;

// Set up logger
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.json()
  ),
  meta: true,
  expressFormat: true,
  colorize: false,
}));

// Set up JSON parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Set up Routers
app.use('/orgs/:userId/members', membersRouter);
app.use('/orgs/:userId/comments', commentsRouter);

// Set up error logger
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.json(),
  ),
}));

export {
  app,
};
