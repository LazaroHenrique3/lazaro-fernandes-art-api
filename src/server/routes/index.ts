import { Router } from 'express'

import { CategoryController, TechniqueController, AdministratorController, AccessRolesController} from './../controllers'
import { ensureAuthenticated, ensureAdminLevelAccess } from '../shared/middleware'

const router = Router()

router.get('/', (_, res) => res.send('Hello, world!'))

//Private routes
//--administrator
router.get('/administrator', ensureAuthenticated, ensureAdminLevelAccess([1,2,3,4,5]),  AdministratorController.getAllValidation, AdministratorController.getAll)
router.get('/administrator/:id', ensureAuthenticated, ensureAdminLevelAccess([1,2,3,4,5]), AdministratorController.getByIdValidation, AdministratorController.getById)
router.post('/administrator', ensureAuthenticated, ensureAdminLevelAccess([1,2,3,4,5]), AdministratorController.createValidation, AdministratorController.create)
router.delete('/administrator/:id', ensureAuthenticated, ensureAdminLevelAccess([1,2,3,4,5]), AdministratorController.deleteByIdValidation, AdministratorController.deleteById)
router.put('/administrator/:id', ensureAuthenticated, ensureAdminLevelAccess([1,2,3,4,5]), AdministratorController.updateByIdValidation, AdministratorController.updateById)

//--AccessRoles
router.get('/accessroles', ensureAuthenticated, ensureAdminLevelAccess([1,2,3,4,5]),  AccessRolesController.getAllValidation, AccessRolesController.getAll)

//--category
router.get('/category', ensureAuthenticated, ensureAdminLevelAccess([1,2,3,4,5]), CategoryController.getAllValidation, CategoryController.getAll)
router.get('/category/:id', ensureAuthenticated, ensureAdminLevelAccess([1,2,3,4,5]), CategoryController.getByIdValidation, CategoryController.getById)
router.post('/category', ensureAuthenticated, ensureAdminLevelAccess([1,2,3,4,5]), CategoryController.createValidation, CategoryController.create)
router.put('/category/:id', ensureAuthenticated, ensureAdminLevelAccess([1,2,3,4,5]), CategoryController.updateByIdValidation, CategoryController.updateById)
router.delete('/category/:id', ensureAuthenticated, ensureAdminLevelAccess([1,2,3,4,5]), CategoryController.deleteByIdValidation, CategoryController.deleteById)

//--technique
router.get('/technique', ensureAuthenticated, ensureAdminLevelAccess([1,2,3,4,5]), TechniqueController.getAllValidation, TechniqueController.getAll)
router.get('/technique/:id', ensureAuthenticated, ensureAdminLevelAccess([1,2,3,4,5]), TechniqueController.getByIdValidation, TechniqueController.getById)
router.post('/technique', ensureAuthenticated, ensureAdminLevelAccess([1,2,3,4,5]), TechniqueController.createValidation, TechniqueController.create)
router.put('/technique/:id', ensureAuthenticated, ensureAdminLevelAccess([1,2,3,4,5]), TechniqueController.updateByIdValidation, TechniqueController.updateById)
router.delete('/technique/:id', ensureAuthenticated, ensureAdminLevelAccess([1,2,3,4,5]), TechniqueController.deleteByIdValidation, TechniqueController.deleteById)

//Public routes
//--Administator
router.post('/adminsignin', AdministratorController.signInValidation, AdministratorController.signIn)

export { router }