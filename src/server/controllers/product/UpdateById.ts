import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { IProductUpdate } from '../../database/models'
import { ProductProvider } from '../../database/providers/product'
import { checkIsLeapYear } from '../utils/date'

interface IParamProps {
    id?: number;
}

interface IBodyProps extends Omit<IProductUpdate, 'id' | 'image'> { }

//Midleware
export const updateByIdValidation = validation(getSchema => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        status: yup.string().oneOf(['Ativo', 'Vendido', 'Inativo']).required(),
        type: yup.string().oneOf(['Original', 'Print']).required(),
        title: yup.string().required().min(1).max(100),
        orientation: yup.string().oneOf(['Retrato', 'Paisagem']).required(),
        quantity: yup.number().test('quantity-conditional-validation', 'A quantidade deve ser maior que zero!', function (value) {

            if (typeof value === 'number' && value > 1000) {
                return this.createError({
                    path: this.path,
                    message: 'Quantiddade max: 1000!',
                })
            } else if (typeof value === 'number' && value < 0) {
                return this.createError({
                    path: this.path,
                    message: 'A quantidade não pode ser negativa!',
                })
            }
    
            const status = this.resolve(yup.ref('status'))
            const type = this.resolve(yup.ref('type'))
    
            if (status === 'Ativo') {
                if (typeof value === 'number' && value > 0) {
    
                    //Se for do tipo Original só pode ter uma unidade
                    if (type === 'Original' && value > 1) {
                        return this.createError({
                            path: this.path,
                            message: 'Originais podem ter apenas 1 und!',
                        })
                    }
    
                    return true
                } else {
                    return this.createError({
                        path: this.path,
                        message: 'A quantidade deve ser maior que zero!',
                    })
                }
            } else if (status === 'Vendido') {
                if (typeof value === 'number' && value > 0) {
                    return this.createError({
                        path: this.path,
                        message: 'Produtos vendidos precisam ter 0 und!',
                    })
                }
            }  else if (status === 'Inativo') {
                if (typeof value === 'number' && value > 0) {
                    //Se for do tipo Original só pode ter uma unidade
                    if (type === 'Original' && value > 1) {
                        return this.createError({
                            path: this.path,
                            message: 'Originais podem ter apenas 1 und!',
                        })
                    }
    
                    return true
                }
            }
            
            return true
        }).required(),
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
            .test('is-leap-year', 'Essa data só é valida em anos bissextos!', value => {
                if (value) {
                    //Verificando se a data é valida caso o ano for bissexto
                    return checkIsLeapYear(new Date(value))
                }

                return false
            })
            .required(),
        description: yup.string().optional(),
        price: yup.number().moreThan(0).max(1000000, 'Valor max: 1.000.000').required(),
        weight: yup.number().moreThan(0).min(5, 'Peso min: 5(g) = 0,005(kg)').max(5000, 'Peso max: 5000(g) = 5(kg)').required(),
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

    //Obtendo qual é o nivel do acesso do usuário que fez a requisição
    const accessLevel = (req.headers.accessLevel) ? req.headers.accessLevel  : ''

    const result = await ProductProvider.updateById(req.params.id, req.body, accessLevel as string)
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.NO_CONTENT).send(result)
}