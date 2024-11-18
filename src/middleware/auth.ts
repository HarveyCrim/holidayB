import { NextFunction, Request, Response } from "express";
import jwt, {JwtPayload} from 'jsonwebtoken'

declare global {
    namespace Express {
        interface Request {
            userId: string | undefined
        }
    }
}

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["token"]
    if(!token){
        console.log("failed")
        res.json({userId: null})
    }
    else{
        try{
            const user = jwt.verify(token, process.env.JWT_SECRET as string)
            res.locals.userId = (user as JwtPayload).id
            next()
        }
        catch(err){
            res.sendStatus(401)
        }
    }
}