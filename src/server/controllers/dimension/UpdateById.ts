import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { IDimension } from '../../database/models'
import { DimensionProvider } from '../../database/providers/dimension'


interface IParamProps {
    id?: number;
}

interface IBodyProps extends Omit<IDimension, 'id'> { }

//Midleware
export const updateByIdValidation = validation(getSchema => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        dimension: yup.string().required().min(3).max(20)
            .matches(/^\d+ x \d+ x \d+$/, 'Formato inválido. Use o formato: "20 x 30 x 3"')
    })),
    params: getSchema<IParamProps>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    }))
}))

export const updateById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado.'
            }
        })
    }

    const result = await DimensionProvider.updateById(req.params.id, req.body)
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.NO_CONTENT).send(result)
}