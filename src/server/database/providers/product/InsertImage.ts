import { IImageObject } from '../../models'

//Funções auxiliares
import { ProductUtil } from './util'

export const insertImage = async (idProduct: number, newImage: IImageObject): Promise<{id: number, url: string} | Error> => {

    try {
        //Verificando se o id informado é valido
        const existsProduct = await ProductUtil.checkValidProductId(idProduct)
        if (!existsProduct) {
            return new Error('Id informado inválido!')
        }

        //Verificando se já não atingiu o limite de 4 imagens
        const lessThanFourImages = await ProductUtil.checkTheTotalNumberOfProductImages(idProduct, 'insert')
        if (!lessThanFourImages) {
            return new Error('Produtos podem ter no máximo 4 imagens cadastradas!')
        }

        const newImageUpdated = { name_image: '' }

        //Updando a nova imagem
        try {
            newImageUpdated.name_image = await ProductUtil.uploadNewImageOnProductDirectory(newImage)
        } catch (error) {
            return new Error('Erro ao inserir imagem!')
        }

        const result = await ProductUtil.insertNewImageInDatabase(idProduct, newImageUpdated)

        //Gerando a url da nova imagem 
        const url_image = `${process.env.LOCAL_ADDRESS}/files/products/${newImageUpdated.name_image}`

        if (typeof result === 'number') return {id: result, url: url_image}

        return new Error('Erro ao atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }

}
