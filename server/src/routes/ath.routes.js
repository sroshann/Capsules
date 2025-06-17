import express from 'express'
import { signupController } from '../controller/auth.controller.js'
const router = express()

router.post('/signup', signupController)

export default router