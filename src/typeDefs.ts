import { readFileSync } from 'fs'

const typeDefs = readFileSync('./schema.graphql').toString('utf-8')

export default typeDefs
