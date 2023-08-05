import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { ICustomerUpdate } from '../../database/models'
import { CustomerProvider } from '../../database/providers/customer'

import { cpf } from 'cpf-cnpj-validator'

interface IParamProps {
    id?: number;
}

interface IBodyProps extends Omit<ICustomerUpdate, 'id' | 'image'> { }

//Midleware
export const updateByIdValidation = validation(getSchema => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        status: yup.string().oneOf(['Ativo', 'Inativo']).required(),
        name: yup.string().required().min(3).max(100),
        email: yup.string().required().email().min(5).max(100),
        password: yup.string().optional().min(6),
        confirmPassword: yup.string().test({
            name: 'password-match',
            test: function (value) {
                const { password } = this.parent
                if (password) {
                    return value === password
                }
                return true
            },
            message: 'As senhas devem ser iguais',
        }).default('nopassword'),
        cell_phone: yup.string().length(11).matches(/^\d{11}$/, 'O valor deve corresponder ao padrão: 44999999999').required(),
        genre: yup.string().length(1).oneOf(['M', 'F', 'L', 'N']).required(),
        date_of_birth: yup.date()
            .transform((currentValue, originalValue) => {
                if (originalValue && typeof originalValue === 'string') {
                    const date = new Date(originalValue).toISOString().split('T')[0]

                    const [year, month, day] = date.split('-')
                    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
                }
                return currentValue
            })
            .test('is-adult', 'O usuário deve ter mais de 18 anos', value => {
                const currentDate = new Date()
                const eighteenYearsAgo = new Date(
                    currentDate.getFullYear() - 18,
                    currentDate.getMonth(),
                    currentDate.getDate()
                )

                if (value) {
                    return value <= eighteenYearsAgo
                }

                return false
            })
            .required(),
        cpf: yup.string().test('valid-cpf', 'CPF inválido', function (value) {
            if (!value) {
                return false
            }

            return cpf.isValid(value)
        }).required(),
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
    
    const accessLevel = (req.headers.accessLevel) ? req.headers.accessLevel : ''

    const result = await CustomerProvider.updateById(req.params.id, req.body, accessLevel as string)
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.NO_CONTENT).send(result)
}