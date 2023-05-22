import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { ICategory } from '../../database/models'
import { CategoryProvider } from '../../database/providers/category'

//Para tipar o body do request
interface IBodyProps extends Omit<ICategory, 'id'> {}

//Midleware
export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        name: yup.string().required().min(3).max(100)
    }))
}))

export const create = async (req: Request<{}, {}, ICategory>, res: Response) => {
    const result = await CategoryProvider.create(req.body)

    if(result instanceof Error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.CREATED).json(result)
}