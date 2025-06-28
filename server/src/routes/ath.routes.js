import express from 'express'
import { getUserDataController, loginController, logoutController, signupController } 
    from '../controller/auth.controller.js'
const router = express()

// Signup
router.post('/signup', signupController)

// Login
router.post('/login', loginController)

// Logout
router.get('/logout', logoutController)

// Get user data on data loss
router.get('/getUserData', getUserDataController)

export default router