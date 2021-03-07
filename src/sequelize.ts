import { Sequelize } from 'sequelize-typescript'

// DB_ENV is used soley to set the database config to "ci" for running
// tests on CI. This is because DB connection config is different between
// CI and local test envs. See db/config.json
const env = process.env.DB_ENV || process.env.NODE_ENV || 'development'

export let sequelize: Sequelize

if (env === 'production') {
  if (process.env.DATABASE_URL == null) {
    throw new Error('DATABASE_URL is null!')
  }

  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
  })
} else {
  const config = require(__dirname + '/../db/config.json')[env]

  sequelize = new Sequelize({
    repositoryMode: true,
    database: config.database,
    username: config.username,
    password: config.password,
    dialect: 'postgres',
    logging: process.env.NODE_ENV?.toUpperCase() !== 'TEST' && console.log,
    models: [__dirname + '/models'],
  })
}
