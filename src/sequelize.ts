import { Sequelize, SequelizeOptions } from 'sequelize-typescript'

// DB_ENV is used soley to set the database config to "ci" for running
// tests on CI. This is because DB connection config is different between
// CI and local test envs. See db/config.json
const env = process.env.DB_ENV || process.env.NODE_ENV || 'development'
const config = require(__dirname + '/../db/config.json')[env]

export let sequelize: Sequelize

const COMMON_CONFIG: Partial<SequelizeOptions> = {
  models: [__dirname + '/models'],
  dialect: 'postgres',
  protocol: 'postgres',
}

if (env === 'production') {
  if (process.env.POSTGRESQL_ADDON_URI == null) {
    throw new Error('POSTGRESQL_ADDON_URI is null!')
  }

  sequelize = new Sequelize(process.env.POSTGRESQL_ADDON_URI, {
    ...COMMON_CONFIG,
    dialectOptions: config.dialectOptions,
  })
} else {
  sequelize = new Sequelize({
    ...COMMON_CONFIG,
    database: config.database,
    username: config.username,
    password: config.password,
    logging: process.env.NODE_ENV?.toUpperCase() !== 'TEST' && console.log,
  })
}
