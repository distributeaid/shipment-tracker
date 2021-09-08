import path from 'path'
import { Sequelize, SequelizeOptions } from 'sequelize-typescript'

// DB_ENV is used soley to set the database config to "ci" for running
// tests on CI. This is because DB connection config is different between
// CI and local test envs. See db/config.json
const env = process.env.DB_ENV || process.env.NODE_ENV || 'development'
console.debug(`sequelize env`, env)
const sequelizeConfig = path.join(process.cwd(), 'db', 'config.json')
console.debug(`sequelize config`, sequelizeConfig)
const config = require(sequelizeConfig)[env]
console.debug(`sequelize config loaded`, config)

export let sequelize: Sequelize

const COMMON_CONFIG: Partial<SequelizeOptions> = {
  models: [path.join(process.cwd(), 'dist', 'src', 'models')],
  dialect: 'postgres',
  protocol: 'postgres',
}

if (config.use_env_variable !== undefined) {
  console.debug(`sequelize env variable`, config.use_env_variable)
  const connectionUrl = process.env[config.use_env_variable] as
    | string
    | undefined
  if (connectionUrl === undefined || connectionUrl.length === 0) {
    throw new Error('connectionUrl is not defined!')
  }

  sequelize = new Sequelize(connectionUrl, {
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
