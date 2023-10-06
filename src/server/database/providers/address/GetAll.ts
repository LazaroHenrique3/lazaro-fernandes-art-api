import { IAddress } from '../../models'

//Funções auxiliares
import { AddressUtil } from './util'

//Recebe aquele id para caso um item não esteja na primeira pagina, ele possa retornar junto
export const getAll = async (page: number, limit: number, filter: string, idAddress: number, idCustomer: number, showInative = false): Promise<IAddress[] | Error> => {

    try {
        const result = AddressUtil.getAddressWithFilter(filter, page, limit, idAddress, idCustomer, showInative)

        return result
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar registros!')
    }

}