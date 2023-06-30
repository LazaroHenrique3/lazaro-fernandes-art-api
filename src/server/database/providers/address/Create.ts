import { IAddress } from '../../models'

//Funções auxiliares
import { AddressUtil } from './util'

export const create = async (address: Omit<IAddress, 'id'>): Promise<number | Error> => {

    try {
        const result = await AddressUtil.insertNewAddressInDatabase(address)

        return (result) ? result : new Error('Erro ao criar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao criar registro!')
    }
    
}