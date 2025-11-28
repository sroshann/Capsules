import express from 'express'
import { protectUserRoutes } from '../middleware/auth.middleware.js'
import { 
    
    addMedController, consumeMedController, createHomeController, 
    deleteMedController, getCHController, getPHController, 
    updateBSCHMDataCtrl
    
} from '../controller/home.controller.js'
const router = express()

// Create new home
router.post('/createHome', protectUserRoutes, createHomeController)

// Get created homes
router.get('/getCreatedHomes/:_id', protectUserRoutes, getCHController)

// Get data of particular home
router.get('/getParticularHome/:homeId', protectUserRoutes, getPHController)

// Adding medicine to home
router.post('/addMedicine', protectUserRoutes, addMedController)

// Consume medicine
router.put('/updateMedCount', protectUserRoutes, consumeMedController)

// Delete medicine
router.put('/deleteMedicine', protectUserRoutes, deleteMedController)

// Update description and address of a home
router.put('/updateDescOrAddress', protectUserRoutes, updateBSCHMDataCtrl)

export default router