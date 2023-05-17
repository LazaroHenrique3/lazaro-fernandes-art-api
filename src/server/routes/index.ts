import { Router } from 'express'

import { CategoryController } from './../controllers'

const router = Router()

router.get('/', (_, res) => res.send('Hello, world!'))

//category
router.post(
    '/category',
    CategoryController.createValidation,
    CategoryController.create)


export { router }