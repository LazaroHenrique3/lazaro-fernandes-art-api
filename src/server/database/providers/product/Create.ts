import { Knex } from '../../knex'
import { IProduct } from '../../models'

//Funções auxiliares
import { ProductUtil } from './util'

export const create = async (product: Omit<IProduct, 'id'>): Promise<number | Error> => {
    try {
        //Inserindo as imagens no diretório da aplicação, e pegando seus nome para inserir no banco
        let productFormatedAndWithNameOfImagesUploaded: Omit<IProduct, 'id'>

        try {
            productFormatedAndWithNameOfImagesUploaded = await ProductUtil.formatAndInsertProductImagesInDirectory(product)
        } catch (error) {
            return new Error('Erro ao inserir imagem!')
        }

        //Fluxo de inserção
        const result = await Knex.transaction(async (trx) => {
            const { product_images, ...insertProductData } = productFormatedAndWithNameOfImagesUploaded

            const idOfNewProduct = await ProductUtil.insertProductInDatabase(insertProductData, trx)
            await ProductUtil.insertProductImagesRelationInDatabase(idOfNewProduct, product_images, trx)

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



