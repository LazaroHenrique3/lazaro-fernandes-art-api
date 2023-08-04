import { IImageObject } from '../../models'

//Funções auxiliares
import { CustomerUtil } from './util'

export const insertImage = async (idCustomer: number, newImage: IImageObject): Promise<string | Error> => {

    try {
        //Verificando se o id informado é valido
        const existsCustomer = await CustomerUtil.checkValidCustomerId(idCustomer)
        if (!existsCustomer) {
            return new Error('Id informado inválido!')
        }

        //Verificando se esse customer ja não possui uma imagem
        const oldImage = await CustomerUtil.checkAndReturnNameOfCustomerImage(idCustomer)

        if(oldImage) {
            throw new Error('Erro ao atualizar registro!')
        }

        let newImageUpdated = null

        //Updando a nova imagem
        try {
            newImageUpdated = await CustomerUtil.uploadNewImageOnCustomerDirectory(newImage)
        } catch (error) {
            return new Error('Erro ao inserir imagem!')
        }

        const result = await CustomerUtil.insertNewImageInDatabase(idCustomer, newImageUpdated)

        //Gerando a url da nova imagem 
        const url_image = `${process.env.LOCAL_ADDRESS}/files/customers/${newImageUpdated}`

        if (typeof result === 'number') return url_image

        return new Error('Erro ao atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }

}
