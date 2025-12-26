import express from 'express'
import { changePasswordController, getUserDataController, loginController, 
    logoutController, mailOTPController, signupController, 
    updateProfileController, validateOTPController } 
    from '../controller/auth.controller.js'
import { protectUserRoutes } from '../middleware/auth.middleware.js'
const router = express()

// Signup
router.post('/signup', signupController)

// Login
router.post('/login', loginController)

// Logout
router.get('/logout/:userId', protectUserRoutes, logoutController)

// Get user data on data loss
router.get('/getUserData', getUserDataController)

// Email OTP
router.post('/mailOTP', mailOTPController)

// Validate OTP
router.post('/validateOTP', validateOTPController)

// Change password
router.post('/changePassword', changePasswordController)

// Update profile
router.put('/updateProfile', protectUserRoutes, updateProfileController)

export default router