import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { IAdministrator } from '../../database/models'
import { AdministratorProvider } from '../../database/providers/administrator'


interface IParamProps {
    id?: number;
}

interface IBodyProps extends Omit<IAdministrator, 'id'> {}

//Midleware
export const updateByIdValidation = validation(getSchema => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        status: yup.string().required().max(20),
        name: yup.string().required().min(3).max(100),
        email: yup.string().required().email().min(5).max(100),
        password: yup.string().required().min(6).max(256).default('nopassword'),
        permissions: yup.array().of(yup.number().required()).required().min(1),
    })),
    params: getSchema<IParamProps>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    }))
}))

export const updateById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado.'
            }
        })
    }

    const result = await AdministratorProvider.updateById(req.params.id, req.body)
    if(result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.NO_CONTENT).send(result)
}