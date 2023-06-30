import { Knex } from '../../knex'

//Funções auxiliares
import { ProductUtil } from './util'

export const deleteImageById = async (idImage: number, idProduct: number): Promise<void | Error> => {
    try {
        //Verificando se os Ids informados são válidos
        const existsImageAndProduct = await ProductUtil.checkValidImageAndProductIds(idImage, idProduct)
        if (!existsImageAndProduct) {
            return new Error('Ids informados são inválidos!')
        }

        // Produtos precisam ter ao menos uma imagem, se for a última eu não deve permitir excluir
        const moreThanOneImage = await ProductUtil.checkTheTotalNumberOfProductImages(idProduct, 'delete')
        if (!moreThanOneImage) {
            return new Error('Produtos precisam ter ao menos uma imagem cadastrada!')
        }

        const result = await Knex.transaction(async (trx) => {
            return await ProductUtil.deleteImageFromDatabaseAndDirectory(idImage, idProduct, trx)
        })

        if (result) return

        return new Error('Erro ao apagar Imagem!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao apagar Imagem!')
    }
}
