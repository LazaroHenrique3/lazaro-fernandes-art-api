import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { IProduct, IImageObject } from '../../database/models'
import { ProductProvider } from '../../database/providers/product'

//Para tipar o body do request
interface IBodyProps extends Omit<IProduct, 'id'> { }

//tipando o files
interface IFilesProps {
    main_image: IImageObject[]
    product_images: IImageObject[]
}

//Midleware
export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        status: yup.string().oneOf(['Ativo', 'Vendido', 'Inativo']).required(),
        status_of_sale: yup.string().oneOf(['Venda', 'Galeria']).required(),
        title: yup.string().required().min(1).max(100),
        type: yup.string().oneOf(['Original', 'Print']).required(),
        orientation: yup.string().oneOf(['Retrato', 'Paisagem']).required(),
        quantity: yup.number().moreThan(0).optional(),
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
        weight: yup.number().moreThan(0).optional(),
        price: yup.number().moreThan(0).optional(),
        main_image: yup.mixed().required().default([]),
        product_images: yup.array().required().default([]),
        dimensions: yup.array().of(yup.string().defined()).required(),
        technique_id: yup.number().moreThan(0).required(),
        category_id: yup.number().moreThan(0).required(),
    })),
    files: getSchema<IFilesProps>(yup.object().shape({
        main_image: yup.array()
            .test('isImage', 'A imagem principal é obrigatória!', (value) => {
                const mainImage: IImageObject[] = value as IImageObject[]

                if (mainImage.length === 0) {
                    return false
                }

                return true
            })
            .required()
            .default([])
            .test('fileType', 'Formato de imagem inválido', (value) => {
                const mainImage: IImageObject[] = value as IImageObject[]

                if (mainImage.length === 0) {
                    return false
                }

                //Verificando o formato
                const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg']
                if (!supportedFormats.includes(mainImage[0].mimetype)) {
                    return false
                }

                return true
            })
            .required()
            .default([])
            .test('fileSize', 'Tamanho de imagem excede 2MB', (value) => {
                const mainImage: IImageObject[] = value as IImageObject[]

                if (mainImage.length === 0) {
                    return false
                }

                // Verifica se o tamanho da imagem é maior que 2MB (em bytes)
                const maxSize = 2 * 1024 * 1024 // 2MB
                if (Number(mainImage[0].size) > maxSize) {
                    return false
                }

                return true
            })
            .required()
            .default([]),
        product_images: yup.array()
            .test('isImage', 'As imagens do produto são obrigatórias!', (value) => {
                const producImages: IImageObject[] = value as IImageObject[]

                if (producImages.length === 0) {
                    return false
                }

                return true
            })
            .required()
            .default([])
            .test('moreThan4Images', 'É permitido o upload de até 4 imagens!', (value) => {
                const producImages: IImageObject[] = value as IImageObject[]

                if (producImages.length > 4) {
                    return false
                }

                return true
            })
            .required()
            .default([])
            .test('fileType', 'Formato de imagem inválido', (value) => {
                const productImages: IImageObject[] = value as IImageObject[]

                if (productImages.length === 0) {
                    return false
                }

                //Verificando o formato
                const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg']
                return productImages.every((item) => supportedFormats.includes(item.mimetype))

            })
            .required()
            .default([])
            .test('fileSize', 'Tamanho de imagem excede 2MB', (value) => {
                const productImages: IImageObject[] = value as IImageObject[]

                if (productImages.length === 0) {
                    return false
                }

                // Verifica se o tamanho da imagem é maior que 2MB (em bytes)
                const maxSize = 2 * 1024 * 1024 // 2MB
                return productImages.every((item) => Number(item.size) <= maxSize)
            })
            .required()
            .default([]),
    }))
}))

export const create = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    //Pegando as imagens enviadas do frontend
    const { main_image, product_images } = req.files as { product_images?: Express.Multer.File[], main_image?: Express.Multer.File[] }

    if(main_image === undefined || product_images === undefined){
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'Imagens não foram passadas corretamente!.'
            }
        })
    }

    const result = await ProductProvider.create({ ...req.body, status: 'Ativo', main_image, product_images})

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.CREATED).json(result)
}