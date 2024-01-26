import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { SaleProvider } from '../../database/providers/sale'

//Para tipar o body do request
interface IQueryProps {
    filter?: string
    status?: string
    orderDate?: string
    orderByPrice?: string
    paymentDueDate?: string
}

//Midleware
export const reportValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(yup.object().shape({
        filter: yup.string().optional(),
        status: yup.string().optional(),
        orderDate: yup.string().optional(),
        orderByPrice: yup.string().optional(),
        paymentDueDate: yup.string().optional()
    }))
})) 

export const report = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {

    const result = await SaleProvider.generatePDF(req.query.filter || '', req.query.status || '', req.query.orderDate || '', req.query.orderByPrice || '', req.query.paymentDueDate || '')

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: result.message }
        })
    } 

    return res.status(StatusCodes.OK).end(result)
}


  