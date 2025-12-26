import express from 'express'
import { protectUserRoutes } from '../middleware/auth.middleware.js'
import { 
    
    addMedController, consumeMedController, createHomeController, 
    deleteMedController, getAllHomeCtrl, getCHController, getPHController, 
    removeMemberCtrl, sendRequestCtrl, updateAddressCtrl, updateHomeDescCtrl,
    validateUsrAcsReCtrl
    
} from '../controller/home.controller.js'
const router = express()

// Create new home
router.post('/createHome', protectUserRoutes, createHomeController)

// Get created homes
router.get('/getCreatedHomes', protectUserRoutes, getCHController)

// Get data of particular home
router.get('/getParticularHome/:homeId', protectUserRoutes, getPHController)

// Adding medicine to home
router.post('/addMedicine', protectUserRoutes, addMedController)

// Consume medicine
router.put('/updateMedCount', protectUserRoutes, consumeMedController)

// Delete medicine
router.put('/deleteMedicine', protectUserRoutes, deleteMedController)

// Update description of a home
router.put('/updateHomeDesc', protectUserRoutes, updateHomeDescCtrl)

// Update address of a home
router.put('/updateAddress', protectUserRoutes, updateAddressCtrl)

// Get all homes for finding other homes
router.get('/getAllHomes', protectUserRoutes, getAllHomeCtrl)

// Sending home access request
router.post('/sendRequset', protectUserRoutes, sendRequestCtrl)

// Validating user access requests
router.put('/validateAccessReqeust', protectUserRoutes, validateUsrAcsReCtrl)

// Removing member of a home
router.put('/removeMember', protectUserRoutes, removeMemberCtrl)

export default router