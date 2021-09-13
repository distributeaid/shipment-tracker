import { NextFunction, Request, Response } from 'express'

export const addVersion =
  (version: string) => (_: Request, res: Response, next: NextFunction) => {
    res.set('X-Shipment-Tracker-Backend-Version', version)
    next()
  }
