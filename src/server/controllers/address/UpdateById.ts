import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { IAddress } from '../../database/models'
import { AddressProvider } from '../../database/providers/address'


interface IParamProps {
    id?: number;
    idAdr?: number;
}

interface IBodyProps extends Omit<IAddress, 'id' | 'customer_id'> { }

//Midleware
export const updateByIdValidation = validation(getSchema => ({
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
        idAdr: yup.number().integer().required().moreThan(0),
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

    if (!req.params.idAdr) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "idAdr" precisa ser informado.'
            }
        })
    }

    /* const result = await AddressProvider.updateById(req.params.id, req.body)
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.NO_CONTENT).send(result) */
}