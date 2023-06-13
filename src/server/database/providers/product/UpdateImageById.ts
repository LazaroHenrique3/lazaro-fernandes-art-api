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

export const updateImageById = async (idImage: number, idProduct: number, newImage: IImageObject): Promise<void | Error> => {
    try {
        //Buscando o nome da imagem antiga
        const oldImage = await Knex(ETableNames.productImages).select('name_image').where('id', '=', idImage).andWhere('product_id', '=', idProduct).first()

        const newImageUpdated = { name_image: '' }

        //Updando a nova imagem e excluindo a antiga
        try {
            newImageUpdated.name_image = await UploadImages.uploadImage(newImage, 'products')

            //Removendo a imagem antiga
            const destinationPath = path.resolve(__dirname, `../../../images/products/${oldImage?.name_image}`)
            UploadImages.removeImage(oldImage?.name_image, destinationPath)
        } catch (error) {
            return new Error('Erro ao inserir imagem!')
        }

        const result = await Knex(ETableNames.productImages).update(newImageUpdated).where('id', '=', idImage).andWhere('product_id', '=', idProduct)

        if (result > 0) return

        return new Error('Erro ao atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }
}