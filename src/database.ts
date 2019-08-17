import {Sequelize} from 'sequelize-typescript';

const database = new Sequelize({
  url: process.env.DATABASE_URL,
  modelPaths: [__dirname + '/models/database']
});

export {
  database,
};
