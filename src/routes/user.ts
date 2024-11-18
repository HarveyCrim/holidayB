import express from 'express'
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../controllers/user'
import { validateUser } from '../middleware/auth'

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/validate", validateUser, getCurrentUser)
router.put("/logout", validateUser, logoutUser)
export default router