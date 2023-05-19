import { Router } from 'express'

import { CategoryController } from './../controllers'

const router = Router()

router.get('/', (_, res) => res.send('Hello, world!'))

//category
router.get('/category', CategoryController.getAllValidation, CategoryController.getAll)
router.get('/category/:id', CategoryController.getByIdValidation, CategoryController.getById)
router.post('/category', CategoryController.createValidation, CategoryController.create)
router.put('/category/:id', CategoryController.updateByIdValidation, CategoryController.updateById)
router.delete('/category/:id', CategoryController.deleteByIdValidation, CategoryController.deleteById)

export { router }