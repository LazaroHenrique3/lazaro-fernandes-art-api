import { IImageObject } from '../../models'

//Funções auxiliares
import { ProductUtil } from './util'

export const updateMainImageById = async (idProduct: number, newImage: IImageObject): Promise<void | Error> => {
    try {
        //Verificando se o Id informados é válido
        const existsProduct = await ProductUtil.checkValidProductId(idProduct)
        if (!existsProduct) {
            return new Error('Id informado inválido!')
        }

        //Buscando o nome da imagem antiga
        const oldImage = await ProductUtil.getMainImage(idProduct)
        const newImageUpdated = { main_image: '' }

        //Upando a nova imagem e excluindo a antiga
        try {
            newImageUpdated.main_image = await ProductUtil.uploadNewImageOnProductDirectory(newImage)
            await ProductUtil.removeImageOnProductDirectory(oldImage)
        } catch (error) {
            return new Error('Erro ao inserir imagem!')
        }

        //Atualizando o produto no banco com a nova imagem principal
        const result = await ProductUtil.updateMainImageInDatabase(idProduct, newImageUpdated)

        if (result > 0) return

        return new Error('Erro ao atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }
}




