import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { IProductFile } from '../../database/models'
import { ProductProvider } from '../../database/providers/product'
import { existsImage, existsImagesAndIsSmallerThanMax, isValidMainImageDimensions, isValidProductImagesDimensions, isValidSize, isValidType } from '../utils/validationUtils'

//Para tipar o body do request
interface IBodyProps extends Omit<IProductFile, 'id'> { }

interface IValidateProps extends Omit<IProductFile, 'id' | 'main_image' | 'product_images'> { }

//tipando o files
interface IFilesValidateProps {
    main_image: Express.Multer.File[]
    product_images: Express.Multer.File[]
}

//Midleware
export const createValidation = validation((getSchema) => ({
    body: getSchema<IValidateProps>(yup.object().shape({
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
            .required(),
        description: yup.string().optional(),
        price: yup.number().moreThan(0).max(1000000, 'Valor max: 1.000.000').required(),
        weight: yup.number().moreThan(0).min(5, 'Peso min: 5(g) = 0,005(kg)').max(5000, 'Peso max: 5000(g) = 5(kg)').required(),
        dimension_id: yup.number().moreThan(0).required(),
        technique_id: yup.number().moreThan(0).required(),
        category_id: yup.number().moreThan(0).required(),
    })),
    files: getSchema<IFilesValidateProps>(yup.object().shape({
        main_image: yup.mixed()
            .test('isImage', (value) => {
                const mainImage: Express.Multer.File[] = value as Express.Multer.File[]

                //Verificando se foi passado imagem
                existsImage(mainImage.length, value)

                //Verificando o formato das imagens
                isValidType(mainImage, value)

                // Verifica se o tamanho da imagem é maior que 2MB (em bytes)
                isValidSize(mainImage, value)

                //Verificando as dimensões recomendadas
                isValidMainImageDimensions(mainImage, value)

                return true
            })
            .required() as yup.Schema<Express.Multer.File[]>,
        product_images: yup.mixed()
            .test('isImage', (value) => {
                const product_images: Express.Multer.File[] = value as Express.Multer.File[]

                //Verificando se foi passado imagem e se é mais que  o permitido
                existsImagesAndIsSmallerThanMax(product_images.length, value)

                //Verificando o formato das imagens
                isValidType(product_images, value)

                // Verifica se o tamanho da imagem é maior que 2MB (em bytes)
                isValidSize(product_images, value)

                //Validando as dimensões das imagens
                isValidProductImagesDimensions(product_images, value)

                return true
            })
            .required() as yup.Schema<Express.Multer.File[]>,
    }))
}))

export const create = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    //Pegando as imagens enviadas do frontend
    const { main_image, product_images } = req.files as { product_images?: Express.Multer.File[], main_image?: Express.Multer.File[] }

    if (main_image === undefined || product_images === undefined) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'Imagens não foram passadas corretamente!.'
            }
        })
    }

    const result = await ProductProvider.create({ ...req.body, status: 'Ativo', main_image, product_images })

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.CREATED).json(result)
}