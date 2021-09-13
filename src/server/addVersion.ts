import { NextFunction, Request, Response } from 'express'

export const addVersion =
  (version: string) => (_: Request, res: Response, next: NextFunction) => {
    res.header('X-Shipment-Tracker-Backend-Version', version)
    next()
  }
