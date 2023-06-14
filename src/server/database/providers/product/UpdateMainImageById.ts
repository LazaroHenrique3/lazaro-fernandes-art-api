import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'
import { IImageObject } from '../../models'

import path from 'path'

import { UploadImages } from '../../../shared/services/UploadImagesServices'

export const updateMainImageById = async (idProduct: number, newImage: IImageObject): Promise<void | Error> => {
    try {
        //Verificando se o Id informados é válido
        const existsProduct = await checkValidProductId(idProduct)
        if (!existsProduct) {
            return new Error('Id informado inválido!')
        }

        //Buscando o nome da imagem antiga
        const oldImage = await getOldMainImageInDatabase(idProduct)
        const newImageUpdated = { main_image: '' }

        //Upando a nova imagem e excluindo a antiga
        try {
            newImageUpdated.main_image = await uploadNewImageOnProductDirectory(newImage)
            await removeOldImageOnProductDirectory(oldImage)
        } catch (error) {
            return new Error('Erro ao inserir imagem!')
        }

        //Atualizando o produto no banco com a nova imagem principal
        const result = await updateMainImageInDatabase(idProduct, newImageUpdated)

        if (result > 0) return

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

//--Serve para pegar o nome da imagem que já está cadastrada
const getOldMainImageInDatabase = async (idProduct: number): Promise<string | undefined> => {
    const oldImage = await Knex(ETableNames.product)
        .select('main_image')
        .where('id', '=', idProduct)
        .first()

    return oldImage?.main_image
}

//--Serve para fazer de fato o upload da imagem e retorna o nome que ela foi salva
const uploadNewImageOnProductDirectory = async (newImage: IImageObject): Promise<string> => {
    return await UploadImages.uploadImage(newImage, 'products')
}

//--Serve para remover a imagem antiga do diretório da aplicação
const removeOldImageOnProductDirectory = async (imageName: string | undefined): Promise<void> => {
    if (imageName) {
        const destinationPath = path.resolve(__dirname, `../../../images/products/${imageName}`)
        await UploadImages.removeImage(imageName, destinationPath)
    }
}

//--Serve para salvar o novo nome da imagem principal no banco
const updateMainImageInDatabase = async (idProduct: number, newImage: { main_image: string }): Promise<number> => {
    const result = await Knex(ETableNames.product)
        .update(newImage)
        .where('id', '=', idProduct)

    return result
}
