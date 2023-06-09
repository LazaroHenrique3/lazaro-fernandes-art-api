import { ETableNames } from '../../../ETablesNames'
import { Knex } from '../../../knex'
import { Knex as knex } from 'knex'
import {
    IProduct,
    IDeleteImageData,
    IImageObject,
    IProductUpdate
} from '../../../models'

import path from 'path'
import { UploadImages } from '../../../../shared/services/UploadImagesServices'

export const getTotalOfRegisters = async (filter: string): Promise<number | undefined> => {

    const [{ count }] = await Knex(ETableNames.product)
        .where('title', 'like', `%${filter}%`)
        .count<[{ count: number }]>('* as count')

    return count

}

export const getProductsWithFilter = async (filter: string, page: number, limit: number): Promise<IProduct[]> => {
    return Knex(ETableNames.product)
        .select('*')
        .where('title', 'like', `%${filter}%`)
        .offset((page - 1) * limit)
        .limit(limit)
}

export const getProductById = async (id: number): Promise<IProduct | undefined> => {

    return Knex(ETableNames.product)
        .select('*')
        .where('id', '=', id)
        .first()

}

export const getProductDimensionsById = async (id: number): Promise<number[]> => {
    const dimensions = await Knex(ETableNames.productDimensions)
        .select('dimension_id')
        .where('product_id', id)

    return dimensions.map((dimension) => dimension.dimension_id)
}

export const getProductImagesById = async (id: number): Promise<string[]> => {

    const images = await Knex(ETableNames.productImages)
        .select('name_image')
        .where('product_id', id)

    return images.map((image) => image.name_image)
}

export const getImageById = async (idImage: number, idProduct: number): Promise<{ name_image: string } | undefined> => {

    return Knex(ETableNames.productImages)
        .select('name_image')
        .where('id', '=', idImage)
        .andWhere('product_id', '=', idProduct)
        .first()

}

export const getMainImage = async (idProduct: number): Promise<string | undefined> => {

    const oldImage = await Knex(ETableNames.product)
        .select('main_image')
        .where('id', '=', idProduct)
        .first()

    return oldImage?.main_image

}

export const insertProductInDatabase = async (product: Omit<IProduct, 'id' | 'dimensions' | 'product_images'>, trx: knex.Transaction): Promise<number> => {

    const [productId] = await trx(ETableNames.product)
        .insert(product)
        .returning('id')

    return typeof productId === 'number' ? productId : productId.id

}

export const insertProductDimensionsInDatabase = async (productId: number, dimensions: number[], trx: knex.Transaction): Promise<void> => {

    const dimensionsData = dimensions.map((dimensionId) => ({
        product_id: productId,
        dimension_id: dimensionId
    }))

    await trx(ETableNames.productDimensions).insert(dimensionsData)

}

export const insertProductImagesRelationInDatabase = async (productId: number, images: string[], trx: knex.Transaction): Promise<void> => {

    const imagesData = images.map((image) => ({
        product_id: productId,
        name_image: image
    }))

    await trx(ETableNames.productImages).insert(imagesData)

}

export const updateProductInDatabase = async (id: number, productData: Omit<IProductUpdate, 'id' | 'dimensions'>, trx: knex.Transaction): Promise<void> => {

    await trx(ETableNames.product)
        .update(productData)
        .where('id', '=', id)
}

export const updateImageInDatabase = async (idImage: number, idProduct: number, newImageUpdated: { name_image: string }): Promise<number> => {

    return Knex(ETableNames.productImages)
        .update(newImageUpdated)
        .where('id', '=', idImage)
        .andWhere('product_id', '=', idProduct)

}

export const updateMainImageInDatabase = async (idProduct: number, newImage: { main_image: string }): Promise<number> => {

    const result = await Knex(ETableNames.product)
        .update(newImage)
        .where('id', '=', idProduct)

    return result

}

export const insertNewImageInDatabase = async (idProduct: number, newImageUpdated: { name_image: string }): Promise<void> => {

    const imagesData = {
        product_id: idProduct,
        name_image: newImageUpdated.name_image
    }

    await Knex(ETableNames.productImages).insert(imagesData)
}

export const deleteAndGetAllProductImagesInDatabase = async (idProduct: number, trx: knex.Transaction): Promise<IDeleteImageData> => {

    // Buscando o nome da imagem principal do produto, para posterior exclusão
    const mainImage = await trx(ETableNames.product)
        .select('main_image').where('id', '=', idProduct)
        .first()

    // Buscando o nome das demais imagens do produto, para posterior exclusão
    const productImages = await trx(ETableNames.productImages)
        .select('name_image')
        .where('product_id', '=', idProduct)

    // Excluindo a relação de imagens no banco de dados
    await trx(ETableNames.productImages)
        .where('product_id', '=', idProduct)
        .del()

    return {
        main_image: mainImage?.main_image,
        product_images: productImages.map((image) => ({ name_image: image.name_image })),
    }
}

export const deleteImageFromDatabaseAndDirectory = async (idImage: number, idProduct: number, trx: knex.Transaction): Promise<boolean> => {

    // Buscando o nome da imagem
    const productImage = await trx(ETableNames.productImages).select('name_image')
        .where('id', '=', idImage)
        .andWhere('product_id', '=', idProduct)
        .first()

    // Excluindo a imagem do banco
    const isDeleted = await trx(ETableNames.productImages).where('id', '=', idImage)
        .andWhere('product_id', '=', idProduct)
        .del()

    if (isDeleted > 0) {
        //Exluindo a imagem nesse momento pois caso de erro será feito o rollback
        const destinationPath = path.resolve(__dirname, `../../../../images/products/${productImage.name_image}`)

        UploadImages.removeImage(productImage.name_image, destinationPath)
    }

    return true
}

export const deleteRelationOfProductDimensionsInDatabase = async (idProduct: number, trx: knex.Transaction): Promise<void> => {

    await trx(ETableNames.productDimensions)
        .where('product_id', '=', idProduct)
        .del()

}

export const deleteRelationOfProductImagesInDatabase = async (idProduct: number, trx: knex.Transaction): Promise<void> => {

    await trx(ETableNames.productImages)
        .where('product_id', '=', idProduct)
        .del()

}

export const deleteProductFromDatabase = async (id: number, trx: knex.Transaction): Promise<number> => {

    return trx(ETableNames.product)
        .where('id', '=', id)
        .del()

}

export const deleteAllImagesFromDirectory = async (mainImage: string, productImages: Array<{ name_image: string }>): Promise<void> => {

    const destinationPath = path.resolve(__dirname, '../../../../images/products/')

    const mainImagePath = path.join(destinationPath, mainImage)
    UploadImages.removeImage(mainImage, mainImagePath)

    for (const image of productImages) {
        const imagePath = path.join(destinationPath, image.name_image)
        UploadImages.removeImage(image.name_image, imagePath)
    }

}

//Funções relacionados ao diretório de imagens
export const uploadNewImageOnProductDirectory = async (newImage: IImageObject): Promise<string> => {

    return await UploadImages.uploadImage(newImage, 'products')

}

export const removeImageOnProductDirectory = async (imageName: string | undefined): Promise<void> => {

    if (imageName) {
        const destinationPath = path.resolve(__dirname, `../../../../images/products/${imageName}`)
        await UploadImages.removeImage(imageName, destinationPath)
    }

}
