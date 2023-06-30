import { IAddress } from '../../models'

//Funções auxiliares
import { AddressUtil } from './util'

export const getById = async (idAdress: number, idCustomer: number): Promise<IAddress | Error> => {
    try {
        const result = await AddressUtil.getAddressById(idAdress, idCustomer)

        if(result) return result

        return new Error('Registro não encontrado!')
    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }
}