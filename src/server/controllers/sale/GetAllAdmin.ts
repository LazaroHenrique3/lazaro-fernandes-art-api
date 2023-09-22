import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { SaleProvider } from '../../database/providers/sale'

//Para tipar o body do request
interface IQueryProps {
    page?: number,
    limit?: number,
    filter?: string
}

//Midleware
export const getAllAdminValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(yup.object().shape({
        page: yup.number().optional().moreThan(0),
        limit: yup.number().optional().moreThan(0),
        filter: yup.string().optional()
    }))
}))

export const getAllAdmin = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
  
    const result = await SaleProvider.getAllAdmin(req.query.page || 1, req.query.limit || 7, req.query.filter || '')
    const count = await SaleProvider.countAdmin(req.query.filter)

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
 