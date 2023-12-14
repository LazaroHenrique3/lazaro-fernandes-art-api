import { Knex } from '../../knex'

//Funções auxiliares
import { ProductUtil } from './util'

export const deleteById = async (idProduct: number): Promise<void | Error> => {
    try {
        //Verificando se o id informado é valido
        const existsProduct = await ProductUtil.checkValidProductId(idProduct)
        if (!existsProduct) {
            return new Error('Id informado inválido!')
        }

        //Verificando se o produto esta vinculado a vendas
        const productIsInUse = await ProductUtil.checkIfProductIsInUse(idProduct)
        if (productIsInUse) {
            return new Error('Registro associado á vendas!')
        }

        //Fluxo de exclusão
        const result = await Knex.transaction(async (trx) => {
            const { main_image, product_images } = await ProductUtil.deleteAndGetAllProductImagesInDatabase(idProduct, trx)

            await ProductUtil.deleteRelationOfProductImagesInDatabase(idProduct, trx)
            const isDeleted = await ProductUtil.deleteProductFromDatabase(idProduct, trx)

            if (isDeleted > 0) {
                await ProductUtil.deleteAllImagesFromDirectory(main_image, product_images)
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


