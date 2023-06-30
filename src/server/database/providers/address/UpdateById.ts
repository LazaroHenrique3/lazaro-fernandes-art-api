import { IAddress } from '../../models'

//Funções auxiliares
import { AddressUtil } from './util'

export const updateById = async (idAddress: number, idCustomer: number, address: Omit<IAddress, 'id' | 'customer_id'>): Promise<void | Error> => {

    try {
        const existsAddress = await AddressUtil.checkValidAddressId(idAddress)
        if (!existsAddress) {
            return new Error('Id informado inválido!')
        }

        const result = await AddressUtil.updateAddressInDatabase(idAddress, idCustomer, address)

        return (result !== undefined && result > 0) ? void 0 : new Error('Erro ao atualizar registro!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }

}