import { PrismaClient } from '@prisma/client'
import {Request, Response} from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userSchema, loginSchema } from '../utils/zod_types'
export const registerUser = async (req:Request, res:Response) => {
    const prisma = new PrismaClient()
    try{
        const {success} = userSchema.safeParse(req.body)
        if(!success){
            res.sendStatus(400)
        }
        const user = await prisma.user.findFirst({
            where: {
                email: req.body.email
            }
        })
        if(user){
             res.status(401).json({message: "user already exists"})
        }
        else{
            const body = req.body
            const {password} = body
            delete body["password"]
            const passwordHash = bcrypt.hashSync(password, 10)
            await prisma.user.create({
                data:{
                    ...body,
                    password: passwordHash
                }
            })
            res.status(200).json({message: "created user successfully"})
        }
    }
    catch(err){
            res.status(500).json({message: "internal error"})
    }
    finally{
        prisma.$disconnect()
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const prisma = new PrismaClient()
    try{
        const {success} = loginSchema.safeParse(req.body)
        if(!success){
            res.sendStatus(400)
        }
        const user = await prisma.user.findFirst({
            where:{
                email: req.body.email,
            }
        })
        if(user){
            const match = bcrypt.compareSync(req.body.password, user.password)
            if(!match){
                res.sendStatus(401)
            }
            else{
                const token = jwt.sign({id: user.id}, process.env.JWT_SECRET as string, {
                    expiresIn: "1d"
                })
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "prod",
                    maxAge: 86400000
            
                })
                res.status(200).json({message: "logged in successfully"})
            }
        }
        else{
            res.sendStatus(401)
        }
    }
    catch(err){
        res.sendStatus(500)
    }
    finally{
        prisma.$disconnect()
    }
}

export const getCurrentUser = async (req: Request, res: Response) => {
        console.log("print")
        res.json({userId: res.locals.userId})
}

export const logoutUser = async (req: Request, res: Response) => {
    console.log("logout")
    res.cookie("token","", {
        maxAge:1
    })
    req.userId = undefined
    res.status(200).json({message: "logged out"})
}