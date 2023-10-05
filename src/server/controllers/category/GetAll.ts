import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { CategoryProvider } from '../../database/providers/category'

//Para tipar o body do request
interface IQueryProps {
    id?: number,
    page?: number,
    limit?: number,
    showInative?: string,
    filter?: string
}

//Midleware
export const getAllValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(yup.object().shape({
        id: yup.number().integer().optional().default(0),
        page: yup.number().optional().moreThan(0),
        limit: yup.number().optional().moreThan(0),
        showInative: yup.string().optional(),
        filter: yup.string().optional(),
    }))
}))

export const getAll = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
    const showInative: boolean = req.query.showInative === 'true'

    const result = await CategoryProvider.getAll(req.query.page || 1, req.query.limit || 7, req.query.filter || '', Number(req.query.id), showInative)
    const count = await CategoryProvider.count(req.query.filter, showInative)

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