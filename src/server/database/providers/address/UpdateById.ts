import { IAddress } from '../../models'

//Funções auxiliares
import { AddressUtil } from './util'
import { checkIfAddressIsLinkedToSaleInPreparation } from './util/checkFunctions'

export const updateById = async (idAddress: number, idCustomer: number, address: Omit<IAddress, 'id' | 'customer_id'>): Promise<void | Error> => {

    try {
        const existsAddress = await AddressUtil.checkValidAddressId(idAddress)
        if (!existsAddress) {
            return new Error('Id informado inválido!')
        }

        //Verificando se endereço esta viculado a alguma venda 'Ag. Pagamento' ou 'Em preparação'
        const addressIsLinkedToSaleInPreparation = await checkIfAddressIsLinkedToSaleInPreparation(idAddress)
        if (addressIsLinkedToSaleInPreparation) {
            return new Error('Este endereço não pode ser alterado enquanto estiver vinculado a vendas com status "Ag. Pagamento" ou "Em preparação"')
        }

        const result = await AddressUtil.updateAddressInDatabase(idAddress, idCustomer, address)

        return (result !== undefined && result > 0) ? void 0 : new Error('Erro ao atualizar registro!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }

}