import { ETableNames } from '../../../ETablesNames'
import { Knex } from '../../../knex'
import { Knex as knex } from 'knex'
import {
    IProduct,
    IImageProductList,
    IDeleteImageData,
    IImageObject,
    IProductUpdate,
    ICategory,
    ITechnique,
    IDimension
} from '../../../models'

import path from 'path'
import { UploadImages } from '../../../../shared/services/UploadImagesServices'
import { getCategoryById } from '../../category/util/crudFunctions'
import { getTechniqueById } from '../../technique/util/crudFunctions'
import { getDimensionById } from '../../dimension/util/crudFunctions'

export const getTotalOfRegisters = async (filter: string, category: string, technique: string, type: string, status: string): Promise<number | undefined> => {

    const [{ count }] = await Knex(ETableNames.product)
        .where('title', 'like', `%${filter}%`)
        .leftJoin(ETableNames.category, 'product.category_id', 'category.id')
        .leftJoin(ETableNames.technique, 'product.technique_id', 'technique.id')
        .andWhere(function () {
            if (category) {
                this.where('category.name', '=', category)
            }
            if (technique) {
                this.where('technique.name', '=', technique)
            }
            if (status) {
                this.where('product.status', '=', status)
            }
            if(type) {
                this.where('product.type', '=', type)
            }
        })
        .andWhereNot('product.status', '=', 'Inativo')
        .count<[{ count: number }]>('* as count')

    return count

}

export const getAdminTotalOfRegisters = async (
    filter: string, 
    status: string, 
    type: string, 
    orientation: string, 
    category: string, 
    technique: string, 
    dimension: string, 
    productionDate: string
): Promise<number | undefined> => {

    let categoryName: ICategory | undefined
    let techniqueName: ITechnique | undefined
    let dimensionName: IDimension | undefined

    if (category && category !== '') {
        categoryName = await getCategoryById(Number(category))
    }
    if (technique && technique !== '') {
        techniqueName = await getTechniqueById(Number(technique))
    }
    if (dimension && dimension !== '') {
        dimensionName = await getDimensionById(Number(dimension))
    }

    const [{ count }] = await Knex(ETableNames.product)
        .leftJoin(ETableNames.category, 'product.category_id', 'category.id')
        .leftJoin(ETableNames.technique, 'product.technique_id', 'technique.id')
        .leftJoin(ETableNames.dimension, 'product.dimension_id', 'dimension.id')
        .where('product.title', 'like', `%${filter}%`)
        .andWhere('product.status', 'like', `${status}%`)
        .andWhere('product.orientation', 'like', `${orientation}%`)
        .andWhere('product.type', 'like', `${type}%`)
        .andWhere('product.production_date', 'like', `${productionDate}%`)
        .andWhere('category.name', 'like', `${categoryName ? categoryName.name : ''}%`)
        .andWhere('technique.name', 'like', `${techniqueName ? techniqueName.name : ''}%`)
        .andWhere('dimension.dimension', 'like', `${dimensionName ? dimensionName.dimension : ''}%`)
        .count<[{ count: number }]>('* as count')

    return count

}

export const getProductsWithFilter = async (filter: string, category: string, technique: string, order: string, type: string, status: string, page: number, limit: number): Promise<IProduct[]> => {

    return Knex(ETableNames.product)
        .select('product.*', 'category.id as category_id', 'category.name as category_name',
            'technique.id as technique_id', 'technique.name as technique_name',
            'dimension.id as dimension_id', 'dimension.dimension as dimension_name')
        .from(ETableNames.product)
        .leftJoin(ETableNames.category, 'product.category_id', 'category.id')
        .leftJoin(ETableNames.technique, 'product.technique_id', 'technique.id')
        .leftJoin(ETableNames.dimension, 'product.dimension_id', 'dimension.id')
        .where('product.title', 'like', `%${filter}%`)
        .andWhere(function () {
            if (category) {
                this.where('category.name', '=', category)
            }
            if (technique) {
                this.where('technique.name', '=', technique)
            }
            if(status) {
                this.where('product.status', '=', status)
            }
            if(type) {
                this.where('product.type', '=', type)
            }
        })
        .andWhereNot('product.status', '=', 'Inativo')
        .offset((page - 1) * limit)
        .limit(limit)
        .orderByRaw(`
        CASE 
            WHEN product.status = 'Ativo' THEN 1
            WHEN product.status = 'Vendido' THEN 2
        END
        ASC,
        product.price ${order}
        `)

}

export const getAdminProductsWithFilter = async (
    filter: string, 
    page: number, 
    limit: number,
    status: string,
    type: string,
    orientation: string,
    category: string,
    technique: string,
    dimension: string,
    productionDate: string,
    orderByPrice: string
): Promise<IProduct[]> => {

    let categoryName: ICategory | undefined
    let techniqueName: ITechnique | undefined
    let dimensionName: IDimension | undefined

    if (category && category !== '') {
        categoryName = await getCategoryById(Number(category))
    }
    if (technique && technique !== '') {
        techniqueName = await getTechniqueById(Number(technique))
    }
    if (dimension && dimension !== '') {
        dimensionName = await getDimensionById(Number(dimension))
    }
    
    return Knex(ETableNames.product)
        .select('product.*', 'category.id as category_id', 'category.name as category_name',
            'technique.id as technique_id', 'technique.name as technique_name',
            'dimension.id as dimension_id', 'dimension.dimension as dimension_name')
        .from(ETableNames.product)
        .leftJoin(ETableNames.category, 'product.category_id', 'category.id')
        .leftJoin(ETableNames.technique, 'product.technique_id', 'technique.id')
        .leftJoin(ETableNames.dimension, 'product.dimension_id', 'dimension.id')
        .where('product.title', 'like', `%${filter}%`)
        .andWhere('product.status', 'like', `${status}%`)
        .andWhere('product.orientation', 'like', `${orientation}%`)
        .andWhere('product.type', 'like', `${type}%`)
        .andWhere('product.production_date', 'like', `${productionDate}%`)
        .andWhere('category_name', 'like', `${categoryName ? categoryName.name : ''}%`)
        .andWhere('technique_name', 'like', `${techniqueName ? techniqueName.name : ''}%`)
        .andWhere('dimension_name', 'like', `${dimensionName ? dimensionName.dimension : ''}%`)
        .offset((page - 1) * limit)
        .limit(limit)
        .orderByRaw(`
        CASE 
            WHEN product.status = 'Ativo' THEN 1
            WHEN product.status = 'Vendido' THEN 2
            WHEN product.status = 'Inativo' THEN 3
        END
        ASC,
        product.price ${orderByPrice}
        `)
}

export const getAllProductsForReport = async (
    filter: string,  
    status: string,
    type: string,
    orientation: string,
    category: string,
    technique: string,
    dimension: string,
    productionDate: string,
    orderByPrice: string
): Promise<IProduct[]> => {

    let categoryName: ICategory | undefined
    let techniqueName: ITechnique | undefined
    let dimensionName: IDimension | undefined

    if (category && category !== '') {
        categoryName = await getCategoryById(Number(category))
    }
    if (technique && technique !== '') {
        techniqueName = await getTechniqueById(Number(technique))
    }
    if (dimension && dimension !== '') {
        dimensionName = await getDimensionById(Number(dimension))
    }

    return Knex(ETableNames.product)
        .select('product.*', 'category.name as category_id', 'technique.name as technique_id', 'dimension.dimension as dimension_id')
        .leftJoin(ETableNames.category, 'product.category_id', 'category.id')
        .leftJoin(ETableNames.technique, 'product.technique_id', 'technique.id')
        .leftJoin(ETableNames.dimension, 'product.dimension_id', 'dimension.id')
        .where('product.title', 'like', `%${filter}%`)
        .andWhere('product.status', 'like', `${status}%`)
        .andWhere('product.orientation', 'like', `${orientation}%`)
        .andWhere('product.type', 'like', `${type}%`)
        .andWhere('product.production_date', 'like', `${productionDate}%`)
        .andWhere('category.name', 'like', `${categoryName ? categoryName.name : ''}%`)
        .andWhere('technique.name', 'like', `${techniqueName ? techniqueName.name : ''}%`)
        .andWhere('dimension.dimension', 'like', `${dimensionName ? dimensionName.dimension : ''}%`)
        .orderByRaw(`
        CASE 
            WHEN product.status = 'Ativo' THEN 1
            WHEN product.status = 'Vendido' THEN 2
            WHEN product.status = 'Inativo' THEN 3
        END
        ASC,
        product.price ${orderByPrice}
        `)
      

}

export const getProductById = async (id: number): Promise<IProduct | undefined> => {

    return Knex(ETableNames.product)
        .select('product.*', 'category.name as category_name', 'technique.name as technique_name', 'dimension.dimension as dimension_name')
        .leftJoin(ETableNames.category, 'product.category_id', 'category.id')
        .leftJoin(ETableNames.technique, 'product.technique_id', 'technique.id')
        .leftJoin(ETableNames.dimension, 'product.dimension_id', 'dimension.id')
        .where('product.id', '=', id)
        .first()

}

export const getProductImagesById = async (id: number): Promise<IImageProductList[]> => {

    const images = await Knex(ETableNames.productImages)
        .select('id', 'name_image')
        .where('product_id', id)

    return images
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

export const getCategoryTechniqueDimensionOfProduct = async (idProduct: number): Promise<{ technique_id: number, category_id: number, dimension_id: number } | undefined> => {

    const result = await Knex(ETableNames.product)
        .select('technique_id', 'category_id', 'dimension_id')
        .where('id', '=', idProduct)
        .first()

    return result

}

export const insertProductInDatabase = async (product: Omit<IProduct, 'id' | 'product_images'>, trx: knex.Transaction): Promise<number> => {

    const [productId] = await trx(ETableNames.product)
        .insert(product)
        .returning('id')

    return typeof productId === 'number' ? productId : productId.id

}

export const insertProductImagesRelationInDatabase = async (productId: number, images: string[], trx: knex.Transaction): Promise<void> => {

    const imagesData = images.map((image) => ({
        product_id: productId,
        name_image: image
    }))

    await trx(ETableNames.productImages).insert(imagesData)

}

export const updateProductInDatabase = async (id: number, productData: Omit<IProductUpdate, 'id'>, trx: knex.Transaction): Promise<void> => {

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

export const insertNewImageInDatabase = async (idProduct: number, newImageUpdated: { name_image: string }): Promise<number> => {

    const imagesData = {
        product_id: idProduct,
        name_image: newImageUpdated.name_image
    }

    const [insertedProductId] = await Knex(ETableNames.productImages).insert(imagesData).returning('id')

    return insertedProductId.id

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
