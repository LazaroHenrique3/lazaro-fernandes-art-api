import { IImageObject } from '../../models'

//Funções auxiliares
import { ProductUtil } from './util'

export const updateImageById = async (idImage: number, idProduct: number, newImage: IImageObject): Promise<void | Error> => {
    try {
        //Verificando se os Ids informados são válidos
        const existsImageAndProduct = await ProductUtil.checkValidImageAndProductIds(idImage, idProduct)
        if(!existsImageAndProduct){
            return new Error('Ids informados são inválidos!')
        }

        //Buscando o nome da imagem antiga
        const oldImage = await ProductUtil.getImageById(idImage, idProduct)

        const newImageUpdated = { name_image: '' }

        //Updando a nova imagem e excluindo a antiga
        try {
            newImageUpdated.name_image = await ProductUtil.uploadNewImageOnProductDirectory(newImage)

            //Removendo a imagem antiga
            await ProductUtil.removeImageOnProductDirectory(oldImage?.name_image)
        } catch (error) {
            return new Error('Erro ao inserir imagem!')
        }

        const result = await ProductUtil.updateImageInDatabase(idImage, idProduct, newImageUpdated)

        if (result > 0) return

        return new Error('Erro ao atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }
}






