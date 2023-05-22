import { Router } from 'express'

import { CategoryController, TechniqueController } from './../controllers'

const router = Router()

router.get('/', (_, res) => res.send('Hello, world!'))

//category
router.get('/category', CategoryController.getAllValidation, CategoryController.getAll)
router.get('/category/:id', CategoryController.getByIdValidation, CategoryController.getById)
router.post('/category', CategoryController.createValidation, CategoryController.create)
router.put('/category/:id', CategoryController.updateByIdValidation, CategoryController.updateById)
router.delete('/category/:id', CategoryController.deleteByIdValidation, CategoryController.deleteById)

//technique
router.get('/technique', TechniqueController.getAllValidation, TechniqueController.getAll)
router.get('/technique/:id', TechniqueController.getByIdValidation, TechniqueController.getById)
router.post('/technique', TechniqueController.createValidation, TechniqueController.create)
router.put('/technique/:id', TechniqueController.updateByIdValidation, TechniqueController.updateById)
router.delete('/technique/:id', TechniqueController.deleteByIdValidation, TechniqueController.deleteById)

export { router }