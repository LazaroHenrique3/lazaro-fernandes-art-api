import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'

export const count = async (filter = '', id: number): Promise<number | Error> => {
    try {
        const [{ count }] = await Knex(ETableNames.address)
            .where('id', id)
            .orWhere('street', 'like', `%${filter}%`)
            .count<[{ count: number }]>('* as count')

        if (Number.isInteger(Number(count))) return Number(count)

        return new Error('Erro ao consultar a quantidade total de registros!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar a quantidade total de registros!')
    }
}