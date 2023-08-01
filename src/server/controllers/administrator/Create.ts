import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { IAdministrator } from '../../database/models'
import { AdministratorProvider } from '../../database/providers/administrator'

//Para tipar o body do request
interface IBodyProps extends Omit<IAdministrator, 'id' | 'admin_access_level' | 'password'> { }

//Midleware
export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        status: yup.string().oneOf(['Ativo', 'Inativo']).default('Ativo').required(),
        name: yup.string().required().min(3).max(100),
        email: yup.string().required().email().min(5).max(100),
    }))
}))

export const create = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    const result = await AdministratorProvider.create({...req.body, admin_access_level: 'Admin'})

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.CREATED).json(result)
}