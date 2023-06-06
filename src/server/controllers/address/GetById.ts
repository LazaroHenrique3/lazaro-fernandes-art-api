import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { AddressProvider } from '../../database/providers/address'

//Para tipar o body do request
interface IParamProps {
    id?: number,
    idAdr?: number,
}

//Midleware
export const getByIdValidation = validation(getSchema => ({
    params: getSchema<IParamProps>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
        idAdr: yup.number().integer().required().moreThan(0),
    })),
}))

export const getById = async (req: Request<IParamProps>, res: Response) => {
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

    const result = await AddressProvider.getById(req.params.idAdr, req.params.id)
    if(result instanceof Error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.OK).json(result)
}