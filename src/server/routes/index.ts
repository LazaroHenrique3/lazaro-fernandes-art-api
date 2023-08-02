import { Router } from 'express'

import {
    CategoryController,
    TechniqueController,
    DimensionController,
    ProductController,
    AdministratorController,
    CustomerController,
    AddressController,
} from './../controllers'

import { UploadImages } from '../shared/services/UploadImagesServices'

import { ensureAuthenticated, ensureAccess } from '../shared/middleware'

const router = Router()

router.get('/', (_, res) => res.send('Hello, world!'))

//Private routes
//--administrator
router.get('/administrator', ensureAuthenticated, ensureAccess(['admin']), AdministratorController.getAllValidation, AdministratorController.getAll)
router.get('/administrator/:id', ensureAuthenticated, ensureAccess(['admin'], true), AdministratorController.getByIdValidation, AdministratorController.getById)
router.post('/administrator', ensureAuthenticated, ensureAccess(['admin']), AdministratorController.createValidation, AdministratorController.create)
router.delete('/administrator/:id', ensureAuthenticated, ensureAccess(['admin'], true), AdministratorController.deleteByIdValidation, AdministratorController.deleteById)
router.put('/administrator/:id', ensureAuthenticated, ensureAccess(['admin'], true), AdministratorController.updateByIdValidation, AdministratorController.updateById)
router.get('/administrator/report/generate', ensureAuthenticated, ensureAccess(['admin']), AdministratorController.reportValidation, AdministratorController.report)

//--category
router.get('/category', ensureAuthenticated, ensureAccess(['admin']), CategoryController.getAllValidation, CategoryController.getAll)
router.get('/category/:id', ensureAuthenticated, ensureAccess(['admin']), CategoryController.getByIdValidation, CategoryController.getById)
router.post('/category', ensureAuthenticated, ensureAccess(['admin']), CategoryController.createValidation, CategoryController.create)
router.put('/category/:id', ensureAuthenticated, ensureAccess(['admin']), CategoryController.updateByIdValidation, CategoryController.updateById)
router.delete('/category/:id', ensureAuthenticated, ensureAccess(['admin']), CategoryController.deleteByIdValidation, CategoryController.deleteById)
router.get('/category/report/generate', ensureAuthenticated, ensureAccess(['admin']), CategoryController.reportValidation, CategoryController.report)

//--technique
router.get('/technique', ensureAuthenticated, ensureAccess(['admin']), TechniqueController.getAllValidation, TechniqueController.getAll)
router.get('/technique/:id', ensureAuthenticated, ensureAccess(['admin']), TechniqueController.getByIdValidation, TechniqueController.getById)
router.post('/technique', ensureAuthenticated, ensureAccess(['admin']), TechniqueController.createValidation, TechniqueController.create)
router.put('/technique/:id', ensureAuthenticated, ensureAccess(['admin']), TechniqueController.updateByIdValidation, TechniqueController.updateById)
router.delete('/technique/:id', ensureAuthenticated, ensureAccess(['admin']), TechniqueController.deleteByIdValidation, TechniqueController.deleteById)
router.get('/technique/report/generate', ensureAuthenticated, ensureAccess(['admin']), TechniqueController.reportValidation, TechniqueController.report)

//--dimension
router.get('/dimension', ensureAuthenticated, ensureAccess(['admin']), DimensionController.getAllValidation, DimensionController.getAll)
router.get('/dimension/:id', ensureAuthenticated, ensureAccess(['admin']), DimensionController.getByIdValidation, DimensionController.getById)
router.post('/dimension', ensureAuthenticated, ensureAccess(['admin']), DimensionController.createValidation, DimensionController.create)
router.put('/dimension/:id', ensureAuthenticated, ensureAccess(['admin']), DimensionController.updateByIdValidation, DimensionController.updateById)
router.delete('/dimension/:id', ensureAuthenticated, ensureAccess(['admin']), DimensionController.deleteByIdValidation, DimensionController.deleteById)
router.get('/dimension/report/generate', ensureAuthenticated, ensureAccess(['admin']), DimensionController.reportValidation,  DimensionController.report)

//--product
router.post('/product', UploadImages.handleFileImage.fields([{ name: 'main_image', maxCount: 1 }, { name: 'product_images', maxCount: 4 }]), ProductController.createValidation, ProductController.create)
router.put('/product/:id', ensureAuthenticated, ensureAccess(['admin']), ProductController.updateByIdValidation, ProductController.updateById)
router.post('/product/insertimage/:idProduct', ensureAuthenticated, ensureAccess(['admin']), UploadImages.handleFileImage.single('image'), ProductController.insertImageValidation, ProductController.insertImage)
router.put('/product/updateimage/:id/:idProduct', ensureAuthenticated, ensureAccess(['admin']), UploadImages.handleFileImage.single('image'), ProductController.updateImageByIdValidation, ProductController.updateImageById)
router.put('/product/updatemainimage/:id', ensureAuthenticated, ensureAccess(['admin']), UploadImages.handleFileImage.single('image'), ProductController.updateMainImageByIdValidation, ProductController.updateMainImageById)
router.delete('/product/:id', ensureAuthenticated, ensureAccess(['admin']), ProductController.deleteByIdValidation, ProductController.deleteById)
router.delete('/product/deleteimage/:id/:idProduct', ensureAuthenticated, ensureAccess(['admin']), ProductController.deleteImageByIdValidation, ProductController.deleteImageById)
router.get('/product/report/generate', ensureAuthenticated, ensureAccess(['admin']), ProductController.reportValidation,  ProductController.report)

//--Address
router.get('/address/:id', ensureAuthenticated, ensureAccess(['customer']), AddressController.getAllValidation, AddressController.getAll)
router.get('/address/:id/:idAdr', ensureAuthenticated, ensureAccess(['customer', 'admin']), AddressController.getByIdValidation, AddressController.getById)
router.post('/address/:id', ensureAuthenticated, ensureAccess(['customer']), AddressController.createValidation, AddressController.create)
router.put('/address/:id/:idAdr', ensureAuthenticated, ensureAccess(['customer', 'admin']), AddressController.updateByIdValidation, AddressController.updateById)
router.delete('/address/:id/:idAdr', ensureAuthenticated, ensureAccess(['customer']), AddressController.deleteByIdValidation, AddressController.deleteById)

//--Customer
router.get('/customer', ensureAuthenticated, ensureAccess(['admin']), CustomerController.getAllValidation, CustomerController.getAll)
router.get('/customer/:id', ensureAuthenticated, ensureAccess(['customer', 'admin']), CustomerController.getByIdValidation, CustomerController.getById)
router.put('/customer/:id', ensureAuthenticated, ensureAccess(['customer', 'admin']), CustomerController.updateByIdValidation, CustomerController.updateById)
router.put('/customer/updateimage/:id', ensureAuthenticated, ensureAccess(['customer', 'admin']), UploadImages.handleFileImage.single('image'), CustomerController.updateImageByIdValidation, CustomerController.updateImageById)//TODO
router.delete('/customer/:id', ensureAuthenticated, ensureAccess(['customer', 'admin']), CustomerController.deleteByIdValidation, CustomerController.deleteById)
router.delete('/customer/deleteimage/:id', ensureAuthenticated, ensureAccess(['customer', 'admin']), CustomerController.deleteImageByIdValidation, CustomerController.deleteImageById)

//Public routes
//--Products
router.get('/product', ProductController.getAllValidation, ProductController.getAll)
router.get('/product/:id', ProductController.getByIdValidation, ProductController.getById)

//--Administator
router.post('/adminsignin', AdministratorController.signInValidation, AdministratorController.signIn)

//--Customer
router.post('/customersignin', CustomerController.signInValidation, CustomerController.signIn)
router.post('/customer', UploadImages.handleFileImage.single('image'), CustomerController.createValidation, CustomerController.create)
router.post('/customer/forgotpassword', CustomerController.forgotPasswordValidation, CustomerController.forgotPassword)
router.post('/customer/redefinepassword', CustomerController.redefinePasswordValidation, CustomerController.redefinePassword)

export { router }