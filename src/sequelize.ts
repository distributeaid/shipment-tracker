import path from 'path'
import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import Group from './models/group'
import LineItem from './models/line_item'
import Offer from './models/offer'
import Pallet from './models/pallet'
import Shipment from './models/shipment'
import ShipmentExport from './models/shipment_export'
import ShipmentReceivingHub from './models/shipment_receiving_hub'
import ShipmentSendingHub from './models/shipment_sending_hub'
import UserAccount from './models/user_account'
import VerificationToken from './models/verification_token'

const debug = (...args: any[]) =>
  process.env.SEQUELIZE_DEBUG !== undefined && console.debug(...args)

// DB_ENV is used soley to set the database config to "ci" for running
// tests on CI. This is because DB connection config is different between
// CI and local test envs. See db/config.json
const env = process.env.DB_ENV || process.env.NODE_ENV || 'development'
debug(`sequelize env`, env)
const sequelizeConfig = path.join(process.cwd(), 'db', 'config.json')
debug(`sequelize config`, sequelizeConfig)
const config = require(sequelizeConfig)[env]
debug(`sequelize config loaded`, config)

export let sequelize: Sequelize

const COMMON_CONFIG: Partial<SequelizeOptions> = {
  models: [path.join(process.cwd(), 'dist', 'src', 'models')],
  dialect: 'postgres',
  protocol: 'postgres',
}

if (config.use_env_variable !== undefined) {
  debug(`sequelize env variable`, config.use_env_variable)
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
    logging: debug,
  })
}

sequelize.addModels([
  UserAccount,
  VerificationToken,
  Group,
  LineItem,
  Offer,
  Pallet,
  ShipmentExport,
  ShipmentReceivingHub,
  ShipmentSendingHub,
  Shipment,
])
