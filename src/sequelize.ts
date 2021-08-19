import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import { URL } from 'url'

// DB_ENV is used soley to set the database config to "ci" for running
// tests on CI. This is because DB connection config is different between
// CI and local test envs. See db/config.json
const env = process.env.DB_ENV || process.env.NODE_ENV || 'development'
const config = require(__dirname + '/../db/config.json')[env]
console.debug(`sequelize config loaded`, config)

export let sequelize: Sequelize

const COMMON_CONFIG: Partial<SequelizeOptions> = {
  models: [__dirname + '/models'],
  dialect: 'postgres',
  protocol: 'postgres',
}

if (env === 'production') {
  if (process.env.DATABASE_URL == null) {
    throw new Error('DATABASE_URL is null!')
  }

  const url = new URL(process.env.DATABASE_URL ?? '')
  console.debug({
    host: url.host,
    database: url.pathname.substr(1),
  })

  sequelize = new Sequelize(process.env.DATABASE_URL, {
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
