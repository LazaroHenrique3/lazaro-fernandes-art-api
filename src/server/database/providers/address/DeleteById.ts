//Funções auxiliares
import { AddressUtil } from './util'

export const deleteById = async (idAddress: number): Promise<void | Error> => {
    try {

        const existsAddress = await AddressUtil.checkValidAddressId(idAddress)
        if (!existsAddress) {
            return new Error('Id informado inválido!')
        }

        const result = await AddressUtil.deleteAddressFromDatabase(idAddress)

        return (result > 0) ? void 0 : new Error('Erro ao apagar registro!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao apagar registro!')
    }
}