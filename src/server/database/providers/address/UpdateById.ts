import { PasswordCrypto } from '../../../shared/services'
import { ETableNames } from '../../ETablesNames'
import { IAddress } from '../../models'
import { Knex } from '../../knex'

export const updateById = async (id: number, idCustomer: number, address: Omit<IAddress, 'id' | 'customer_id'>): Promise<void | Error> => {
    try {
        const result = await Knex(ETableNames.address).update(address).where('id', '=', id).andWhere('customer_id', '=', idCustomer)

        if (result > 0) return

        return new Error('Erro ao atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }
}