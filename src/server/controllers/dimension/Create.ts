import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { IDimension } from '../../database/models'
import { DimensionProvider } from '../../database/providers/dimension'

//Para tipar o body do request
interface IBodyProps extends Omit<IDimension, 'id'> { }

//Midleware
export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        dimension: yup.string().required().min(3).max(20)
            .matches(/^\d+ x \d+ x \d+$/, 'Formato inválido. Use o formato: "20 x 30 x 3"')
    }))
}))

export const create = async (req: Request<{}, {}, IDimension>, res: Response) => {
    const result = await DimensionProvider.create(req.body)

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.CREATED).json(result)
}