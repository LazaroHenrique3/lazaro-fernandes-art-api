import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { SaleProvider } from '../../database/providers/sale'

//Para tipar o body do request
interface IParamProps {
    id?: number,
    idSale?: number,
    cep?: string
}

//Midleware
export const recalculateShippingValueSaleValidation = validation(getSchema => ({
    params: getSchema<IParamProps>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
        idSale: yup.number().integer().required().moreThan(0),
        cep: yup.string().length(8).required(),
    })),
}))

export const recalculateShippingValueSale = async (req: Request<IParamProps>, res: Response) => {
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

    if (!req.params.cep) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "cep" precisa ser informado.'
            }
        })
    }

    const result = await SaleProvider.recalculateShippingValueSale(req.params.id, req.params.idSale, req.params.cep)
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    } else if (result === undefined) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: 'Erro ao atualizar endereço!'
            }
        })
    }

    return res.status(StatusCodes.OK).json(result)
}