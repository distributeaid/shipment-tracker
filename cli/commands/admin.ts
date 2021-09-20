import chalk from 'chalk'
import UserAccount from '../../src/models/user_account'
import { CommandDefinition } from './CommandDefinition'

export const adminCommand = (): CommandDefinition => ({
  command: 'admin <email>',
  options: [
    {
      flags: '-d, --demote',
      description: `Remove admin permissions from user`,
    },
  ],
  action: async (email, { demote }) => {
    const makeAdmin = demote === undefined ? true : false
    const user = await UserAccount.findOneByEmail(email)
    if (user === null)
      throw new Error(`Could not find user with email ${email}!`)

    if (user.isAdmin && makeAdmin)
      throw new Error(`User ${email} is already admin!`)

    if (!user.isAdmin && !makeAdmin)
      throw new Error(`User ${email} is not admin!`)

    await user.update({ isAdmin: makeAdmin })
    if (makeAdmin) {
      console.log(
        chalk.white(`Admin permissions granted to ${chalk.blueBright(email)}!`),
      )
    } else {
      console.log(
        chalk.white(
          `Admin permissions ${chalk.redBright(
            'removed from',
          )} ${chalk.blueBright(email)}!`,
        ),
      )
    }
  },
  help: 'Grant admin permissions to the user with the given email.',
})
