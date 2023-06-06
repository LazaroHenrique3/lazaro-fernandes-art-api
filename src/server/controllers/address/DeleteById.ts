import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { AddressProvider } from '../../database/providers/address'

//Para tipar o body do request
interface IParamProps {
    idAdr?: number,
}

//Midleware
export const deleteByIdValidation = validation(getSchema => ({
    params: getSchema<IParamProps>(yup.object().shape({
        idAdr: yup.number().integer().required().moreThan(0),
    })),
}))

export const deleteById = async (req: Request<IParamProps>, res: Response) => {
    if (!req.params.idAdr) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado.'
            }
        })
    }

    const result = await AddressProvider.deleteById(req.params.idAdr)
    if(result instanceof Error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.NO_CONTENT).send()
}