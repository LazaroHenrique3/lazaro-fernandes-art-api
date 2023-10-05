import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { ITechnique } from '../../database/models'
import { TechniqueProvider } from '../../database/providers/technique'

//Para tipar o body do request
interface IBodyProps extends Omit<ITechnique, 'id'> {}

//Midleware
export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        status: yup.string().oneOf(['Ativo', 'Inativo']).required(),
        name: yup.string().required().min(3).max(100)
    }))
}))

export const create = async (req: Request<{}, {}, ITechnique>, res: Response) => {
    const result = await TechniqueProvider.create(req.body)

    if(result instanceof Error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.CREATED).json(result)
}