import { Request, RequestHandler, Response } from 'express'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'

//Para tipar o body do request
interface ICategory {
    name: string
}

interface IFilter {
    filter?: string;
}

//Midleware
export const createValidation = validation((getSchema) => ({
    body: getSchema<ICategory>(yup.object().shape({
        name: yup.string().required().min(3)
    })),
    query: getSchema<IFilter>(yup.object().shape({
        filter: yup.string().optional().min(3)
    }))
}))

export const create = async (req: Request<{}, {}, ICategory>, res: Response) => {
    console.log(req.body)

    return res.send('Create')
}