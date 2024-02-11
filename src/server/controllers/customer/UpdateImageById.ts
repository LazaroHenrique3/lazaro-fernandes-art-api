import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { CustomerProvider } from '../../database/providers/customer'


interface IParamProps {
    id?: number;
}

//tipando o file
interface IFileProps {
    mimetype: string
    size: string
}

//Midleware
export const updateImageByIdValidation = validation(getSchema => ({
    params: getSchema<IParamProps>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    })),
    file: getSchema<IFileProps>(yup.object().shape({
        mimetype: yup.string().required()
            .test('fileType', 'Formato de imagem inválido', (value) => {

                //Verificando o formato
                const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg']
                return supportedFormats.includes(value)
            }),
        size: yup.string().required()
            .test('fileSize', 'Tamanho de imagem excede 2MB', (value) => {

                // Verifica se o tamanho da imagem é maior que 2MB (em bytes)
                const maxSize = 2 * 1024 * 1024 // 2MB
                if (Number(value) > maxSize) {
                    return false
                }

                return true
            }),
    }))
}))

export const updateImageById = async (req: Request<IParamProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado.'
            }
        })
    }

    if (!req.file) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'A nova imagem precisa ser informada.'
            }
        })
    }

    const result = await CustomerProvider.updateImageById(req.params.id, req.file)
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.OK).send(result)
}