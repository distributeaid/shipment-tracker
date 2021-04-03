import dotenv from 'dotenv'

// Load the env vars before initializing code that depends on them
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}
