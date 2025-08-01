import express from 'express'
import { protectUserRoutes } from '../middleware/auth.middleware.js'
import { createHomeController } from '../controller/home.controller.js'
const router = express()

router.post('/createHome', protectUserRoutes, createHomeController)

export default router