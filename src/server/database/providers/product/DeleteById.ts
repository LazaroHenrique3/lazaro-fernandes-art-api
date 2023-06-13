import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'

import path from 'path'

import { UploadImages } from '../../../shared/services/UploadImagesServices'

export const deleteById = async (id: number): Promise<void | Error> => {
    try {
        const result = await Knex.transaction(async (trx) => {
            // Buscando o nome da imagem principal do produto, para posterio exclusão
            const mainImage = await trx(ETableNames.product).select('main_image').where('id', '=', id).first()

            // Buscando o nome das demais imagens do produto, para posterior exclusão
            const productImages = await trx(ETableNames.productImages).select('name_image').where('product_id', '=', id)

            // Excluindo a relação  de dimensões do produto
            await trx(ETableNames.productDimensions).where('product_id', '=', id).del()

            // Excluindo a relação de imagens no banco de dados
            await trx(ETableNames.productImages).where('product_id', '=', id).del()

            // Excluindo o produto do banco
            const isDeleted = await trx(ETableNames.product).where('id', '=', id).del()

            //Exluindo as imagens nesse momento pois caso de erro será feito o rollback
            if (isDeleted > 0) {
                //Removendo a imagem principal
                const destinationPath = path.resolve(__dirname, `../../../images/products/${mainImage?.main_image}`)
                UploadImages.removeImage(mainImage?.main_image, destinationPath)

                //Removendo as demais imagens
                productImages.map(async (image) => {
                    const destinationPath = path.resolve(__dirname, `../../../images/products/${image.name_image}`)
                    UploadImages.removeImage(image.name_image, destinationPath)
                })
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