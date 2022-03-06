import Chance from 'chance'
import * as path from 'path'
import { v4 } from 'uuid'

const chance = new Chance()

export const users = {
  admin: {
    email: chance.email({ domain: 'admin.example.com' }),
    password: `U${v4()}!`,
    name: chance.name({ middle: true }),
    stateFile: path.join(
      process.cwd(),
      'test-session',
      'authenticated-admin.json',
    ),
    infoFile: path.join(process.cwd(), 'test-session', 'admin.json'),
  },
  user: {
    user: false,
    email: chance.email({ domain: 'example.com' }),
    password: `U${v4()}!`,
    name: chance.name({ middle: true }),
    stateFile: path.join(
      process.cwd(),
      'test-session',
      'authenticated-user.json',
    ),
    infoFile: path.join(process.cwd(), 'test-session', 'user.json'),
  },
} as const
