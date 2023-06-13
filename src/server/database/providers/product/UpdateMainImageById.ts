import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'

import path from 'path'

import { UploadImages } from '../../../shared/services/UploadImagesServices'

interface IImageObject {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}

export const updateMainImageById = async (idProduct: number, newImage: IImageObject): Promise<void | Error> => {
    try {
        //Buscando o nome da imagem antiga
        const oldImage = await Knex(ETableNames.product).select('main_image').where('id', '=', idProduct).first()

        const newImageUpdated = { main_image: '' }

        //Updando a nova imagem e excluindo a antiga
        try {
            newImageUpdated.main_image = await UploadImages.uploadImage(newImage, 'products')

            //Removendo a imagem antiga
            const destinationPath = path.resolve(__dirname, `../../../images/products/${oldImage?.main_image}`)
            UploadImages.removeImage(oldImage?.main_image, destinationPath)
        } catch (error) {
            return new Error('Erro ao inserir imagem!')
        }

        const result = await Knex(ETableNames.product).update(newImageUpdated).where('id', '=', idProduct)

        if (result > 0) return

        return new Error('Erro ao atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }
}