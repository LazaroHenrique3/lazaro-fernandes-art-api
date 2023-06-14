import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'
import { IImageObject } from '../../models'

import path from 'path'

import { UploadImages } from '../../../shared/services/UploadImagesServices'

export const updateImageById = async (idImage: number, idProduct: number, newImage: IImageObject): Promise<void | Error> => {
    try {
        //Verificando se os Ids informados são válidos
        const existsImageAndProduct = await checkValidImageAndProductIds(idImage, idProduct)
        if(!existsImageAndProduct){
            return new Error('Ids informados são inválidos!')
        }

        //Buscando o nome da imagem antiga
        const oldImage = await getOldMainImageInDatabase(idImage, idProduct)

        const newImageUpdated = { name_image: '' }

        //Updando a nova imagem e excluindo a antiga
        try {
            newImageUpdated.name_image = await uploadNewImageOnProductDirectory(newImage)
            //Removendo a imagem antiga
            await removeOldImageOnProductDirector(oldImage?.name_image)
        } catch (error) {
            return new Error('Erro ao inserir imagem!')
        }

        const result = await updateImageInDatabase(idImage, idProduct, newImageUpdated)

        if (result > 0) return

        return new Error('Erro ao atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
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

//--Serve para pegar o nome da imagem que já está cadastrada
const getOldMainImageInDatabase = async (idImage: number, idProduct: number): Promise<{ name_image: string } | undefined> => {
    return Knex(ETableNames.productImages)
        .select('name_image')
        .where('id', '=', idImage)
        .andWhere('product_id', '=', idProduct)
        .first()
}

//--Serve para fazer de fato o upload da imagem e retorna o nome que ela foi salva
const uploadNewImageOnProductDirectory = async (newImage: IImageObject): Promise<string> => {
    return UploadImages.uploadImage(newImage, 'products')
}

//--Serve para remover a imagem antiga do diretório da aplicação
const removeOldImageOnProductDirector = async (imageName: string | undefined): Promise<void> => {
    if (imageName) {
        const destinationPath = path.resolve(__dirname, `../../../images/products/${imageName}`)
        UploadImages.removeImage(imageName, destinationPath)
    }
}

//--Serve para salvar o novo nome da nova imagem no banco no banco
const updateImageInDatabase = async (idImage: number, idProduct: number, newImageUpdated: { name_image: string }): Promise<number> => {
    return Knex(ETableNames.productImages)
        .update(newImageUpdated)
        .where('id', '=', idImage)
        .andWhere('product_id', '=', idProduct)
}