import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'

const router = Router()

router.get('/', (_, res) => res.send('Hello, world!'))
router.get('/teste', (req, res) => {
    console.log(req.body)

    return res.status(StatusCodes.UNAUTHORIZED).json({msg: 'Bom demaize'})
})


export { router }