import chalk from 'chalk'
import { program } from 'commander'
import * as fs from 'fs'
import * as path from 'path'
import '../src/sequelize'
import { adminCommand } from './commands/admin'
import { usersCommand } from './commands/users'

const version = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'),
).version

program.description(
  `Distribute Aid Shipment Tracker ${version} Command Line Interface`,
)
program.version(version)
program.addHelpText(
  'after',
  `
See ./docs/cli.md for more information.`,
)

const commands = [usersCommand(), adminCommand()]

let ran = false
commands.forEach(({ command, action, help, options }) => {
  const cmd = program.command(command)
  cmd.action(async (...args) => {
    try {
      ran = true
      await action(...args)
    } catch (error) {
      console.error(
        chalk.red.inverse(' ERROR '),
        chalk.red(`${command} failed!`),
      )
      console.error(chalk.red.inverse(' ERROR '), chalk.red(error))
      process.exit(1)
    }
  })
  if (options) {
    options.forEach(({ flags, description, defaultValue }) =>
      cmd.option(flags, description, defaultValue),
    )
  }
})

program.parse(process.argv)

if (!ran) {
  program.help()
  throw new Error('No command selected!')
}
