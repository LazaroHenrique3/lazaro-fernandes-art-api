import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'
import { IImageObject } from '../../models'

import { UploadImages } from '../../../shared/services/UploadImagesServices'

export const insertImage = async (idProduct: number, newImage: IImageObject): Promise<void | Error> => {
    try {
        //Verificando se o id informado é valido
        const existsProduct = await checkValidProductId(idProduct)
        if (!existsProduct) {
            return new Error('Id informado inválido!')
        }

        //Verificando se já não atingiu o limite de 4 imagens
        const lessThanFourImages = await checkTheTotalNumberOfProductImages(idProduct)
        if (!lessThanFourImages) {
            return new Error('Produtos podem ter no máximo 4 imagens cadastradas!')
        }

        const newImageUpdated = { name_image: '' }

        //Updando a nova imagem
        try {
            newImageUpdated.name_image = await uploadNewImageOnProductDirectory(newImage)
        } catch (error) {
            return new Error('Erro ao inserir imagem!')
        }

        const result = await insertImageInDatabase(idProduct, newImageUpdated)

        if (result === undefined) return

        return new Error('Erro ao atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
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

//--Verifica o total de imagens, uma vez que os produtos precisam ter no máximo 4 imagens cadastradas
const checkTheTotalNumberOfProductImages = async (idProduct: number): Promise<boolean> => {
    const [{ count }] = await Knex(ETableNames.productImages)
        .where('product_id', idProduct)
        .count<[{ count: number }]>('* as count')

    return count < 4
}

//--Serve para fazer de fato o upload da imagem e retorna o nome que ela foi salva
const uploadNewImageOnProductDirectory = async (newImage: IImageObject): Promise<string> => {
    return UploadImages.uploadImage(newImage, 'products')
}

//--Serve para salvar o novo nome da nova imagem no banco no banco
const insertImageInDatabase = async (idProduct: number, newImageUpdated: { name_image: string }): Promise<void> => {
    const imagesData = {
        product_id: idProduct,
        name_image: newImageUpdated.name_image
    }

    await Knex(ETableNames.productImages).insert(imagesData)
}