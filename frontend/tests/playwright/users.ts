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
  userA: {
    user: false,
    email: chance.email({ domain: 'example.com' }),
    password: `U${v4()}!`,
    name: chance.name({ middle: true }),
    stateFile: path.join(
      process.cwd(),
      'test-session',
      'authenticated-userA.json',
    ),
    infoFile: path.join(process.cwd(), 'test-session', 'userA.json'),
  },
  userB: {
    user: false,
    email: chance.email({ domain: 'example.com' }),
    password: `U${v4()}!`,
    name: chance.name({ middle: true }),
    stateFile: path.join(
      process.cwd(),
      'test-session',
      'authenticated-userB.json',
    ),
    infoFile: path.join(process.cwd(), 'test-session', 'userB.json'),
  },
} as const
