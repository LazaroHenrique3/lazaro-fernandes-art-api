import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { ICustomer } from '../../database/models'
import { CustomerProvider } from '../../database/providers/customer'

import { cpf } from 'cpf-cnpj-validator'
import { checkIsLeapYear } from '../utils/date'

//Para tipar o body do request
interface IBodyProps extends Omit<ICustomer, 'id' | 'verification_token' | 'verification_token_expiration'> { }

//tipando o file
interface IFileProps {
    mimetype?: string
    size?: string
}

//Midleware
export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        status: yup.string().oneOf(['Ativo', 'Inativo']).required(),
        image: yup.mixed().optional().nullable(),
        name: yup.string().required().min(3).max(100),
        email: yup.string().email().min(5).max(100).matches(/^[\w!#$%&'*+/=?`{|}~.-]+@([\w-]+\.)+[\w-]{2,4}$/, 'Ex: exemplo@dominio.com').required(),
        password: yup.string().required().min(6),
        confirmPassword: yup.string().oneOf([yup.ref('password')], 'As senhas devem ser iguais').required(),
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
            .test('max-date', 'Data de nascimento inválida', value => {
                const currentDate = new Date()
                //Idade máxima de 100 anos
                const oneHundredYearsAgo = new Date(
                    currentDate.getFullYear() - 100,
                    currentDate.getMonth(),
                    currentDate.getDate()
                )

                if (value) {
                    return value > oneHundredYearsAgo
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
    file: getSchema<IFileProps>(yup.object().shape({
        mimetype: yup.string()
            .test('fileType', 'Formato de imagem inválido', (value) => {

                if (value === undefined) {
                    return true // Permitir quando nenhum arquivo foi selecionado
                }

                //Verificando o formato
                const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg']
                return supportedFormats.includes(value)
            }),
        size: yup.string()
            .test('fileSize', 'Tamanho de imagem excede 2MB', (value) => {

                if (value === undefined) {
                    return true // Permitir quando nenhum arquivo foi selecionado
                }

                // Verifica se o tamanho da imagem é maior que 2MB (em bytes)
                const maxSize = 2 * 1024 * 1024 // 2MB
                if (Number(value) > maxSize) {
                    return false
                }

                return true
            }),
    }))
}))

export const create = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    //Verificar se foi inserido imagem 
    const image = (req.file) ? req.file : null

    const result = await CustomerProvider.create({ ...req.body, status: 'Ativo', image: image })

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.CREATED).json(result)
}