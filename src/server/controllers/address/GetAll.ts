import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { AddressProvider } from '../../database/providers/address'

//Para tipar o body do request
interface IQueryProps {
    id?: number,
    page?: number,
    limit?: number,
    showInative?: string,
    filter?: string
}

//Para tipar o param do request, garantindo que ele só liste seus próprios endereços
interface IParamProps {
    id?: number,
}

//Midleware
export const getAllValidation = validation((getSchema) => ({
    params: getSchema<IParamProps>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    })),
    query: getSchema<IQueryProps>(yup.object().shape({
        id: yup.number().integer().optional().default(0),
        page: yup.number().optional().moreThan(0),
        limit: yup.number().optional().moreThan(0),
        showInative: yup.string().optional(),
        filter: yup.string().optional()
    }))
}))

export const getAll = async (req: Request<IParamProps, {}, {}, IQueryProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado.'
            }
        })
    }

    const showInative: boolean = req.query.showInative === 'true'

    const result = await AddressProvider.getAll(req.query.page || 1, req.query.limit || 7, req.query.filter || '', Number(req.query.id), Number(req.params.id), showInative)
    const count = await AddressProvider.count(req.query.filter, Number(req.params.id), Number(req.params.id), showInative)

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: result.message }
        })
    } else if (count instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: count.message }
        })
    }

    res.setHeader('access-control-expose-headers', 'x-total-count')
    res.setHeader('x-total-count', count)

    return res.status(StatusCodes.OK).json(result)
}
 