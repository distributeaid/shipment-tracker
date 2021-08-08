import * as readline from 'readline'
import '../dist/loadEnv.js'
import { sequelize } from '../dist/sequelize.js'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question(
  'Synchronize database? This operation is destructive. [y/N]',
  async (answer) => {
    if (answer === 'y') {
      await sequelize.sync({ force: true })
      console.log('All models were synchronized successfully.')
    }
    rl.close()
  },
)
