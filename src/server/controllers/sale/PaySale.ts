import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { SaleProvider } from '../../database/providers/sale'

//Para tipar o body do request
interface IParamProps {
    id?: number,
    idSale?: number,
}

//Midleware
export const paySaleValidation = validation(getSchema => ({
    params: getSchema<IParamProps>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
        idSale: yup.number().integer().required().moreThan(0),
    })),
}))

export const paySale = async (req: Request<IParamProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado.'
            }
        })
    } 

    if (!req.params.idSale) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "idSale" precisa ser informado.'
            }
        })
    } 

    const result = await SaleProvider.paySale(req.params.id, req.params.idSale)
    if(result instanceof Error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.OK).json(result)
}