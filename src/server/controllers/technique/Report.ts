import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { TechniqueProvider } from '../../database/providers/technique'

//Para tipar o body do request
interface IQueryProps {
    filter?: string
}

//Midleware
export const reportValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(yup.object().shape({
        filter: yup.string().optional()
    }))
})) 

export const report = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
    const result = await TechniqueProvider.generatePDF(req.query.filter || '')

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: result.message }
        })
    } 

    return res.status(StatusCodes.OK).end(result)
}


  