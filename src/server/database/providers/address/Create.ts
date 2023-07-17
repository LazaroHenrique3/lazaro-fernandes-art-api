import { IAddress } from '../../models'

//Funções auxiliares
import { AddressUtil } from './util'

export const create = async (address: Omit<IAddress, 'id'>): Promise<number | Error> => {

    try {

        const existsCustomer = await AddressUtil.checkValidCustomerId(address.customer_id)
        if (!existsCustomer) {
            return new Error('Usuário inválido!')
        }

        const result = await AddressUtil.insertNewAddressInDatabase(address)

        return (result) ? result : new Error('Erro ao criar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao criar registro!')
    }

}