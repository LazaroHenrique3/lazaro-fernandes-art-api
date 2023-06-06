import { ETableNames } from '../../ETablesNames'
import { IAddress } from '../../models'
import { Knex } from '../../knex'

export const getById = async (id: number, idCustomer: number): Promise<IAddress | Error> => {
    try {
        const result = await Knex(ETableNames.address).select('*').where('id', '=', id).andWhere('customer_id', '=', idCustomer).first()

        if(result) return result

        return new Error('Registro não encontrado!')
    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }
}