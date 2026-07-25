require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log,
    define: {
      freezeTableName: true,
      timestamps: true,
      underscored: true
    }
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_NAME}_test`,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    define: {
      freezeTableName: true,
      timestamps: true,
      underscored: true
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    define: {
      freezeTableName: true,
      timestamps: true,
      underscored: true
    },
    // Managed Postgres (Render/Heroku/etc.) requires SSL; a local/Docker
    // Postgres doesn't support it. Default on for real production, but let
    // it be disabled with DB_SSL=false (e.g. docker-compose's local db).
    ...(process.env.DB_SSL !== 'false' && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  }
};