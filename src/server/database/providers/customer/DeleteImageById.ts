import { Knex } from '../../knex'

//Funções auxiliares
import { CustomerUtil } from './util'

export const deleteImageById = async (idCustomer: number): Promise<void | Error> => {
    try {
        //Verificando se o id informado é valido
        const existsCustomer = await CustomerUtil.checkValidCustomerId(idCustomer)
        if (!existsCustomer) {
            return new Error('Id informado inválido!')
        }

        const result = await Knex.transaction(async (trx) => {
            let thereWasAnError = false

            //Garantindo que tem imagem a ser excluída, uma vez que ela é opcional
            const customerImage = await CustomerUtil.checkAndReturnNameOfCustomerImage(idCustomer, trx)

            const isUpdated = await CustomerUtil.changingUserImageToNull(idCustomer, trx)

            //Exluindo a imagem, caso exista
            if (customerImage !== null && customerImage !== undefined && isUpdated > 0) {
                const result = await CustomerUtil.deleteCustomerImageFromDirectory(customerImage)

                thereWasAnError = (result instanceof Error) ? true : false
            }

            // Garantindo que tanto a ação no banco quanto a ação do diretório foram bem sucedidas
            // Caso tenha acontecido algum erro será feito o rollback do banco
            if (!thereWasAnError) {
                return true
            } else {
                throw new Error('Erro ao apagar registro!')
            }

        })

        return (result) ? void 0 : new Error('Erro ao apagar Imagem!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao apagar Imagem!')
    }
}

