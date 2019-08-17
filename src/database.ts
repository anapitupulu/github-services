import {Sequelize} from 'sequelize-typescript';
import {logger} from './logger';

const database = new Sequelize({
  url: process.env.DATABASE_URL,
  modelPaths: [__dirname + '/models/database']
});

database.authenticate()
  .then(() => {
    logger.info('Successfully connected to database');
  })
  .catch((err: Error) => {
    logger.error('Failed to connect to database... terminate process');
    process.exit(1);
  });

export {
  database,
};
