import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'
import { Knex as knex } from 'knex'

import path from 'path'

import { UploadImages } from '../../../shared/services/UploadImagesServices'

interface ImageData {
    name_image: string;
}

interface IDeleteImageData {
    main_image: string;
    product_images: ImageData[];
}

export const deleteById = async (idProduct: number): Promise<void | Error> => {
    try {
        //Verificando se o id informado é valido
        const existsProduct = await checkValidProductId(idProduct)
        if (!existsProduct) {
            return new Error('Id informado inválido!')
        }

        //Fluxo de exclusão
        const result = await Knex.transaction(async (trx) => {
            const { main_image, product_images } = await getAllProductImages(Number(idProduct), trx)
            await deleteRelationOfProductDimensionsInDatabase(Number(idProduct), trx)
            await deleteRelationOfProductImagesInDatabase(Number(idProduct), trx)
            const isDeleted = await deleteProductFromDatabase(Number(idProduct), trx)

            if (isDeleted > 0) {
                await deleteImagesFromDirectory(main_image, product_images)
            }

            return true
        })

        if (result) return

        return new Error('Erro ao apagar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao apagar registro!')
    }
}

//Funções auxiliares
//--Faz a checagem se o id passado é valido e já impede o prcessamento desnecessário
const checkValidProductId = async (idProduct: number): Promise<boolean> => {

    const productResult = await Knex(ETableNames.product)
        .select('id')
        .where('id', '=', idProduct)
        .first()

    return productResult !== undefined
}

//--Retorna o nome de todas as imagens relacionadas ao produto
const getAllProductImages = async (idProduct: number, trx: knex.Transaction): Promise<IDeleteImageData> => {
    // Buscando o nome da imagem principal do produto, para posterior exclusão
    const mainImage = await trx(ETableNames.product).select('main_image').where('id', '=', idProduct).first()

    // Buscando o nome das demais imagens do produto, para posterior exclusão
    const productImages = await trx(ETableNames.productImages).select('name_image').where('product_id', '=', idProduct)

    // Excluindo a relação de imagens no banco de dados
    await trx(ETableNames.productImages)
        .where('product_id', '=', idProduct)
        .del()

    return {
        main_image: mainImage?.main_image,
        product_images: productImages.map((image) => ({ name_image: image.name_image })),
    }
}

//--Faz a exclusão da relação de dimensões que foram cadastrados para esse produto
const deleteRelationOfProductDimensionsInDatabase = async (idProduct: number, trx: knex.Transaction): Promise<void> => {
    await trx(ETableNames.productDimensions).where('product_id', '=', idProduct).del()
}

//--Faz a exclusão da relação de imagens que foram cadastrados para esse produto
const deleteRelationOfProductImagesInDatabase = async (idProduct: number, trx: knex.Transaction): Promise<void> => {
    await trx(ETableNames.productImages).where('product_id', '=', idProduct).del()
}

//--Faz a exclusão do project do banco de dados
const deleteProductFromDatabase = async (id: number, trx: knex.Transaction): Promise<number> => {
    return trx(ETableNames.product).where('id', '=', id).del()
}

//--Faz a exclusão das imagens do diretório da aplicação
const deleteImagesFromDirectory = async (mainImage: string, productImages: Array<{ name_image: string }>): Promise<void> => {
    const destinationPath = path.resolve(__dirname, '../../../images/products/')

    const mainImagePath = path.join(destinationPath, mainImage)
    UploadImages.removeImage(mainImage, mainImagePath)

    for (const image of productImages) {
        const imagePath = path.join(destinationPath, image.name_image)
        UploadImages.removeImage(image.name_image, imagePath)
    }
}