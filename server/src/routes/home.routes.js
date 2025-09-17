import express from 'express'
import { protectUserRoutes } from '../middleware/auth.middleware.js'
import { createHomeController, getCHController, getPHController } from '../controller/home.controller.js'
const router = express()

// Create new home
router.post('/createHome', protectUserRoutes, createHomeController)

// Get created homes
router.get('/getCreatedHomes/:_id', protectUserRoutes, getCHController)

// Get data of particular home
router.get('/getParticularHome/:homeId', protectUserRoutes, getPHController)

export default router