import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'
import { Knex as knex } from 'knex'

import path from 'path'

import { UploadImages } from '../../../shared/services/UploadImagesServices'


export const deleteImageById = async (idImage: number, idProduct: number): Promise<void | Error> => {
    try {
        //Verificando se os Ids informados são válidos
        const existsImageAndProduct = await checkValidImageAndProductIds(idImage, idProduct)
        if (!existsImageAndProduct) {
            return new Error('Ids informados são inválidos!')
        }

        // Produtos precisam ter ao menos uma imagem, se for a última eu não deve permitir excluir
        const moreThanOneImage = await checkTheTotalNumberOfProductImages(idProduct)
        if (!moreThanOneImage) {
            return new Error('Produtos precisam ter ao menos uma imagem cadastrada!')
        }

        const result = await Knex.transaction(async (trx) => {
            return await deleteImageFromDatabaseAndDirectory(idImage, idProduct, trx)
        })

        if (result) return

        return new Error('Erro ao apagar Imagem!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao apagar Imagem!')
    }
}

//Funções auxiliares
//--Faz a checagem se os Ids passados são válidos e já impede o prcessamento desnecessário
const checkValidImageAndProductIds = async (idImage: number, idProduct: number): Promise<boolean> => {

    const productResult = await Knex(ETableNames.product)
        .select('id')
        .where('id', '=', idProduct)
        .first()

    const productImageResult = await Knex(ETableNames.productImages)
        .select('id')
        .where('id', '=', idImage)
        .andWhere('product_id', '=', idProduct)
        .first()

    return productResult !== undefined && productImageResult !== undefined
}

//--Verifica o total de imagens, uma vez que os produtos precisam ter ao menos uma imagem cadastrada
const checkTheTotalNumberOfProductImages = async (idProduct: number): Promise<boolean> => {
    const [{ count }] = await Knex(ETableNames.productImages)
        .where('product_id', idProduct)
        .count<[{ count: number }]>('* as count')

    return count > 1
}

//--Exlui a imagem do banco de dados e do diretório de imagens
const deleteImageFromDatabaseAndDirectory = async (idImage: number, idProduct: number, trx: knex.Transaction): Promise<boolean> => {
    // Buscando o nome da imagem
    const productImage = await trx(ETableNames.productImages).select('name_image').where('id', '=', idImage).andWhere('product_id', '=', idProduct).first()

    // Excluindo a imagem do banco
    const isDeleted = await trx(ETableNames.productImages).where('id', '=', idImage).andWhere('product_id', '=', idProduct).del()

    if (isDeleted > 0) {
        //Exluindo a imagem nesse momento pois caso de erro será feito o rollback
        const destinationPath = path.resolve(__dirname, `../../../images/products/${productImage.name_image}`)

        UploadImages.removeImage(productImage.name_image, destinationPath)
    }

    return true
}