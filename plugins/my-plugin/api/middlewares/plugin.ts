import { NextFunction, Request, Response } from "express"

export async function pluginMiddleware(req: Request, res: Response, next: NextFunction) {
    if(req.query.plugin == "true") next()
    else res.status(400).send("Plugin param not found")
}