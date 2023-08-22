import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { ICalculateShipping } from '../../database/models'

import { Shipping } from '../../shared/services'

//Para tipar o body do request
interface IBodyProps extends Omit<ICalculateShipping, 'id'> { }

//Midleware
export const calculateValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        cep: yup.string().matches(/^\d{5}-?\d{3}$/).required(),
        height: yup.number().min(1).required('Altura é obrigatória'),
        width: yup.number().min(1).required('Largura é obrigatória'),
        length: yup.number().min(1).required('Comprimento é obrigatório'),
        weight: yup.number().min(0.001).required('Peso é obrigatório'),
    }))
}))

export const calculate = async (req: Request<{}, {}, ICalculateShipping>, res: Response) => {
    const { cep, weight, width, length, height } = req.body

    const result = await Shipping.checkPriceAndDeliveryTime(cep, weight, width, length, height)

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.OK).json(result)
}