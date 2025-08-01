import express from 'express'
import { protectUserRoutes } from '../middleware/auth.middleware.js'
import { createHomeController, getCHController } from '../controller/home.controller.js'
const router = express()

// Create new home
router.post('/createHome', protectUserRoutes, createHomeController)

// Get created homes
router.get('/getCreatedHomes', protectUserRoutes, getCHController)

export default router