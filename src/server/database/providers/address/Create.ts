import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'
import { IAddress } from '../../models'

export const create = async (address: Omit<IAddress, 'id'>): Promise<number | Error> => {
    try {

        const [result] = await Knex(ETableNames.address).insert(address).returning('id')

        //Ele pode retorna um ou outro dependendo do banco de dados
        if (typeof result === 'object') {
            return result.id
        } else if (typeof result === 'number') {
            return result
        }

        return new Error('Erro ao criar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao criar registro!')
    }
}