import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';
import {logger} from './logger';
import {router as membersRouter} from './router/members';
import {convertToBase64} from './utils';

dotenv.config();
const app = express();
const port = 8080;

const username: string = process.env.GITHUB_USERNAME || '';
const password: string = process.env.GITHUB_PASSWORD || '';
logger.debug(username);
logger.debug(password);
const authToken = convertToBase64(`${username}:${password}`);

logger.debug(authToken);
axios.defaults.headers.common['Authorization'] = `Basic ${authToken}`;

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

// define a route handler for the default home page
app.use('/orgs/:userId/members', membersRouter);

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
  ],
  // format: winston.format.combine(
  //   winston.format.json(),
  // ),
}));

// start the Express server
app.listen(port, () => {

  // tslint:disable-next-line:no-console
  console.log( `server started at http://localhost:${ port }` );
});
