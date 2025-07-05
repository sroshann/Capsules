import express from 'express'
import { changePasswordController, getUserDataController, loginController, 
    logoutController, mailOTPController, signupController, validateOTPController } 
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

// Email OTP
router.post('/mailOTP', mailOTPController)

// Validate OTP
router.post('/validateOTP', validateOTPController)

// Change password
router.post('/changePassword', changePasswordController)

export default router