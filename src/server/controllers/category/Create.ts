import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { ICategory } from '../../database/models'

//Para tipar o body do request
interface IBodyProps extends Omit<ICategory, 'id'> {}

//Midleware
export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        name: yup.string().required().min(3)
    }))
}))

export const create = async (req: Request<{}, {}, ICategory>, res: Response) => {
 
    return res.status(StatusCodes.CREATED).json(1)
}