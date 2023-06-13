import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'

import path from 'path'

import { UploadImages } from '../../../shared/services/UploadImagesServices'


export const deleteImageById = async (id: number, idProduct: number): Promise<void | Error> => {
    try {
        // Produtos precisam ter ao menos uma imagem, se for a última eu não deve permitir excluir
        const [{ count }] = await Knex(ETableNames.productImages).where('product_id', idProduct).count<[{ count: number }]>('* as count')

        if (count === 1) {
            return new Error('Produtos de venda precisam ter ao menos uma imagem cadastrada!')
        }

        const result = await Knex.transaction(async (trx) => {
            // Buscando o nome da imagem
            const productImage = await trx(ETableNames.productImages).select('name_image').where('id', '=', id).andWhere('product_id', '=', idProduct).first()

            // Excluindo a imagem do banco
            const isDeleted = await trx(ETableNames.productImages).where('id', '=', id).andWhere('product_id', '=', idProduct).del()

            if (isDeleted > 0) {
                //Exluindo a imagem nesse momento pois caso de erro será feito o rollback
                const destinationPath = path.resolve(__dirname, `../../../images/products/${productImage.name_image}`)

                UploadImages.removeImage(productImage.name_image, destinationPath)
            }
            return true
        })

        if (result) return

        return new Error('Erro ao apagar Imagem!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao apagar Imagem!')
    }
}