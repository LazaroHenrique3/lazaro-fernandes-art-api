import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { IProductUpdate } from '../../database/models'
import { ProductProvider } from '../../database/providers/product'

interface IParamProps {
    id?: number;
}

interface IBodyProps extends Omit<IProductUpdate, 'id' | 'image'> { }

//Midleware
export const updateByIdValidation = validation(getSchema => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        status: yup.string().oneOf(['Ativo', 'Vendido', 'Inativo']).required(),
        title: yup.string().required().min(1).max(100),
        orientation: yup.string().oneOf(['Retrato', 'Paisagem']).required(),
        quantity: yup.number().moreThan(0).required(),
        production_date: yup.date()
            .transform((currentValue, originalValue) => {
                if (originalValue && typeof originalValue === 'string') {
                    const date = new Date(originalValue).toISOString().split('T')[0]

                    const [year, month, day] = date.split('-')
                    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
                }
                return currentValue
            })
            .test('before-2018', 'Não são aceitos produtos antes de 2018!', value => {
                const limitDate = new Date(2018, 0, 1)

                if (value) {
                    const productDate = new Date(value)
                    return productDate >= limitDate
                }

                return false
            })
            .test('before-today', 'A data não pode ser maior que hoje!', value => {
                const currentDate = new Date()

                if (value) {
                    const productDate = new Date(value)

                    return productDate <= currentDate
                }

                return false
            })
            .required(),
        description: yup.string().optional(),
        weight: yup.number().moreThan(0).required(),
        price: yup.number().moreThan(0).required(),
        dimension_id: yup.number().moreThan(0).required(),
        technique_id: yup.number().moreThan(0).required(),
        category_id: yup.number().moreThan(0).required(),
    })),
    params: getSchema<IParamProps>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
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

    const result = await ProductProvider.updateById(req.params.id, req.body)
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.NO_CONTENT).send(result)
}