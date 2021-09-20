import chalk from 'chalk'
import UserAccount from '../../src/models/user_account'
import { CommandDefinition } from './CommandDefinition'

export const usersCommand = (): CommandDefinition => ({
  command: 'users',
  action: async () => {
    const users = await UserAccount.findAll()
    for (const user of users) {
      const flags = []
      if (user.isAdmin) flags.push(chalk.bold.green('[admin]'))
      if (!user.isConfirmed) flags.push(chalk.magenta('[unconfirmed]'))
      console.log(
        chalk.gray(
          `- ${chalk.white(user.name)} <${chalk.blueBright(
            user.email,
          )}> ${flags.join(' ')}`,
        ),
      )
    }
  },
  help: 'List users',
})
