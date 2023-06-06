import { ETableNames } from '../../ETablesNames'
import { IAddress } from '../../models'
import { Knex } from '../../knex'

//Recebe aquele id para caso um item não esteja na primeira pagina, ele possa retornar junto
export const getAll = async (page: number, limit: number, filter: string, id: number): Promise<IAddress[] | Error> => {
    try {
        const result = await Knex(ETableNames.address)
            .select('*')
            .where('id', id)
            .orWhere('street', 'like', `%${filter}%`)
            .offset((page - 1) * limit)
            .limit(limit)

        return result
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar registros!')
    }
}