import { Router } from 'express'

import {
    CategoryController,
    TechniqueController,
    AdministratorController,
    AccessRolesController,
    CustomerController,
    AddressController,
} from './../controllers'

import { UploadImages } from '../shared/services/UploadImagesServices'

import { ensureAuthenticated, ensureAccess } from '../shared/middleware'

const router = Router()

router.get('/', (_, res) => res.send('Hello, world!'))

//Private routes
//--administrator
router.get('/administrator', ensureAuthenticated, ensureAccess(['admin'], [1, 2, 3, 4, 5]), AdministratorController.getAllValidation, AdministratorController.getAll)
router.get('/administrator/:id', ensureAuthenticated, ensureAccess(['admin'], [1, 2, 3, 4, 5]), AdministratorController.getByIdValidation, AdministratorController.getById)
router.post('/administrator', ensureAuthenticated, ensureAccess(['admin'], [1, 2, 3, 4, 5]), AdministratorController.createValidation, AdministratorController.create)
router.delete('/administrator/:id', ensureAuthenticated, ensureAccess(['admin'], [1, 2, 3, 4, 5]), AdministratorController.deleteByIdValidation, AdministratorController.deleteById)
router.put('/administrator/:id', ensureAuthenticated, ensureAccess(['admin'], [1, 2, 3, 4, 5]), AdministratorController.updateByIdValidation, AdministratorController.updateById)

//--AccessRoles
router.get('/accessroles', ensureAuthenticated, ensureAccess(['admin'], [1, 2, 3, 4, 5]), AccessRolesController.getAllValidation, AccessRolesController.getAll)

//--category
router.get('/category', ensureAuthenticated, ensureAccess(['admin'], [1, 2, 3, 4, 5]), CategoryController.getAllValidation, CategoryController.getAll)
router.get('/category/:id', ensureAuthenticated, ensureAccess(['admin'], [1, 2, 3, 4, 5]), CategoryController.getByIdValidation, CategoryController.getById)
router.post('/category', ensureAuthenticated, ensureAccess(['admin'], [1, 2, 3, 4, 5]), CategoryController.createValidation, CategoryController.create)
router.put('/category/:id', ensureAuthenticated, ensureAccess(['admin'], [1, 2, 3, 4, 5]), CategoryController.updateByIdValidation, CategoryController.updateById)
router.delete('/category/:id', ensureAuthenticated, ensureAccess(['admin'], [1, 2, 3, 4, 5]), CategoryController.deleteByIdValidation, CategoryController.deleteById)

//--technique
router.get('/technique', ensureAuthenticated, ensureAccess(['admin'], [1, 2, 3, 4, 5]), TechniqueController.getAllValidation, TechniqueController.getAll)
router.get('/technique/:id', ensureAuthenticated, ensureAccess(['admin'], [1, 2, 3, 4, 5]), TechniqueController.getByIdValidation, TechniqueController.getById)
router.post('/technique', ensureAuthenticated, ensureAccess(['admin'], [1, 2, 3, 4, 5]), TechniqueController.createValidation, TechniqueController.create)
router.put('/technique/:id', ensureAuthenticated, ensureAccess(['admin'], [1, 2, 3, 4, 5]), TechniqueController.updateByIdValidation, TechniqueController.updateById)
router.delete('/technique/:id', ensureAuthenticated, ensureAccess(['admin'], [1, 2, 3, 4, 5]), TechniqueController.deleteByIdValidation, TechniqueController.deleteById)


//--Address
router.post('/address/:id', ensureAuthenticated, ensureAccess(['customer']),  AddressController.createValidation,  AddressController.create)
router.get('/address/:id', ensureAuthenticated, ensureAccess(['customer']),  AddressController.getAllValidation,  AddressController.getAll)
router.get('/address/:id/:idAdr', ensureAuthenticated, ensureAccess(['customer']),  AddressController.getByIdValidation,  AddressController.getById)
router.delete('/address/:id/:idAdr', ensureAuthenticated, ensureAccess(['customer']),  AddressController.deleteByIdValidation,  AddressController.deleteById)

//--Customer
router.get('/customer', ensureAuthenticated, ensureAccess(['admin'], [1, 5]), CustomerController.getAllValidation,  CustomerController.getAll)
router.get('/customer/:id', ensureAuthenticated, ensureAccess(['customer', 'admin'], [1, 5]), CustomerController.getByIdValidation,  CustomerController.getById)
router.put('/customer/:id', ensureAuthenticated, ensureAccess(['customer', 'admin'], [1, 5]), CustomerController.updateByIdValidation,  CustomerController.updateById)
router.put('/customer/updateimage/:id', ensureAuthenticated, ensureAccess(['customer', 'admin'], [1, 5]), UploadImages.handleFileImage.single('image'), CustomerController.updateImageByIdValidation,  CustomerController.updateImageById)//TODO
router.delete('/customer/:id', ensureAuthenticated, ensureAccess(['customer', 'admin'], [1, 5]),  CustomerController.deleteByIdValidation,  CustomerController.deleteById)
router.delete('/customer/deleteimage/:id', ensureAuthenticated, ensureAccess(['customer', 'admin'], [1, 5]), CustomerController.deleteImageByIdValidation,  CustomerController.deleteImageById)

//Public routes
//--Administator
router.post('/adminsignin', AdministratorController.signInValidation, AdministratorController.signIn)

//--customer
router.post('/customersignin', CustomerController.signInValidation, CustomerController.signIn)
//router.post('/customer', UploadController.storage.single('image'), CustomerController.createValidation,  CustomerController.create)
router.post('/customer', UploadImages.handleFileImage.single('image'), CustomerController.createValidation, CustomerController.create)


export { router }