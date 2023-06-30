import { IImageObject } from '../../models'
import { Knex } from '../../knex'

import { UploadImages } from '../../../shared/services/UploadImagesServices'

//Funções auxiliares
import { CustomerUtil } from './util'

export const updateImageById = async (idCustomer: number, newImage: IImageObject): Promise<void | Error> => {

    try {
        //Verificando se o id informado é valido
        const existsCustomer = await CustomerUtil.checkValidCustomerId(idCustomer)
        if (!existsCustomer) {
            return new Error('Id informado inválido!')
        }

        const result = await Knex.transaction(async (trx) => {
            let thereWasAnError = false

            //Buscando o nome da imagem antiga
            const oldImage = await CustomerUtil.checkAndReturnNameOfCustomerImage(idCustomer, trx)

            //Upload da nova imagem 
            const newImageUpdated = await UploadImages.uploadImage(newImage, 'customers')

            const isUpdated = await CustomerUtil.updateCustomerImageInDatabase(idCustomer, newImageUpdated, trx)

            //Pode ser que o usuario não tenha cadastrado uma imagem previamente, deletando
            if (oldImage !== undefined) {
                const result = await CustomerUtil.deleteCustomerImageFromDirectory(oldImage)

                thereWasAnError = (result instanceof Error) ? true : false
            }

            // Garantindo que tanto a ação no banco quanto a ação do diretório foram bem sucedidas
            // Caso tenha acontecido algum erro será feito o rollback do banco
            if (!thereWasAnError) {
                return isUpdated
            } else {
                throw new Error('Erro ao apagar registro!')
            }

        })

        return (result > 0) ? void 0 : new Error('Erro ao atualizar registro!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }
}

