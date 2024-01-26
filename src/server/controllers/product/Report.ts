import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { ProductProvider } from '../../database/providers/product'

//Para tipar o body do request
interface IQueryProps {
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
export const reportValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(yup.object().shape({
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

export const report = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
    const result = await ProductProvider.generatePDF(
        req.query.filter || '',
        req.query.status || '',
        req.query.type || '',
        req.query.orientation || '',
        req.query.category || '',
        req.query.technique || '',
        req.query.dimension || '',
        req.query.productionDate || '',
        req.query.orderByPrice || '',
    )

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: result.message }
        })
    } 

    return res.status(StatusCodes.OK).end(result)
}


  