import { Express, static as staticWebsite } from 'express'
import path from 'path'

/**
 * Host the frontend web application
 */
export const frontend = (app: Express) => {
  const root = path.join(process.cwd(), 'frontend', 'build')
  console.debug(`ℹ️ Frontend web application hosted from`, root)
  app.use(staticWebsite(root))
  // All other requests are handled by the index.html
  const spaIndex = path.join(root, 'index.html')
  app.get('*', (_, res) => {
    res.sendFile(spaIndex)
  })
}
