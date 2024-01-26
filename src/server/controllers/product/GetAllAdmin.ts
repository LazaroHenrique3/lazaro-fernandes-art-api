import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { ProductProvider } from '../../database/providers/product'

//Para tipar o body do request
interface IQueryProps {
    id?: number,
    page?: number,
    limit?: number,
    filter?: string,
    status?: string,
    type?: string,
    orientation?: string,
    category?: string,
    technique?: string,
    dimension?: string,
    productionDate?: string,
    orderByPrice?: string
}

//Midleware
export const getAllAdminValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(yup.object().shape({
        id: yup.number().integer().optional().default(0),
        page: yup.number().optional().moreThan(0),
        limit: yup.number().optional().moreThan(0),
        filter: yup.string().optional(),
        status: yup.string().optional(),
        type: yup.string().optional(),
        orientation: yup.string().optional(),
        category: yup.string().optional(),
        technique: yup.string().optional(),
        dimension: yup.string().optional(),
        productionDate: yup.string().optional(),
        orderByPrice: yup.string().optional()
    }))
}))

export const getAllAdmin = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
    const result = await ProductProvider.getAllAdmin(
        req.query.page || 1, 
        req.query.limit || 7, 
        req.query.filter || '', 
        req.query.status || '',
        req.query.type || '',
        req.query.orientation || '',
        req.query.category || '',
        req.query.technique || '',
        req.query.dimension || '',
        req.query.productionDate || '',
        req.query.orderByPrice || '',
        Number(req.query.id)
    )
    const count = await ProductProvider.countAdmin(
        req.query.filter || '',
        req.query.status || '',
        req.query.type || '',
        req.query.orientation || '',
        req.query.category || '',
        req.query.technique || '',
        req.query.dimension || '',
        req.query.productionDate || ''
    )

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