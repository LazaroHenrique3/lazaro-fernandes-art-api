import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { IAddress } from '../../database/models'
import { AddressProvider } from '../../database/providers/address'

//Para tipar o body do request
interface IBodyProps extends Omit<IAddress, 'id' | 'customer_id'> { }

//Para tipar o param do request
interface IParamProps {
    id?: number,
}

//Midleware
export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        status: yup.string().required().max(20),
        city: yup.string().max(45).required(),
        state: yup.string().max(45).required(),
        number: yup.number().integer().required().moreThan(0),
        cep: yup.string().length(8).required(),
        complement: yup.string().optional(),
        neighborhood: yup.string().required(),
        street: yup.string().required()
    })),
    params: getSchema<IParamProps>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    })),
}))

export const create = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado.'
            }
        })
    }

    const result = await AddressProvider.create({...req.body, customer_id: req.params.id})

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.CREATED).json(result) 
}