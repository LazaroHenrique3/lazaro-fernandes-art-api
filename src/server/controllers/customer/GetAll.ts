import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { CustomerProvider } from '../../database/providers/customer'

//Para tipar o body do request
interface IQueryProps {
    id?: number,
    page?: number,
    limit?: number,
    filter?: string,
    status?: string,
    genre?: string,
    dateOfBirth?: string
}

//Midleware
export const getAllValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(yup.object().shape({
        id: yup.number().integer().optional().default(0),
        page: yup.number().optional().moreThan(0),
        limit: yup.number().optional().moreThan(0),
        filter: yup.string().optional(),
        status: yup.string().optional(),
        genre: yup.string().optional(),
        dateOfBirth: yup.string().optional(),
    }))
}))

export const getAll = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
    const result = await CustomerProvider.getAll(req.query.page || 1, req.query.limit || 7, req.query.filter || '', req.query.status || '', req.query.genre || '', req.query.dateOfBirth || '', Number(req.query.id))
    const count = await CustomerProvider.count(req.query.filter, req.query.status || '', req.query.genre || '', req.query.dateOfBirth || '')

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