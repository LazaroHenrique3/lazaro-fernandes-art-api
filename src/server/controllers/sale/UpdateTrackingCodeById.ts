import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { SaleProvider } from '../../database/providers/sale'

//Para tipar o body do request
interface IBodyProps {
    tracking_code: string
}

//Para tipar o body do request
interface IParamProps {
    id?: number,
    idSale?: number,
}

//Midleware
export const updateTrackingCodeByIdValidation = validation(getSchema => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        tracking_code: yup.string().length(13).matches(/^[A-Z]{2}\d{9}[A-Z]{2}$/).required()
    })),
    params: getSchema<IParamProps>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
        idSale: yup.number().integer().required().moreThan(0),
    })),
}))

export const updateTrackingCodeById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
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
 
    const result = await SaleProvider.updateTrackingCodeById(req.params.id, req.params.idSale, req.body.tracking_code)
    if(result instanceof Error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.OK).json(result)
}