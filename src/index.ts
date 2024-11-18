import express from 'express'
import cors from 'cors'
import userRouter from './routes/user'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({
    extended: true
}))
console.log(process.env.FRONTEND_URL)
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials: true
}))
app.use("/user", userRouter)
app.listen(process.env.PORT, () => {
    console.log("listening")
})