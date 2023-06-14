import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'
import { IImageObject } from '../../models'

import path from 'path'

import { UploadImages } from '../../../shared/services/UploadImagesServices'

export const updateImageById = async (id: number, newImage: IImageObject): Promise<void | Error> => {
    try {
        //Buscando o nome da imagem antiga
        const oldImage = await Knex(ETableNames.customer).select('image').where('id', '=', id).first()

        const newImageUpdated = {image: ''}

        //Updando a nova imagem e excluindo a antiga
        try {
            newImageUpdated.image = await UploadImages.uploadImage(newImage, 'customers')

            //Pode ser que o usuario não tenha cadastrado uma imagem previamente
            if (oldImage?.image !== undefined) {
                //Removendo a imagem antiga
                const destinationPath = path.resolve(__dirname, `../../../images/customers/${oldImage?.image}`)
                UploadImages.removeImage(oldImage?.image, destinationPath)
            }
        } catch (error) {
            return new Error('Erro ao inserir imagem!')
        }

        const result = await Knex(ETableNames.customer).update(newImageUpdated).where('id', '=', id)

        if (result > 0) return 
        
        return new Error('Erro ao atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }
}