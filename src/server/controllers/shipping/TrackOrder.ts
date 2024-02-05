import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { Shipping } from '../../shared/services'

//Para tipar o body do request
interface IParamProps {
    trackingCode?: string
}

//Midleware
export const trackOrderValidation = validation(getSchema => ({
    params: getSchema<IParamProps>(yup.object().shape({
        trackingCode: yup.string().length(13).matches(/^[A-Z]{2}\d{9}[A-Z]{2}$/).required()
    })),
}))

export const trackOrder = async (req: Request<IParamProps>, res: Response) => {

    if (!req.params.trackingCode) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "trackingCode" precisa ser informado.'
            }
        })
    }

    const result = await Shipping.trackOrder(req.params.trackingCode)
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    } else if (result === undefined) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: 'Houve um erro ao rastrear pedido!'
            }
        })
    }

    return res.status(StatusCodes.OK).json(result)
}