import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { ISale } from '../../database/models'
import { SaleProvider } from '../../database/providers/sale'

//Para tipar o body do request
interface IBodyProps extends Omit<ISale, 'id' | 'status' | 'order_date' | 'payment_due_date' | 'payment_received_date' | 'delivery_date' | 'customer_id' | 'address_id'> { }

//Para tipar o param do request
interface IParamProps {
    id?: number,
    idAddress?: number
}

const saleItemSchema = yup.object().shape({
    idProduct: yup.number().integer().required(),
    quantity: yup.number().integer().min(1).required(),
    discount: yup.number().integer().default(0)
})
  
//Midleware
export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        estimated_delivery_date: yup.date()
            .transform((currentValue, originalValue) => {
                if (originalValue && typeof originalValue === 'string') {
                    const date = new Date(originalValue).toISOString()

                    const [year, month, day] = date.split('-')
                    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
                }
                return currentValue
            })
            .test('before-today', 'A data não pode ser menor que hoje!', value => {
                const currentDate = new Date()

                if (value) {
                    const productDate = new Date(value)

                    return productDate >= currentDate
                }

                return false
            })
            .required(),
        payment_method: yup.string().oneOf(['PIX', 'BOLETO', 'C. CREDITO', 'C. DEBITO']).required(),
        shipping_method: yup.string().oneOf(['PAC', 'SEDEX']).required(),
        shipping_cost: yup.number().moreThan(0).required(),
        sale_items: yup.array().of(saleItemSchema).required()
    })),
    params: getSchema<IParamProps>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
        idAddress: yup.number().integer().required().moreThan(0),
    }))
}))

export const create = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado.'
            }
        })
    }

    if (!req.params.idAddress) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "idAddress" precisa ser informado.'
            }
        })
    }
    const result = await SaleProvider.create({ ...req.body, customer_id: req.params.id, address_id: req.params.idAddress})

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.CREATED).json(result)
}