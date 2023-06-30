import { Knex } from '../../knex'

//Funções auxiliares
import { CustomerUtil } from './util'

export const deleteById = async (idCustomer: number): Promise<void | Error> => {

    try {
        //Verificando se o id informado é valido
        const existsCustomer = await CustomerUtil.checkValidCustomerId(idCustomer)
        if (!existsCustomer) {
            return new Error('Id informado inválido!')
        }

        const result = await Knex.transaction(async (trx) => {
            let thereWasAnError = false

            const customerImage = await CustomerUtil.checkAndReturnNameOfCustomerImage(idCustomer, trx)

            const isDeleted = await CustomerUtil.deleteCustomerInDatabase(idCustomer, trx)

            // Excluindo a imagem, caso exista
            if (customerImage !== null && customerImage !== undefined && isDeleted > 0) {
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

        return (result) ? void 0 : new Error('Erro ao apagar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao apagar registro!')
    }

}





