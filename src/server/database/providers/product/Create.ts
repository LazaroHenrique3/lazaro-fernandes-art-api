import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'
import { Knex as knex } from 'knex'
import { IProduct } from '../../models'

import { UploadImages } from '../../../shared/services/UploadImagesServices'


export const create = async (product: Omit<IProduct, 'id'>): Promise<number | Error> => {
    try {
        //Verificando se as dimensões passadas são válidas
        const validDimensions = await checkValidDimensions(product.dimensions.map(Number))
        if (!validDimensions) {
            return new Error('Dimensões inválidas!')
        }

        //Inserindo as imagens no diretório da aplicação, e pegando seus nome para inserir no banco
        let productFormatedAndWithNameOfImagesUploaded: Omit<IProduct, 'id'>

        try {
            productFormatedAndWithNameOfImagesUploaded = await formatAndInsertProductImagesInDirectory(product)
        } catch (error) {
            return new Error('Erro ao inserir imagem!')
        }

        //Fluxo de inserção
        const result = await Knex.transaction(async (trx) => {
            const { dimensions, product_images, ...insertProductData } = productFormatedAndWithNameOfImagesUploaded

            const idOfNewProduct = await insertProductInDatabase(insertProductData, trx)
            await insertProductDimensionsInDatabase(idOfNewProduct, dimensions.map(Number), trx)
            await insertProductImagesRelationInDatabase(idOfNewProduct, product_images, trx)

            return idOfNewProduct
        })

        //Se tudo correu bem ele deve estar com o id do novo produto
        if (typeof result === 'number') {
            return result
        }

        return new Error('Erro ao criar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao criar registro!')
    }
}

//Funções auxiliares
//--Faz a checagem se os Ids de dimensões passadas são válidos
const checkValidDimensions = async (dimensions: number[]): Promise<boolean> => {
    const [{ count }] = await Knex(ETableNames.dimension)
        .whereIn('id', dimensions)
        .count<[{ count: number }]>('* as count')
    return count === dimensions.length
}

//--Insere as imagens do diretório da aplicação e retorna um objeto com o nome das imagens de upload e a data formatada
const formatAndInsertProductImagesInDirectory = async (product: Omit<IProduct, 'id'>): Promise<Omit<IProduct, 'id'>> => {
    try {
        //Inserindo a imagem principal do produto
        const mainImage = await UploadImages.uploadImage(product.main_image[0], 'products')

        //Inserindo as demais imagens/criando um array de promisses
        const promises = product.product_images.map((image) =>
            UploadImages.uploadImage(image, 'products')
        )

        //Aguardar a conclusão de todas as Promises e obter um array com os nomes das imagens
        const productImages = await Promise.all(promises)

        return {
            ...product,
            production_date: formatProductionDate(product.production_date),
            main_image: mainImage,
            product_images: productImages
        }
    } catch (error) {
        throw new Error('Erro ao inserir imagem!')
    }
}

//--Formata a data de produção da forma adequada para o banco de dados
const formatProductionDate = (productionDate: Date | string): string => {
    const formattedDate = new Date(productionDate).toISOString().split('T')[0]
    return formattedDate
}

//--Insere o produto de fato no banco de dados
const insertProductInDatabase = async (product: Omit<IProduct, 'id' | 'dimensions' | 'product_images'>, trx: knex.Transaction): Promise<number> => {
    const [productId] = await trx(ETableNames.product).insert(product).returning('id')
    return typeof productId === 'number' ? productId : productId.id
}

//--Insere a relação de dimensões de produto no banco de dados
const insertProductDimensionsInDatabase = async (productId: number, dimensions: number[], trx: knex.Transaction): Promise<void> => {
    const dimensionsData = dimensions.map((dimensionId) => ({
        product_id: productId,
        dimension_id: dimensionId
    }))

    await trx(ETableNames.productDimensions).insert(dimensionsData)
}

//--Insere a relação de imagens do produto no banco de dados
const insertProductImagesRelationInDatabase = async (productId: number, images: string[], trx: knex.Transaction): Promise<void> => {
    const imagesData = images.map((image) => ({
        product_id: productId,
        name_image: image
    }))

    await trx(ETableNames.productImages).insert(imagesData)
}

