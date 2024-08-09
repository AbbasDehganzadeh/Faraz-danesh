import * as dotenv from 'dotenv';
dotenv.config({ path: '../dev.env' });

export default () => ({
  db: {
    //postgresql
    postgre: {
      port: process.env.DB_PSQL_PORT,
      host: process.env.DB_PSQL_HOST,
      user: process.env.DB_PSQL_USER,
      passwore: process.env.DB_PSQL_PASS,
    },
    //mongodb
    mongo: {
      uri: process.env.DB_MONGO_URI,
      port: process.env.DB_MONGO_PORT,
      host: process.env.DB_MONGO_HOST,
      user: process.env.DB_MONGO_USER,
      pass: process.env.DB_MONGO_PASS,
    },
  },
});
